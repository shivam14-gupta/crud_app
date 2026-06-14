import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { notificationAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    notificationAPI.getAll().then(({ data }) => setNotifications(data)).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const markAsRead = async (id) => {
    await notificationAPI.markAsRead(id);
    fetch();
  };

  const markAllAsRead = async () => {
    await notificationAPI.markAllAsRead();
    fetch();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            <button onClick={markAllAsRead} className="btn-secondary text-sm py-1.5 px-3">Mark All Read</button>
          </div>

          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`card cursor-pointer transition-colors ${!n.isRead ? 'border-primary-300 bg-primary-50/50' : ''}`}
                onClick={() => !n.isRead && markAsRead(n._id)}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${n.isRead ? 'text-gray-600' : 'text-gray-900'}`}>{n.title}</p>
                    <p className="text-sm text-gray-500 mt-1">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-2">{formatDate(n.createdAt)}</p>
                  </div>
                  {!n.isRead && <span className="w-2 h-2 bg-primary-500 rounded-full mt-2"></span>}
                </div>
              </div>
            ))}
            {notifications.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-8">No notifications</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
