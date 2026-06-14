import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { recordAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function RecordManagement() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetch = () => {
    setLoading(true);
    recordAPI.getAll().then(({ data }) => setRecords(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleStatusUpdate = async (id, status) => {
    try {
      setError('');
      await recordAPI.update(id, { status });
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await recordAPI.delete(id);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Record Management</h1>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Created By</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="text-sm font-medium text-gray-900">{r.title}</p>
                      {r.description && <p className="text-xs text-gray-500 truncate max-w-xs">{r.description}</p>}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.createdBy?.name || 'N/A'}</td>
                    <td className="px-4 py-3"><span className={`badge-${r.status}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <select
                        value={r.status}
                        onChange={(e) => handleStatusUpdate(r._id, e.target.value)}
                        className="text-xs border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                      </select>
                      <button onClick={() => handleDelete(r._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
