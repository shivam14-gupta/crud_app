import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(({ data }) => setStats(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-500' },
    { label: 'Active Users', value: stats.activeUsers, color: 'bg-green-500' },
    { label: 'Total Records', value: stats.totalRecords, color: 'bg-purple-500' },
    { label: 'Pending Requests', value: stats.pendingRequests, color: 'bg-yellow-500' },
    { label: 'Approved', value: stats.approvedRequests, color: 'bg-green-500' },
    { label: 'Rejected', value: stats.rejectedRequests, color: 'bg-red-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Admin Dashboard</h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {cards.map((card) => (
              <div key={card.label} className="card">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${card.color}`}></div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                    <p className="text-sm text-gray-500">{card.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
