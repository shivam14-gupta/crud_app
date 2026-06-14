import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { activityLogAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    activityLogAPI.getAll()
      .then(({ data }) => setLogs(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Activity Logs</h1>

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <span className="badge bg-blue-100 text-blue-800">{log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{log.description}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(log.createdAt)}</td>
                  </tr>
                ))}
                {logs.length === 0 && (
                  <tr><td colSpan={3} className="px-4 py-8 text-center text-sm text-gray-400">No activity logs</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
