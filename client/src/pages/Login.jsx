import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('user'); // 'user' or 'admin'
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError('');
      
      const user = await login(data.email, data.password);
      
      // Role enforcement check
      if (activeTab === 'admin' && user.role !== 'admin') {
        // Log out immediately to clear local storage and context state
        await logout();
        setError('Access Denied: This account does not have administrator privileges.');
        return;
      }
      
      // Auto-routing based on role
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillCredentials = (email, password, role) => {
    setValue('email', email);
    setValue('password', password);
    setActiveTab(role);
    setError('');
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-500 ${
      activeTab === 'admin' 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white' 
        : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50 text-gray-800'
    }`}>
      <div className="w-full max-w-md">
        
        {/* Portal Header */}
        <div className="text-center mb-8">
          <Link 
            to="/" 
            className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
              activeTab === 'admin' ? 'text-indigo-400' : 'text-primary-600'
            }`}
          >
            MERN <span className={activeTab === 'admin' ? 'text-white' : 'text-gray-900'}>Manager</span>
          </Link>
          <p className={`mt-2 text-sm transition-colors duration-300 ${
            activeTab === 'admin' ? 'text-slate-400' : 'text-gray-600'
          }`}>
            {activeTab === 'admin' ? 'Enter the secure administrative portal' : 'Access your personal workspace dashboard'}
          </p>
        </div>

        {/* Login Card */}
        <div className={`rounded-2xl shadow-xl border p-8 transition-all duration-500 backdrop-blur-md ${
          activeTab === 'admin' 
            ? 'bg-slate-900/80 border-slate-700/50 shadow-indigo-950/20' 
            : 'bg-white/90 border-gray-100 shadow-gray-200/50'
        }`}>
          
          {/* Segmented Switch (Tabs) */}
          <div className={`flex p-1 rounded-xl mb-6 transition-colors duration-300 ${
            activeTab === 'admin' ? 'bg-slate-800' : 'bg-gray-100'
          }`}>
            <button
              type="button"
              onClick={() => { setActiveTab('user'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'user'
                  ? 'bg-white text-primary-600 shadow-sm'
                  : activeTab === 'admin'
                    ? 'text-slate-400 hover:text-white'
                    : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>👤</span> User Portal
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('admin'); setError(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              <span>🛡️</span> Admin Portal
            </button>
          </div>

          {/* Admin Guard Badge */}
          {activeTab === 'admin' && (
            <div className="mb-6 flex items-center gap-2 px-3 py-2 bg-indigo-950/60 border border-indigo-500/30 rounded-lg text-xs text-indigo-300">
              <span className="animate-pulse">🔒</span>
              <span><strong>Restricted Area:</strong> Authorized administrative personnel only. Role enforcement is active.</span>
            </div>
          )}

          {error && (
            <div className={`mb-6 p-4 border rounded-xl text-sm transition-all duration-300 animate-fade-in ${
              activeTab === 'admin'
                ? 'bg-red-950/60 border-red-500/30 text-red-300'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${
                activeTab === 'admin' ? 'text-slate-400' : 'text-gray-600'
              }`}>
                Email Address
              </label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: 'Please enter a valid email address'
                  }
                })}
                className={`w-full rounded-xl border px-4 py-3 text-sm transition-all outline-none focus:ring-2 ${
                  activeTab === 'admin'
                    ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                    : 'bg-white border-gray-200 text-gray-950 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/20'
                }`}
                placeholder={activeTab === 'admin' ? 'admin@example.com' : 'john@example.com'}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className={`block text-xs font-semibold uppercase tracking-wider ${
                  activeTab === 'admin' ? 'text-slate-400' : 'text-gray-600'
                }`}>
                  Password
                </label>
                <Link 
                  to="/forgot-password" 
                  className={`text-xs hover:underline ${
                    activeTab === 'admin' ? 'text-indigo-400' : 'text-primary-600'
                  }`}
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', { required: 'Password is required' })}
                  className={`w-full rounded-xl border pl-4 pr-10 py-3 text-sm transition-all outline-none focus:ring-2 ${
                    activeTab === 'admin'
                      ? 'bg-slate-800/80 border-slate-700 text-white placeholder-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20'
                      : 'bg-white border-gray-200 text-gray-950 placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500/20'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg focus:outline-none transition-colors ${
                    activeTab === 'admin' ? 'text-slate-400 hover:text-white' : 'text-gray-400 hover:text-gray-700'
                  }`}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={`w-full py-3.5 px-4 rounded-xl text-sm font-bold shadow-md transition-all active:scale-[0.98] ${
                activeTab === 'admin'
                  ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-950/20 hover:shadow-indigo-600/20 disabled:bg-slate-700'
                  : 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-500/20 hover:shadow-primary-600/20 disabled:bg-gray-300'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-b-transparent rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : (
                `Secure Sign In`
              )}
            </button>
          </form>

          {/* Registration link (Only appropriate for Users) */}
          {activeTab === 'user' && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary-600 font-semibold hover:underline">
                Create Account
              </Link>
            </p>
          )}
        </div>

        {/* Demo Accounts Panel */}
        <div className={`mt-6 rounded-2xl border p-5 transition-all duration-500 ${
          activeTab === 'admin'
            ? 'bg-slate-900/40 border-slate-800/80 text-slate-300 shadow-sm'
            : 'bg-white/60 border-gray-100 text-gray-600 shadow-sm'
        }`}>
          <h4 className={`text-xs font-bold uppercase tracking-wider mb-3 text-center ${
            activeTab === 'admin' ? 'text-indigo-400' : 'text-primary-600'
          }`}>
            🔑 Quick Demo Access
          </h4>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fillCredentials('admin@example.com', 'admin123', 'admin')}
              className={`flex items-center justify-between text-xs py-2.5 px-3.5 rounded-lg border transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>🛡️</span>
                <strong>Admin Demo:</strong> admin@example.com
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                activeTab === 'admin' ? 'bg-indigo-900/60 text-indigo-300' : 'bg-indigo-100 text-indigo-800'
              }`}>
                Auto Fill
              </span>
            </button>
            <button
              type="button"
              onClick={() => fillCredentials('john@example.com', 'user123', 'user')}
              className={`flex items-center justify-between text-xs py-2.5 px-3.5 rounded-lg border transition-all ${
                activeTab === 'admin'
                  ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 text-white'
                  : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👤</span>
                <strong>User Demo:</strong> john@example.com
              </span>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                activeTab === 'admin' ? 'bg-blue-900/60 text-blue-300' : 'bg-blue-100 text-blue-800'
              }`}>
                Auto Fill
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
