import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { recordAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Records() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetchRecords = () => {
    setLoading(true);
    recordAPI.getAll().then(({ data }) => setRecords(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetchRecords(); }, []);

  const onSubmit = async (data) => {
    try {
      setError('');
      if (editing) {
        await recordAPI.update(editing, data);
      } else {
        await recordAPI.create(data);
      }
      setShowForm(false);
      setEditing(null);
      reset();
      fetchRecords();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (record) => {
    setEditing(record._id);
    reset({ title: record.title, description: record.description });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this record?')) return;
    try {
      await recordAPI.delete(id);
      fetchRecords();
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
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Records</h1>
            <button onClick={() => { setShowForm(!showForm); setEditing(null); reset({ title: '', description: '' }); }} className="btn-primary">
              {showForm ? 'Cancel' : '+ New Record'}
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit Record' : 'Create Record'}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input {...register('title', { required: 'Title is required' })} className="input-field" placeholder="Enter record title" />
                  {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea {...register('description')} className="input-field" rows={3} placeholder="Optional description" />
                </div>
                <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
              </form>
            </div>
          )}

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Title</th>
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
                    <td className="px-4 py-3"><span className={`badge-${r.status}`}>{r.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => handleEdit(r)} className="text-sm text-primary-600 hover:underline mr-3">Edit</button>
                      <button onClick={() => handleDelete(r._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-8 text-center text-sm text-gray-400">No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
