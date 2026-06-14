import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-30 h-16">
      <div className="px-4 h-full flex items-center justify-between">
        <Link to="/" className="text-xl font-bold text-primary-600">
          MERN <span className="text-gray-800">Manager</span>
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                Dashboard
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                  Admin
                </Link>
              )}
              <Link to="/profile" className="text-sm text-gray-600 hover:text-gray-900">
                {user.name}
              </Link>
              <button onClick={logout} className="btn-secondary text-sm py-1.5 px-3">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
