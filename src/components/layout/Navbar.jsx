
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Droplet,
  UserPlus,
  AlertTriangle,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  LayoutDashboard
} from 'lucide-react';

import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const {
    currentUser,
    userRole,
    donorProfile,
    patientProfile,
    logoutDonor
  } = useAuth();

  const navigate = useNavigate();

  // Role-based emergency navigation
  const emergencyPath =
  currentUser && userRole === 'patient'
    ? '/create-blood-request'
    : '/emergency';

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Find Donors', path: '/find-donors' },
    { name: 'Blood Compatibility', path: '/compatibility' },
    { name: 'How It Works', path: '/how-it-works' },
    { name: 'Emergency Requests', path: emergencyPath, badge: 'Live SOS' }
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  const dashboardPath =
    userRole === 'patient' ? '/patient-dashboard' : '/dashboard';

  const profile =
    userRole === 'patient' ? patientProfile : donorProfile;

  const displayName =
    profile?.fullName || currentUser?.displayName || 'User';

  const bloodGroup = donorProfile?.bloodGroup;

  const handleLogout = async () => {
    try {
      await logoutDonor();
      closeMenu();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-3 group rounded-xl p-1"
          >
            <div className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] text-white shadow-md">
              <Droplet className="w-6 h-6 fill-white" />
            </div>

            <div className="flex flex-col">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#0F172A]">
                Blood<span className="text-[#DC2626]">Connect</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Donate Blood. Save Lives.
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-sm font-semibold ${
                    isActive
                      ? 'text-[#DC2626] bg-[#FEF2F2]'
                      : 'text-slate-600 hover:text-[#DC2626] hover:bg-slate-50'
                  }`
                }
              >
                {link.name}

                {link.badge && (
                  <span className="ml-1 text-[10px] font-bold bg-red-600 text-white px-1.5 py-0.5 rounded-full">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            ))}

            {currentUser && (
              <NavLink
                to={dashboardPath}
                className="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-[#DC2626]"
              >
                <LayoutDashboard className="inline w-4 h-4 mr-1" />
                Dashboard
              </NavLink>
            )}
          </nav>

          {/* Desktop Account */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#DC2626] text-white flex items-center justify-center font-bold text-xs">
                    {bloodGroup || <User className="w-4 h-4" />}
                  </div>

                  <div>
                    <span className="text-xs font-bold text-[#0F172A] block">
                      {displayName}
                    </span>
                    <span className="text-[10px] text-slate-500 capitalize">
                      {userRole || 'Account'}
                    </span>
                  </div>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2.5 rounded-xl border border-slate-200 hover:bg-red-50 text-slate-600 hover:text-[#DC2626]"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                <Button to="/login" variant="ghost" size="sm" icon={LogIn}>
                  Sign In
                </Button>

                <Button to="/patient-register" variant="outline" size="sm">
                  Register as Patient
                </Button>

                <Button to="/register" variant="primary" size="sm" icon={UserPlus}>
                  Register as Donor
                </Button>
              </>
            )}
          </div>

          {/* Mobile Header */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to={emergencyPath}
              className="px-2.5 py-1.5 bg-[#FEF2F2] border border-red-200 text-[#DC2626] rounded-xl text-xs font-bold flex items-center gap-1"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              SOS
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-600"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" />
                : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl">

          {currentUser && (
            <div className="mb-4 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <h4 className="font-bold text-sm">{displayName}</h4>
              <p className="text-xs text-slate-500">{currentUser.email}</p>
              <p className="text-xs text-red-600 font-semibold capitalize mt-1">
                {userRole} account
              </p>
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMenu}
                className="px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50"
              >
                {link.name}
              </NavLink>
            ))}

            {currentUser && (
              <NavLink
                to={dashboardPath}
                onClick={closeMenu}
                className="px-4 py-3 rounded-xl text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <LayoutDashboard className="w-5 h-5" />
                {userRole === 'patient'
                  ? 'Patient Dashboard'
                  : 'Donor Dashboard'}
              </NavLink>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            {currentUser ? (
              <button
                onClick={handleLogout}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            ) : (
              <>
                <Button
                  to="/login"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  onClick={closeMenu}
                >
                  Sign In
                </Button>

                <Button
                  to="/patient-register"
                  variant="outline"
                  size="md"
                  className="w-full justify-center"
                  onClick={closeMenu}
                >
                  Register as Patient
                </Button>

                <Button
                  to="/register"
                  variant="primary"
                  size="md"
                  className="w-full justify-center"
                  onClick={closeMenu}
                >
                  Register as Donor
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
