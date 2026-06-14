import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { useAuth } from '../../context/AuthContext';
import { userAPI } from '../../services/api';

export default function AdminSettings() {
  const { user, setUser } = useAuth();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit } = useForm({
    defaultValues: { name: user.name, email: user.email },
  });

  const { register: pwdRegister, handleSubmit: pwdSubmit, watch, reset: pwdReset } = useForm();

  const onProfileSubmit = async (data) => {
    try {
      setError('');
      const res = await userAPI.updateProfile(data);
      setUser(res.data);
      setMessage('Profile updated');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setError('');
      await userAPI.changePassword(data);
      setMessage('Password changed');
      pwdReset();
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

          {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <div className="card mb-6">
            <h2 className="text-lg font-semibold mb-4">Admin Profile</h2>
            <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input {...register('name')} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input {...register('email')} className="input-field" />
              </div>
              <button type="submit" className="btn-primary">Save Changes</button>
            </form>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={pwdSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" {...pwdRegister('currentPassword', { required: true })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" {...pwdRegister('newPassword', { required: true, minLength: { value: 6 } })} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm</label>
                <input type="password" {...pwdRegister('confirmNewPassword', { required: true, validate: (val) => val === watch('newPassword') })} className="input-field" />
              </div>
              <button type="submit" className="btn-primary">Change Password</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
