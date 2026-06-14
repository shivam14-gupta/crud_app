import { NavLink, useLocation } from 'react-router-dom';

const userLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/profile', label: 'Profile', icon: '👤' },
  { to: '/records', label: 'Records', icon: '📋' },
  { to: '/requests', label: 'Requests', icon: '📨' },
  { to: '/notifications', label: 'Notifications', icon: '🔔' },
  { to: '/activity-logs', label: 'Activity Logs', icon: '📜' },
];

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
  { to: '/admin/records', label: 'Records', icon: '📋' },
  { to: '/admin/requests', label: 'Requests', icon: '📨' },
  { to: '/admin/reports', label: 'Reports', icon: '📈' },
  { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 overflow-y-auto">
      <nav className="p-4 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
