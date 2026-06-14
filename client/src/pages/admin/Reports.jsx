import { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { adminAPI } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Reports() {
  const [reports, setReports] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getReports()
      .then(({ data }) => setReports(data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!reports) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Sidebar />
      <main className="pt-16 pl-64">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="card">
              <p className="text-2xl font-bold text-gray-900">{reports.totals.totalUsers}</p>
              <p className="text-sm text-gray-500">Total Users</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold text-gray-900">{reports.totals.totalRecords}</p>
              <p className="text-sm text-gray-500">Total Records</p>
            </div>
            <div className="card">
              <p className="text-2xl font-bold text-gray-900">{reports.totals.totalRequests}</p>
              <p className="text-sm text-gray-500">Total Requests</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Records by Status</h3>
              <div className="space-y-2">
                {reports.recordsByStatus.map((s) => (
                  <div key={s._id} className="flex justify-between text-sm">
                    <span className="capitalize">{s._id}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Requests by Status</h3>
              <div className="space-y-2">
                {reports.requestsByStatus.map((s) => (
                  <div key={s._id} className="flex justify-between text-sm">
                    <span className="capitalize">{s._id}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="card">
              <h3 className="text-sm font-medium text-gray-500 uppercase mb-3">Users by Role</h3>
              <div className="space-y-2">
                {reports.usersByRole.map((s) => (
                  <div key={s._id} className="flex justify-between text-sm">
                    <span className="capitalize">{s._id}</span>
                    <span className="font-medium">{s.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {reports.recentActivities.slice(0, 10).map((a) => (
                <div key={a._id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{a.userId?.name || 'Unknown'}</span>
                      {' - '}{a.description}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(a.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
