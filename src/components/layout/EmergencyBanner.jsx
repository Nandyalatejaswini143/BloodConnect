import React, { useState } from 'react';
import { X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmergencyBanner() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#B91C1C] text-white text-xs sm:text-sm py-2 px-4 transition-all relative z-40 border-b border-red-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="flex h-2 w-2 relative shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-semibold bg-red-800/80 px-2 py-0.5 rounded text-[11px] uppercase tracking-wider shrink-0">
            Phase 1 Demo
          </span>
          <span className="font-medium text-red-50 truncate">
            Simulated Demonstration Environment: Donor records and urgent requests are for testing only.
          </span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to="/emergency"
            className="hidden md:inline-flex items-center gap-1 text-xs font-semibold underline underline-offset-2 hover:text-white transition-colors"
          >
            <span>View Urgent Requests</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-red-800/60 rounded text-red-200 hover:text-white transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
