import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { recordAPI, requestAPI, notificationAPI } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';

export default function UserDashboard() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [requests, setRequests] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      recordAPI.getAll(),
      requestAPI.getAll(),
      notificationAPI.getAll(),
    ]).then(([recRes, reqRes, notRes]) => {
      setRecords(recRes.data);
      setRequests(reqRes.data);
      setNotifications(notRes.data);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const stats = [
    { label: 'My Records', value: records.length, color: 'bg-blue-500' },
    { label: 'Pending Requests', value: requests.filter(r => r.status === 'pending').length, color: 'bg-yellow-500' },
    { label: 'Approved', value: requests.filter(r => r.status === 'approved').length, color: 'bg-green-500' },
    { label: 'Notifications', value: notifications.filter(n => !n.isRead).length, color: 'bg-purple-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Welcome, {user.name}!</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} className="card">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Records</h2>
                <Link to="/records" className="text-sm text-primary-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {records.slice(0, 5).map((r) => (
                  <div key={r._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.title}</p>
                      <p className="text-xs text-gray-500">{formatDate(r.createdAt)}</p>
                    </div>
                    <span className={`badge-${r.status}`}>{r.status}</span>
                  </div>
                ))}
                {records.length === 0 && <p className="text-sm text-gray-400">No records yet</p>}
              </div>
            </div>

            <div className="card">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Recent Requests</h2>
                <Link to="/requests" className="text-sm text-primary-600 hover:underline">View All</Link>
              </div>
              <div className="space-y-3">
                {requests.slice(0, 5).map((r) => (
                  <div key={r._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{r.recordId?.title || 'Request'}</p>
                      <p className="text-xs text-gray-500">{formatDate(r.createdAt)}</p>
                    </div>
                    <span className={`badge-${r.status}`}>{r.status}</span>
                  </div>
                ))}
                {requests.length === 0 && <p className="text-sm text-gray-400">No requests yet</p>}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
