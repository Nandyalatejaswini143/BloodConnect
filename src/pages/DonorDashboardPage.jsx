import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  LogOut,
  ArrowRight,
  Activity,
  Award
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { BLOOD_COMPATIBILITY_DATA } from '../data/bloodCompatibility';
import Button from '../components/common/Button';

export default function DonorDashboardPage() {
  const { currentUser, donorProfile, logoutDonor, updateAvailability } = useAuth();
  const navigate = useNavigate();

  const [togglingAvailability, setTogglingAvailability] = useState(false);
  const [toggleSuccess, setToggleSuccess] = useState('');

  // Fallback values while donorProfile document synchronizes
  const fullName = donorProfile?.fullName || currentUser?.displayName || 'Voluntary Donor';
  const email = donorProfile?.email || currentUser?.email || '';
  const bloodGroup = donorProfile?.bloodGroup || 'O+';
  const city = donorProfile?.city || 'Local Region';
  const isAvailable = Boolean(donorProfile?.availability);

  // Blood group info
  const groupInfo = BLOOD_COMPATIBILITY_DATA[bloodGroup] || BLOOD_COMPATIBILITY_DATA['O+'];

  const handleToggle = async () => {
    try {
      setTogglingAvailability(true);
      setToggleSuccess('');
      const nextVal = !isAvailable;
      await updateAvailability(nextVal);
      setToggleSuccess(nextVal ? 'Availability updated: You are now active for emergency response.' : 'Availability updated: Status set to resting.');
      setTimeout(() => setToggleSuccess(''), 4000);
    } catch (err) {
      console.error('Error toggling availability:', err);
    } finally {
      setTogglingAvailability(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutDonor();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-[calc(100vh-80px)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Profile Header Bar */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            
            {/* Blood Type Badge */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] text-white flex flex-col items-center justify-center font-black shadow-lg shadow-red-500/25 shrink-0">
              <span className="text-2xl sm:text-3xl leading-none">{bloodGroup}</span>
              <span className="text-[10px] uppercase tracking-wider opacity-90 mt-0.5">Donor</span>
            </div>

            {/* Profile Info */}
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
                  {fullName}
                </h1>
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authenticated Donor</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {email}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                  {city}
                </span>
              </p>

              <p className="text-[11px] text-slate-400 font-mono pt-0.5">
                UID: {currentUser?.uid}
              </p>
            </div>

          </div>

          {/* Donor Actions */}
<div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-center">

  <Link
    to="/donor-requests"
    className="px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-semibold transition-all flex items-center gap-2 shadow-sm"
  >
    <Activity className="w-4 h-4" />
    <span>View Blood Requests</span>
    <ArrowRight className="w-4 h-4" />
  </Link>

  <button
    onClick={handleLogout}
    className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-slate-700 hover:text-[#DC2626] text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer"
  >
    <LogOut className="w-4 h-4" />
    <span>Log Out</span>
  </button>
</div>
</div>

        {/* Success Alert for Toggle */}
        {toggleSuccess && (
          <div className="mb-8 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-emerald-800 flex items-center gap-2.5 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{toggleSuccess}</span>
          </div>
        )}

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (8 cols): Availability & Emergency Readiness */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Availability Control Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Emergency Dispatch Status
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A]">
                    Donation Availability
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Control whether our matching algorithms flag your profile as ready for immediate contact.
                  </p>
                </div>

                {/* Status Indicator Pill */}
                <div className="shrink-0">
                  {isAvailable ? (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold text-xs sm:text-sm shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Active & Available
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-bold text-xs sm:text-sm shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      Resting / Inactive
                    </span>
                  )}
                </div>
              </div>

              {/* Toggle Switch Component */}
              <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-[#0F172A]">
                    {isAvailable ? 'You are currently accepting emergency alerts' : 'You are currently resting (Not available)'}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md">
                    {isAvailable
                      ? 'Local hospitals and verified requests in your area will be able to see you in available donor lists.'
                      : 'Initial availability defaults to false. When you are ready to donate, toggle this switch on.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleToggle}
                  disabled={togglingAvailability}
                  className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:ring-offset-2 disabled:opacity-50 ${
                    isAvailable ? 'bg-emerald-600' : 'bg-slate-300'
                  }`}
                  role="switch"
                  aria-checked={isAvailable}
                >
                  <span className="sr-only">Toggle donation availability</span>
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      isAvailable ? 'translate-x-8' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Notice note */}
              <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs text-slate-600">
                <Activity className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
                <div>
                  <strong>Health Interval Reminder:</strong> Medical guidelines recommend waiting at least 56 days between whole blood donations. If you recently donated, please keep your status set to resting.
                </div>
              </div>

            </div>

            {/* Quick Actions & Urgent SOS Board */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    Urgent Requests in {city}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Live demonstration broadcast board matching your blood type
                  </p>
                </div>
                <Link
                  to="/emergency"
                  className="text-xs font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1"
                >
                  <span>View All SOS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-r from-[#FEF2F2] to-white border border-red-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {bloodGroup}
                  </div>
                  <div className="text-xs">
                    <span className="font-bold text-[#0F172A] block">
                      Emergency Alert Ready
                    </span>
                    <span className="text-slate-500">
                      Your blood type can be safely transfused to {groupInfo?.canDonateTo?.join(', ')}.
                    </span>
                  </div>
                </div>

                <Button
                  to="/emergency"
                  variant="primary"
                  size="sm"
                  className="shrink-0"
                >
                  Check Urgent Needs
                </Button>
              </div>
            </div>

          </div>

          {/* Right Column (4 cols): Compatibility Card & Donor Summary */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Blood Type Compatibility Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Compatibility Profile
                </span>
                <span className="text-xs font-bold text-[#DC2626]">
                  Type {bloodGroup}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold uppercase tracking-wide">
                    You can donate red cells to:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {groupInfo?.canDonateTo?.map((bg) => (
                      <span
                        key={bg}
                        className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wide">
                    You can safely receive from:
                  </span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {groupInfo?.canReceiveFrom?.map((bg) => (
                      <span
                        key={bg}
                        className="px-2 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold"
                      >
                        {bg}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <span className="text-slate-400 block font-semibold uppercase tracking-wide">
                    Clinical Classification:
                  </span>
                  <p className="text-slate-700 font-medium mt-1">
                    {groupInfo?.type} — {groupInfo?.rarity}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/compatibility"
                  className="w-full py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <span>Interactive Compatibility Guide</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Donor Badge / Recognition */}
            <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>

              <h4 className="font-bold text-base text-[#0F172A]">
                Voluntary Hero Status
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Thank you for being part of the voluntary response grid. Every whole blood donation saves up to three lives.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
