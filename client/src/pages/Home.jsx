import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50">
      <Navbar />
      <main className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            MERN <span className="text-primary-600">Management</span> System
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            A production-ready full-stack application with secure authentication,
            role-based access control, workflow management, and real-time analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            <Link to="/register" className="btn-primary text-base px-8 py-3">Get Started</Link>
            <Link to="/login" className="btn-secondary text-base px-8 py-3">Sign In</Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-left">
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">🔐 Secure Auth</h3>
              <p className="text-sm text-gray-600">JWT authentication with refresh tokens, password encryption, and role-based access control.</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📊 Dashboard</h3>
              <p className="text-sm text-gray-600">Personalized dashboards with statistics, recent activities, and request tracking.</p>
            </div>
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 CRUD Operations</h3>
              <p className="text-sm text-gray-600">Full CRUD for records and requests with admin approval workflows.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
