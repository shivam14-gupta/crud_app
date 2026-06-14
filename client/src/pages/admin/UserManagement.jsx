import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const fetch = () => {
    setLoading(true);
    adminAPI.getUsers().then(({ data }) => setUsers(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const onSubmit = async (data) => {
    try {
      setError('');
      if (editing) {
        await adminAPI.updateUser(editing, data);
      } else {
        await adminAPI.createUser(data);
      }
      setShowForm(false);
      setEditing(null);
      reset();
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Operation failed');
    }
  };

  const handleEdit = (user) => {
    setEditing(user._id);
    reset({ name: user.name, email: user.email, role: user.role, status: user.status });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await adminAPI.deleteUser(id);
      fetch();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleSuspend = async (user) => {
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    await adminAPI.updateUser(user._id, { status: newStatus });
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <button onClick={() => { setShowForm(!showForm); setEditing(null); reset({ name: '', email: '', password: '', role: 'user' }); }} className="btn-primary">
              {showForm ? 'Cancel' : '+ Add User'}
            </button>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          {showForm && (
            <div className="card mb-6">
              <h2 className="text-lg font-semibold mb-4">{editing ? 'Edit User' : 'Create User'}</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input {...register('name', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input {...register('email', { required: true })} className="input-field" />
                </div>
                {!editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                    <input type="password" {...register('password', { required: !editing, minLength: { value: 6, message: 'Min 6 characters' } })} className="input-field" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <select {...register('role')} className="input-field">
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                {editing && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select {...register('status')} className="input-field">
                      <option value="active">Active</option>
                      <option value="suspended">Suspended</option>
                    </select>
                  </div>
                )}
                <div className="md:col-span-2">
                  <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'}</button>
                </div>
              </form>
            </div>
          )}

          <div className="card p-0 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 uppercase">Joined</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="px-4 py-3"><span className="badge bg-gray-100 text-gray-700 capitalize">{u.role}</span></td>
                    <td className="px-4 py-3"><span className={`badge-${u.status}`}>{u.status}</span></td>
                    <td className="px-4 py-3 text-sm text-gray-500">{formatDate(u.createdAt)}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button onClick={() => handleEdit(u)} className="text-sm text-primary-600 hover:underline">Edit</button>
                      <button onClick={() => handleSuspend(u)} className={`text-sm ${u.status === 'active' ? 'text-yellow-600' : 'text-green-600'} hover:underline`}>
                        {u.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="text-sm text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
