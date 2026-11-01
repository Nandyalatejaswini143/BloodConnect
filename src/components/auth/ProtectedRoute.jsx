
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Droplet } from 'lucide-react';

export default function ProtectedRoute({
  children,
  allowedRole
}) {
  const {
    currentUser,
    userRole,
    loading
  } = useAuth();

  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-[#FEF2F2] border border-red-200 text-[#DC2626] mb-4">
          <Droplet className="w-8 h-8 fill-[#DC2626] animate-bounce" />
          <span className="animate-ping absolute inline-flex h-full w-full rounded-2xl bg-red-400 opacity-20"></span>
        </div>

        <p className="text-sm font-semibold text-slate-700">
          Verifying account authorization...
        </p>

        <span className="text-xs text-slate-400 mt-1">
          Connecting to BloodConnect Security
        </span>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Wait for the user's role before making authorization decisions.
  if (!userRole) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-sm text-slate-500">
          Verifying your account role...
        </p>
      </div>
    );
  }

  if (allowedRole && userRole !== allowedRole) {
    const redirectPath =
      userRole === 'donor'
        ? '/dashboard'
        : userRole === 'patient'
          ? '/patient-dashboard'
          : '/login';

    return <Navigate to={redirectPath} replace />;
  }

  return children;
}
