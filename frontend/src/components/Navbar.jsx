import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ROLE_LABEL = {
  ADMIN: 'System Administrator',
  NORMAL_USER: 'Normal User',
  STORE_OWNER: 'Store Owner',
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="border-b border-ink/10 bg-teal-deep text-parchment">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-xl tracking-tight">
          Store <span className="text-brass">Ledger</span>
        </Link>

        {user && (
          <nav className="flex items-center gap-6 font-body text-sm">
            {user.role === 'ADMIN' && (
              <>
                <Link to="/admin/dashboard" className="hover:text-brass transition-colors">Dashboard</Link>
                <Link to="/admin/users" className="hover:text-brass transition-colors">Users</Link>
                <Link to="/admin/stores" className="hover:text-brass transition-colors">Stores</Link>
              </>
            )}
            {user.role === 'NORMAL_USER' && (
              <Link to="/stores" className="hover:text-brass transition-colors">Stores</Link>
            )}
            {user.role === 'STORE_OWNER' && (
              <Link to="/store-owner/dashboard" className="hover:text-brass transition-colors">My Store</Link>
            )}
            <Link to="/update-password" className="hover:text-brass transition-colors">Password</Link>
            <span className="hidden text-xs uppercase tracking-wide text-parchment/60 sm:inline">
              {ROLE_LABEL[user.role]}
            </span>
            <button
              onClick={handleLogout}
              className="rounded border border-brass/60 px-3 py-1.5 text-brass transition-colors hover:bg-brass hover:text-teal-deep"
            >
              Log out
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
