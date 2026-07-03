import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import UpdatePassword from './pages/UpdatePassword';
import UserStores from './pages/UserStores';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserNew from './pages/admin/AdminUserNew';
import AdminUserDetail from './pages/admin/AdminUserDetail';
import AdminStores from './pages/admin/AdminStores';
import AdminStoreNew from './pages/admin/AdminStoreNew';

function Home() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'ADMIN') return <Navigate to="/admin/dashboard" replace />;
  if (user.role === 'STORE_OWNER') return <Navigate to="/store-owner/dashboard" replace />;
  return <Navigate to="/stores" replace />;
}

export default function App() {
  return (
    <div className="min-h-screen bg-parchment">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route
          path="/update-password"
          element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          }
        />

        {/* Normal user */}
        <Route
          path="/stores"
          element={
            <ProtectedRoute roles={['NORMAL_USER']}>
              <UserStores />
            </ProtectedRoute>
          }
        />

        {/* Store owner */}
        <Route
          path="/store-owner/dashboard"
          element={
            <ProtectedRoute roles={['STORE_OWNER']}>
              <StoreOwnerDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/new"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminUserNew />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminUserDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminStores />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stores/new"
          element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminStoreNew />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
