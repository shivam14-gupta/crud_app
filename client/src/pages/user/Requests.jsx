import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { requestAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    requestAPI.getAll().then(({ data }) => setRequests(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await requestAPI.delete(id);
      fetch();
    } catch {}
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-5xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Requests</h1>

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Record</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Feedback</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{r.recordId?.title || 'N/A'}</td>
                    <td className="px-4 py-3"><span className={`badge-${r.status}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.feedback || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      {r.status === 'pending' && (
                        <button onClick={() => handleDelete(r._id)} className="text-sm text-red-600 hover:underline">Cancel</button>
                      )}
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
