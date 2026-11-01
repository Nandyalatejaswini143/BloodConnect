import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Heart,
  Search,
  UserPlus,
  ShieldCheck,
  Clock,
  Droplet,
  ArrowRight,
  MapPin,
  CheckCircle2
} from 'lucide-react';
import Button from '../common/Button';
import { BLOOD_GROUPS } from '../../data/bloodCompatibility';

export default function HeroSection() {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState('O-');
  const [locationQuery, setLocationQuery] = useState('');

  const handleQuickSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedGroup) params.set('group', selectedGroup);
    if (locationQuery.trim()) params.set('location', locationQuery.trim());
    navigate(`/find-donors?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24 bg-gradient-to-b from-white via-[#FEF2F2]/30 to-[#F8FAFC]">
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-24 right-0 w-96 h-96 rounded-full bg-red-100/60 blur-3xl" />
        <div className="absolute top-1/2 -left-24 w-80 h-80 rounded-full bg-rose-50 blur-2xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headline, Subtitle, Actions, Quick Search */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 text-center lg:text-left">
            
            {/* Mission Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FEF2F2] border border-red-200 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-[#DC2626] animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-[#DC2626] tracking-wide flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#DC2626]" />
                Emergency Blood Donor Coordination Network
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12]">
              Donate Blood.{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#DC2626] via-[#B91C1C] to-red-600">
                Save Lives.
                <svg
                  className="absolute left-0 -bottom-2 w-full h-3 text-[#DC2626]/20"
                  viewBox="0 0 100 20"
                  preserveAspectRatio="none"
                >
                  <path d="M0,15 Q50,0 100,15" stroke="currentColor" strokeWidth="6" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 max-w-2xl font-normal leading-relaxed mx-auto lg:mx-0">
              BloodConnect connects voluntary blood donors with patients and hospitals in real-time. Whether you are ready to give the gift of life or facing an urgent medical requirement, our verified community response is just seconds away.
            </p>

            {/* Two Primary Buttons (Requested specifically) */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Button
                to="/find-donors"
                variant="primary"
                size="lg"
                icon={Search}
                className="w-full sm:w-auto shadow-lg shadow-red-500/20"
              >
                Find Blood Donors
              </Button>

              <Button
                to="/register"
                variant="outline"
                size="lg"
                icon={UserPlus}
                className="w-full sm:w-auto border-2 border-red-200 text-[#0F172A] hover:bg-[#FEF2F2] hover:text-[#DC2626]"
              >
                Register as Donor
              </Button>
            </div>

            {/* Quick Interactive Finder Form */}
            <div className="pt-4">
              <form
                onSubmit={handleQuickSearch}
                className="p-3 sm:p-4 rounded-2xl bg-white border border-slate-200/80 shadow-md shadow-slate-100/80 flex flex-col sm:flex-row gap-3 items-stretch"
              >
                {/* Blood Group Picker */}
                <div className="sm:w-1/3 text-left">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                    Blood Group Needed
                  </label>
                  <div className="relative">
                    <select
                      value={selectedGroup}
                      onChange={(e) => setSelectedGroup(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white cursor-pointer"
                    >
                      {BLOOD_GROUPS.map((bg) => (
                        <option key={bg} value={bg}>
                          {bg} Group
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Location Input */}
                <div className="sm:w-1/2 text-left">
                  <label className="block text-xs font-semibold text-slate-500 mb-1 ml-1">
                    City or Postal Code
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. San Francisco or 94102"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit Search */}
                <div className="sm:w-auto flex items-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto h-11 px-5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                    <Search className="w-4 h-4" />
                    <span>Search</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
                <span>100% Free & Voluntary</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Verified Medical Donors</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Real-Time Notifications</span>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Medical Visual Card */}
          <div className="lg:col-span-5 relative flex justify-center">
            
            {/* Main Interactive Card */}
            <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 border border-slate-100 shadow-xl shadow-red-950/5">
              
              {/* Header inside card */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] border border-red-200 flex items-center justify-center text-[#DC2626]">
                    <Droplet className="w-5 h-5 fill-[#DC2626]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-[#0F172A]">Simulated Donor Radar</h3>
                    <p className="text-xs text-slate-500">Live community availability</p>
                  </div>
                </div>
                <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Network
                </span>
              </div>

              {/* Blood group indicator preview */}
              <div className="my-5 p-4 rounded-2xl bg-gradient-to-br from-[#FEF2F2] to-white border border-red-100">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#DC2626]">
                      Universal Lifeline
                    </span>
                    <h4 className="text-2xl font-black text-[#0F172A] mt-0.5">
                      Type O- Negative
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Can be transfused to any blood type in trauma situations.
                    </p>
                  </div>
                  <div className="w-14 h-14 rounded-2xl bg-[#DC2626] text-white flex flex-col items-center justify-center font-black shadow-md shadow-red-500/30">
                    <span className="text-xl leading-none">O-</span>
                    <span className="text-[9px] uppercase tracking-wider opacity-90">Universal</span>
                  </div>
                </div>
              </div>

              {/* Simulated Donor Activity Feed */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Recent Verified Donors (Demo)
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#DC2626] font-bold text-xs flex items-center justify-center">
                      A+
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Marcus Chen</p>
                      <p className="text-[11px] text-slate-500">Downtown • 2.5 mi away</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-100 text-[#DC2626] font-bold text-xs flex items-center justify-center">
                      O-
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">Sarah Jenkins</p>
                      <p className="text-[11px] text-slate-500">Bay Area • 1.2 mi away</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                    Ready
                  </span>
                </div>
              </div>

              {/* Card Footer action */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Join our voluntary registry
                </span>
                <button
                  onClick={() => navigate('/register')}
                  className="font-bold text-[#DC2626] hover:text-[#B91C1C] flex items-center gap-1 group cursor-pointer"
                >
                  <span>Become a Donor</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

            </div>

            {/* Floating Floating Pill Bottom-Left */}
            <div className="absolute -bottom-4 -left-4 sm:-left-6 bg-white rounded-2xl p-3 border border-slate-100 shadow-lg hidden sm:flex items-center gap-3 max-w-[200px]">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-[11px] leading-tight">
                <span className="font-bold text-[#0F172A] block">100% Free</span>
                <span className="text-slate-500">Community service</span>
              </div>
            </div>

            {/* Floating Pill Top-Right */}
            <div className="absolute -top-3 -right-3 bg-white rounded-2xl p-3 border border-slate-100 shadow-lg hidden sm:flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#DC2626]"></span>
              </span>
              <div className="text-[11px] font-bold text-[#0F172A]">
                24/7 Dispatch Ready
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
