import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import UserDashboard from './pages/user/Dashboard';
import UserProfile from './pages/user/Profile';
import UserRecords from './pages/user/Records';
import UserRequests from './pages/user/Requests';
import UserNotifications from './pages/user/Notifications';
import UserActivityLogs from './pages/user/ActivityLogs';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/UserManagement';
import AdminRecords from './pages/admin/RecordManagement';
import AdminRequests from './pages/admin/RequestManagement';
import AdminReports from './pages/admin/Reports';
import AdminSettings from './pages/admin/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/dashboard" element={<ProtectedRoute><UserDashboard /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
          <Route path="/records" element={<ProtectedRoute><UserRecords /></ProtectedRoute>} />
          <Route path="/requests" element={<ProtectedRoute><UserRequests /></ProtectedRoute>} />
          <Route path="/notifications" element={<ProtectedRoute><UserNotifications /></ProtectedRoute>} />
          <Route path="/activity-logs" element={<ProtectedRoute><UserActivityLogs /></ProtectedRoute>} />

          <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><AdminUsers /></ProtectedRoute>} />
          <Route path="/admin/records" element={<ProtectedRoute roles={['admin']}><AdminRecords /></ProtectedRoute>} />
          <Route path="/admin/requests" element={<ProtectedRoute roles={['admin']}><AdminRequests /></ProtectedRoute>} />
          <Route path="/admin/reports" element={<ProtectedRoute roles={['admin']}><AdminReports /></ProtectedRoute>} />
          <Route path="/admin/settings" element={<ProtectedRoute roles={['admin']}><AdminSettings /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
