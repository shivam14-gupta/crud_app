import { useState } from 'react';
import { useForm } from 'react-hook-form';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import { userAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Profile() {
  const { user, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: { name: user.name, email: user.email },
  });

  const { register: pwdRegister, handleSubmit: pwdSubmit, formState: { errors: pwdErrors }, watch, reset } = useForm();

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        setError('');
        const base64String = reader.result;
        const res = await userAPI.updateProfile({ name: user.name, email: user.email, avatar: base64String });
        setUser(res.data);
        setMessage('Profile picture updated successfully');
      } catch (err) {
        setError(err.response?.data?.message || 'Avatar upload failed');
      }
    };
    reader.readAsDataURL(file);
  };

  const onProfileSubmit = async (data) => {
    try {
      setError('');
      const res = await userAPI.updateProfile({ ...data, avatar: user.avatar });
      setUser(res.data);
      setMessage('Profile updated');
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const onPasswordSubmit = async (data) => {
    try {
      setError('');
      await userAPI.changePassword(data);
      setMessage('Password changed');
      reset();
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
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Profile</h1>

          {message && <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">{message}</div>}
          {error && <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">{error}</div>}

          <div className="card mb-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Account Details</h2>
              {!editing && (
                <button onClick={() => setEditing(true)} className="btn-secondary text-sm py-1.5 px-3">Edit Details</button>
              )}
            </div>

            {/* Premium Avatar Upload Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 mb-6 border-b border-gray-100">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold uppercase transition-all duration-300 group-hover:scale-105">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <span>{user.name?.charAt(0) || 'U'}</span>
                  )}
                </div>
                <label className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-full text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                  Change Photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>
              <div className="text-center sm:text-left">
                <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
                <p className="text-sm text-gray-500 capitalize mb-3">{user.role} Portal Access</p>
                <label className="btn-secondary text-xs py-2 px-4 cursor-pointer hover:bg-gray-100 transition-colors">
                  Upload Photo
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
                <p className="text-[10px] text-gray-400 mt-2">Max size: 2MB. Format: JPG, PNG, GIF</p>
              </div>
            </div>

            {editing ? (
              <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input {...register('name', { required: true })} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input {...register('email', { required: true })} className="input-field" />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="btn-primary">Save Changes</button>
                  <button type="button" onClick={() => setEditing(false)} className="btn-secondary">Cancel</button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Name</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{user.name}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{user.email}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Security Role</p>
                  <p className="text-sm font-medium text-gray-900 mt-1 capitalize">{user.role}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Account Status</p>
                  <div className="mt-1">
                    <span className={`badge-${user.status}`}>{user.status}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Change Password</h2>
            <form onSubmit={pwdSubmit(onPasswordSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                <input type="password" {...pwdRegister('currentPassword', { required: true })} className="input-field" />
                {pwdErrors.currentPassword && <p className="text-red-500 text-xs mt-1">Required</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input type="password" {...pwdRegister('newPassword', { required: true, minLength: { value: 6, message: 'Min 6 characters' } })} className="input-field" />
                {pwdErrors.newPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.newPassword.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                <input type="password" {...pwdRegister('confirmNewPassword', { required: true, validate: (val) => val === watch('newPassword') || 'Passwords do not match' })} className="input-field" />
                {pwdErrors.confirmNewPassword && <p className="text-red-500 text-xs mt-1">{pwdErrors.confirmNewPassword.message}</p>}
              </div>
              <button type="submit" className="btn-primary">Change Password</button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
