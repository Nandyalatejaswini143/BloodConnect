import React from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Phone,
  Mail,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { BLOOD_GROUPS } from '../../data/bloodCompatibility';

const CURRENT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] text-white shadow-md">
                <Droplet className="w-5 h-5 fill-white" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight">
                Blood<span className="text-[#DC2626]">Connect</span>
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A modern, community-driven blood donation coordination initiative. We connect voluntary blood donors with hospitals and patients in critical emergency need within minutes.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/80 text-xs text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>Platform Status: Prototype Demonstration Active</span>
              </div>
            </div>

            <div className="pt-3 space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#DC2626]" />
                <span>Simulated Hotline: <strong className="text-white">1-800-BLOOD-CONNECT</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#DC2626]" />
                <span>Demo Inquiries: <span className="text-slate-300">support@bloodconnect.demo</span></span>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/find-donors" className="text-slate-400 hover:text-white transition-colors">
                  Find Blood Donors
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-slate-400 hover:text-white transition-colors">
                  Register as Donor
                </Link>
              </li>
              <li>
                <Link to="/compatibility" className="text-slate-400 hover:text-white transition-colors">
                  Compatibility Matrix
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-slate-400 hover:text-white transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link to="/emergency" className="text-rose-400 hover:text-rose-300 font-medium transition-colors flex items-center gap-1.5">
                  <span>Emergency Requests</span>
                  <span className="text-[10px] bg-red-950 text-red-400 px-1.5 py-0.2 rounded border border-red-800">SOS</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Blood Group Explorer Links */}
          <div>
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
              Blood Types
            </h4>
            <p className="text-xs text-slate-400 mb-3">
              Explore compatibility charts and verified donors by group:
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {BLOOD_GROUPS.map((group) => (
                <Link
                  key={group}
                  to={`/compatibility?group=${encodeURIComponent(group)}`}
                  className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-[#B91C1C] text-slate-300 hover:text-white text-xs font-bold text-center border border-slate-700 hover:border-red-600 transition-all"
                >
                  {group}
                </Link>
              ))}
            </div>
            <div className="mt-4">
              <Link
                to="/compatibility"
                className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 font-medium group"
              >
                <span>Full compatibility guide</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Col 5: Safety & Emergency Notice */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-3">
              Medical Disclaimer
            </h4>
            <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
              <div className="flex items-start gap-2 text-amber-400 mb-1.5 font-medium">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <span>Notice for Emergencies</span>
              </div>
              BloodConnect is a voluntary coordination prototype. If you are experiencing an acute, life-threatening crisis, immediately dial local emergency services (e.g. 911 or 112) or reach your nearest certified hospital.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {CURRENT_YEAR} BloodConnect Platform. Phase 1 Prototype. Demonstration content only.
          </p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Protocol</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">HIPAA Compliance Guidelines</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
