import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { requestAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function RequestManagement() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [feedbackId, setFeedbackId] = useState(null);
  const { register, handleSubmit, reset } = useForm();

  const fetch = () => {
    setLoading(true);
    requestAPI.getAll().then(({ data }) => setRequests(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleStatus = async (id, status) => {
    try {
      setError('');
      if (status === 'rejected') {
        setFeedbackId(id);
        return;
      }
      await requestAPI.update(id, { status });
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleFeedback = async (data) => {
    try {
      await requestAPI.update(feedbackId, { status: 'rejected', feedback: data.feedback });
      setFeedbackId(null);
      reset();
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await requestAPI.delete(id);
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Request Management</h1>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {feedbackId && (
            <div className="card mb-6">
              <h2 className="text-lg font-semibold mb-4">Provide Feedback</h2>
              <form onSubmit={handleSubmit(handleFeedback)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feedback</label>
                  <textarea {...register('feedback', { required: true })} className="input-field" rows={3} placeholder="Reason for rejection..." />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Submit</button>
                  <button type="button" onClick={() => setFeedbackId(null)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            </div>
          )}

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">User</th>
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
                    <td className="px-4 py-3 text-sm text-gray-900">{r.userId?.name || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{r.recordId?.title || 'N/A'}</td>
                    <td className="px-4 py-3"><span className={`badge-${r.status}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[150px] truncate">{r.feedback || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => handleStatus(r._id, 'approved')} className="text-sm text-green-600 hover:underline">Approve</button>
                          <button onClick={() => handleStatus(r._id, 'rejected')} className="text-sm text-red-600 hover:underline">Reject</button>
                        </>
                      )}
                      <button onClick={() => handleDelete(r._id)} className="text-sm text-gray-500 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-400">No requests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
