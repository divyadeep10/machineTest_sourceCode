// server/routes/listRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parser');
const ExcelJS = require('exceljs');
const { protect, admin } = require('../middleware/authMiddleware');
const Task = require('../models/Task');
const User = require('../models/User'); // To get agents
const asyncHandler = require('express-async-handler');
const { Readable } = require('stream');

// Configure Multer for file uploads
const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel', // .xls
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only CSV, XLS, and XLSX files are allowed.'), false);
    }
  },
});

// Function to parse CSV data
const parseCsv = (buffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const stream = Readable.from(buffer.toString()); // Create readable stream from buffer
    stream
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
        resolve(results);
      })
      .on('error', (error) => reject(error));
  });
};

// Function to parse XLSX data
const parseXlsx = async (buffer) => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer);
  const worksheet = workbook.getWorksheet(1); // Get the first worksheet
  const results = [];

  if (!worksheet) {
    throw new Error('No worksheet found in the Excel file.');
  }

  // Assuming the first row contains headers: FirstName, Phone, Notes
  const headerRow = worksheet.getRow(1).values;
  const headers = headerRow.map(header => typeof header === 'object' ? header.result : header); // Handle rich text headers

  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Skip header row

    const rowData = {};
    row.eachCell((cell, colNumber) => {
      const header = headers[colNumber - 1]; // Adjust for 1-based indexing
      if (header) {
        rowData[header] = cell.value;
      }
    });
    results.push(rowData);
  });
  return results;
};


// @desc    Upload CSV/XLSX and distribute tasks
// @route   POST /api/lists/upload
// @access  Private/Admin
router.post(
  '/upload',
  protect,
  admin,
  upload.single('file'), // 'file' is the field name for the uploaded file
  asyncHandler(async (req, res) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded.' });
      return;
    }

    let data;
    try {
      if (req.file.mimetype === 'text/csv') {
        data = await parseCsv(req.file.buffer);
      } else if (
        req.file.mimetype === 'application/vnd.ms-excel' ||
        req.file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        data = await parseXlsx(req.file.buffer);
      } else {
        res.status(400).json({ message: 'Unsupported file type.' });
        return;
      }
    } catch (parseError) {
      console.error('File parsing error:', parseError);
      res.status(400).json({ message: `Error parsing file: ${parseError.message}` });
      return;
    }

    // Validate uploaded data format
    if (!data || data.length === 0) {
      res.status(400).json({ message: 'Uploaded file is empty or could not be parsed.' });
      return;
    }

    // Check for required headers (case-insensitive)
    const requiredHeaders = ['firstname', 'phone', 'notes'];
    const firstRowKeys = Object.keys(data[0]).map(key => key.toLowerCase());
    const missingHeaders = requiredHeaders.filter(header => !firstRowKeys.includes(header));

    if (missingHeaders.length > 0) {
      res.status(400).json({ message: `Missing required columns: ${missingHeaders.join(', ')}. Expected: FirstName, Phone, Notes` });
      return;
    }

    // Get all agents
    const agents = await User.find({ role: 'agent' });

    if (agents.length === 0) {
      res.status(400).json({ message: 'No agents available to distribute tasks.' });
      return;
    }

    const numAgents = agents.length;
    // const totalItems = data.length; // Not directly used in distribution logic

    // Clear existing tasks before adding new ones
    // This ensures that each upload creates a fresh distribution based on the new file.
    await Task.deleteMany({});

    const tasksToSave = [];
    let agentIndex = 0;

    data.forEach((item) => {
      const agentId = agents[agentIndex]._id; // Get agent's ID

      tasksToSave.push({
        firstName: item.FirstName || item.firstname, // Handle potential case differences
        phone: String(item.Phone || item.phone), // Ensure phone is stored as string
        notes: item.Notes || item.notes || '',
        assignedTo: agentId,
        status: 'pending', // Explicitly set status to pending on creation
      });

      // Distribute sequentially by cycling through available agents
      agentIndex = (agentIndex + 1) % numAgents;
    });

    // Save distributed tasks to the database
    await Task.insertMany(tasksToSave);

    res.status(200).json({ message: 'File uploaded and tasks distributed successfully!' });
  })
);

// @desc    Get distributed tasks for all agents
// @route   GET /api/lists/distributed
// @access  Private/Admin
router.get(
  '/distributed',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    // Populate assignedTo with agent's name and email
    const distributedTasks = await Task.find({}).populate('assignedTo', 'name email');
    res.json(distributedTasks);
  })
);

// @desc    Get tasks assigned to a specific agent (for agent's dashboard)
// @route   GET /api/lists/my-tasks
// @access  Private/Agent
router.get(
  '/my-tasks',
  protect,
  asyncHandler(async (req, res) => {
    if (req.user.role !== 'agent') {
      res.status(403).json({ message: 'Access denied. Only agents can view their tasks.' });
      return;
    }
    const myTasks = await Task.find({ assignedTo: req.user._id });
    res.json(myTasks);
  })
);

// @desc    Update a task's status
// @route   PUT /api/lists/tasks/:id/status
// @access  Private/Agent or Admin
router.put(
  '/tasks/:id/status',
  protect,
  asyncHandler(async (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    // Validate the incoming status
    const validStatuses = ['pending', 'in-progress', 'completed'];
    if (!status || !validStatuses.includes(status)) {
      res.status(400).json({ message: 'Invalid or missing status. Must be one of: pending, in-progress, completed.' });
      return;
    }

    const task = await Task.findById(id);

    if (!task) {
      res.status(404).json({ message: 'Task not found.' });
      return;
    }

    // Check if the user is an admin OR the assigned agent
    if (req.user.role === 'admin' || (req.user.role === 'agent' && task.assignedTo.toString() === req.user._id.toString())) {
      task.status = status;
      await task.save();
      res.json({ message: 'Task status updated successfully', task });
    } else {
      res.status(403).json({ message: 'Not authorized to update this task.' });
    }
  })
);

module.exports = router;