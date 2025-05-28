// client/src/components/UploadList.js
import React, { useState } from 'react';
import listService from '../services/list';

const UploadList = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await listService.uploadList(selectedFile);
      setMessage(response.message);
      setSelectedFile(null); // Clear selected file after successful upload
    } catch (error) {
      setMessage(error);
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Upload & Distribute Lists</h2>

      {message && (
        <div
          className={`px-4 py-3 rounded-lg mb-6 ${
            message.includes('successfully') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
          }`}
          role="alert"
        >
          {message}
        </div>
      )}

      <div className="bg-white p-8 rounded-xl shadow-md">
        <h3 className="text-2xl font-semibold text-gray-700 mb-6">Upload CSV/XLSX File</h3>
        <div className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-gray-700 text-sm font-semibold mb-2">
              Select File (CSV, XLS, XLSX)
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {selectedFile && (
              <p className="mt-2 text-sm text-gray-500">Selected file: {selectedFile.name}</p>
            )}
          </div>
          <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className={`w-full py-3 rounded-lg font-semibold shadow-md transition duration-300 ${
              !selectedFile || loading
                ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Uploading & Distributing...' : 'Upload and Distribute'}
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-600">
          * Ensure your CSV/XLSX file has columns named "FirstName", "Phone", and "Notes".
        </p>
      </div>
    </div>
  );
};

export default UploadList;
