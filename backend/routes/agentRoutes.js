// server/routes/agentRoutes.js
const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Reusing User model for agents
const { protect, admin } = require('../middleware/authMiddleware');
const asyncHandler = require('express-async-handler');

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private/Admin
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const agents = await User.find({ role: 'agent' }).select('-password'); // Exclude password
    res.json(agents);
  })
);

// @desc    Create a new agent
// @route   POST /api/agents
// @access  Private/Admin
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      res.status(400).json({ message: 'Please enter all required fields' });
      return;
    }

    const agentExists = await User.findOne({ email });

    if (agentExists) {
      res.status(400).json({ message: 'Agent with this email already exists' });
      return;
    }

    const agent = await User.create({
      name,
      email,
      mobile,
      password, // Password will be hashed by pre-save hook in User model
      role: 'agent',
    });

    if (agent) {
      res.status(201).json({
        _id: agent._id,
        name: agent.name,
        email: agent.email,
        mobile: agent.mobile,
        role: agent.role,
      });
    } else {
      res.status(400).json({ message: 'Invalid agent data' });
    }
  })
);

// @desc    Update an agent
// @route   PUT /api/agents/:id
// @access  Private/Admin
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { name, email, mobile, password } = req.body;
    const agent = await User.findById(req.params.id);

    if (agent && agent.role === 'agent') {
      agent.name = name || agent.name;
      agent.email = email || agent.email;
      agent.mobile = mobile || agent.mobile;

      // Only update password if provided
      if (password) {
        agent.password = password; // Pre-save hook will hash it
      }

      const updatedAgent = await agent.save();

      res.json({
        _id: updatedAgent._id,
        name: updatedAgent.name,
        email: updatedAgent.email,
        mobile: updatedAgent.mobile,
        role: updatedAgent.role,
      });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  })
);

// @desc    Delete an agent
// @route   DELETE /api/agents/:id
// @access  Private/Admin
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const agent = await User.findById(req.params.id);

    if (agent && agent.role === 'agent') {
      await agent.deleteOne(); // Use deleteOne() instead of remove()
      res.json({ message: 'Agent removed' });
    } else {
      res.status(404).json({ message: 'Agent not found' });
    }
  })
);

module.exports = router;
