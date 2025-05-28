// client/src/components/DistributedLists.js
import React, { useState, useEffect } from 'react';
import listService from '../services/list';

const DistributedLists = () => {
  const [distributedTasks, setDistributedTasks] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDistributedTasks();
  }, []);

  const fetchDistributedTasks = async () => {
    try {
      const data = await listService.getDistributedLists();
      // Group tasks by assigned agent for easier display
      const groupedTasks = data.reduce((acc, task) => {
        const agentName = task.assignedTo ? task.assignedTo.name : 'Unassigned';
        const agentEmail = task.assignedTo ? task.assignedTo.email : 'N/A';
        const agentId = task.assignedTo ? task.assignedTo._id : 'unassigned';

        if (!acc[agentId]) {
          acc[agentId] = {
            name: agentName,
            email: agentEmail,
            tasks: [],
          };
        }
        acc[agentId].tasks.push(task);
        return acc;
      }, {});
      setDistributedTasks(Object.values(groupedTasks)); // Convert object back to array for rendering
    } catch (error) {
      setMessage(error);
      console.error('Error fetching distributed tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center p-8">Loading distributed lists...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Distributed Lists Overview</h2>

      {message && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6" role="alert">
          {message}
        </div>
      )}

      {distributedTasks.length === 0 ? (
        <p className="text-gray-600">No lists have been distributed yet.</p>
      ) : (
        <div className="space-y-8">
          {distributedTasks.map((agentGroup, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-semibold text-gray-700 mb-4">
                Agent: {agentGroup.name} ({agentGroup.email}) - {agentGroup.tasks.length} Tasks
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        First Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {agentGroup.tasks.map((task) => (
                      <tr key={task._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {task.firstName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.phone}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{task.notes}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              task.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : task.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-blue-100 text-blue-800'
                            }`}
                          >
                            {task.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DistributedLists;
