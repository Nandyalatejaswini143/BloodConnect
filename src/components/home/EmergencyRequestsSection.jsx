import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplet,
  Building2,
  Clock,
  MapPin,
  PlusCircle,
  ArrowRight
} from 'lucide-react';
import { MOCK_EMERGENCY_REQUESTS } from '../../data/mockEmergencyRequests';
import EmergencyRequestModal from '../modals/EmergencyRequestModal';
import DonorContactModal from '../modals/DonorContactModal';

export default function EmergencyRequestsSection() {
  const [requests, setRequests] = useState(MOCK_EMERGENCY_REQUESTS);
  const [filterUrgency, setFilterUrgency] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedResponseReq, setSelectedResponseReq] = useState(null);

  const filteredRequests = filterUrgency === 'ALL'
    ? requests
    : requests.filter((r) => r.urgency.toLowerCase() === filterUrgency.toLowerCase());

  const handleNewRequest = (newReq) => {
    setRequests([newReq, ...requests]);
  };

  return (
    <section id="emergency" className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-3">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-ping" />
              <span>Simulated Emergency Broadcast Feed (Demo)</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Urgent Blood Requirements
            </h2>
            
            <p className="mt-2 text-slate-600 text-base max-w-2xl">
              Hospitals post real-time urgent transfusion needs. If you are a compatible voluntary donor nearby, every unit donated helps save a life.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Urgent Request</span>
            </button>
            
            <Link
              to="/emergency"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 hover:border-red-200 hover:bg-red-50 text-[#0F172A] hover:text-[#DC2626] text-sm font-bold transition-all cursor-pointer"
            >
              <span>Full Board</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
            Filter:
          </span>
          {['ALL', 'Critical', 'Urgent'].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterUrgency(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                filterUrgency === tab
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab === 'ALL' ? 'All Alerts' : tab}
            </button>
          ))}
        </div>

        {/* Emergency Request Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRequests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl border-2 border-red-100 hover:border-red-300 shadow-sm hover:shadow-lg transition-all duration-300 p-6 flex flex-col justify-between group relative overflow-hidden"
            >
              {/* Top Accent Strip */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#DC2626] via-red-500 to-[#B91C1C]" />

              <div>
                {/* Header: Blood group + Urgency tag + Time */}
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white flex flex-col items-center justify-center font-black shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform">
                      <span className="text-xl leading-none">{req.bloodGroup}</span>
                      <span className="text-[9px] uppercase tracking-wider opacity-90">Needed</span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${req.urgencyColor}`}>
                          {req.urgency}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                          {req.id} (Demo)
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-[#0F172A] mt-1">
                        {req.unitsRequired} Unit(s) Blood Required
                      </h4>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {req.timePosted}
                    </span>
                  </div>
                </div>

                {/* Purpose / Patient info */}
                <div className="mb-4">
                  <p className="text-xs font-semibold text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <strong>Medical Case:</strong> {req.purpose}
                  </p>
                </div>

                {/* Hospital location & distance */}
                <div className="space-y-1.5 text-xs text-slate-600 mb-6">
                  <div className="flex items-center gap-2 font-medium">
                    <Building2 className="w-4 h-4 text-[#DC2626] shrink-0" />
                    <span className="text-[#0F172A] font-bold">{req.hospital}</span>
                  </div>
                  <div className="flex items-center gap-2 pl-6 text-slate-500">
                    <MapPin className="w-3.5 h-3.5 shrink-0" />
                    <span>{req.city} • <strong className="text-emerald-700">{req.distance}</strong></span>
                  </div>
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <span className="text-xs text-slate-400 font-medium">
                  Contact: {req.contactPerson}
                </span>

                <button
                  onClick={() => setSelectedResponseReq(req)}
                  className="px-4 py-2 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs font-bold transition-all shadow-sm hover:shadow flex items-center gap-1.5 cursor-pointer"
                >
                  <Droplet className="w-3.5 h-3.5 fill-white" />
                  <span>Respond Now</span>
                </button>
              </div>

            </div>
          ))}
        </div>

        {/* Bottom Call to Action strip */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#DC2626] to-[#B91C1C] text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-950/10">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black tracking-tight">
              Can't find a compatible donor right now?
            </h3>
            <p className="text-red-100 text-sm max-w-xl">
              Post your urgent blood request to the BloodConnect network. Registered voluntary donors in your locality receive instant simulated dispatch alerts.
            </p>
          </div>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-white text-[#DC2626] hover:bg-red-50 font-bold text-sm shadow-md transition-all shrink-0 cursor-pointer"
          >
            Create Emergency Request
          </button>
        </div>

      </div>

      {/* Modals */}
      <EmergencyRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleNewRequest}
      />

      <DonorContactModal
        isOpen={Boolean(selectedResponseReq)}
        onClose={() => setSelectedResponseReq(null)}
        request={selectedResponseReq}
      />
    </section>
  );
}
