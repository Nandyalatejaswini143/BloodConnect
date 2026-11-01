import React from 'react';
import Modal from '../common/Modal';
import { Phone, Building2, CheckCircle2 } from 'lucide-react';

export default function DonorContactModal({ isOpen, onClose, request }) {
  if (!request) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Respond to Emergency Request"
      subtitle={`Demonstration Response for Case ${request.id}`}
      maxWidth="max-w-lg"
    >
      <div className="space-y-5">
        
        {/* Urgency Header */}
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/25">
              {request.bloodGroup}
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#DC2626] bg-white px-2 py-0.5 rounded-full border border-red-200">
                {request.urgency} Urgency
              </span>
              <h4 className="font-bold text-base text-[#0F172A] mt-1">
                {request.unitsRequired} Unit(s) Needed
              </h4>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            {request.timePosted}
          </span>
        </div>

        {/* Clinical Details */}
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Building2 className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">{request.hospital}</span>
              <span className="text-slate-500 text-xs">{request.city} • {request.distance}</span>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
            <Phone className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-900 block">Duty Coordinator: {request.contactPerson}</span>
              <span className="text-slate-500 text-xs">Simulated Emergency Extension: +1 (800) 555-0199</span>
            </div>
          </div>
        </div>

        {/* Quick Preparation Tips */}
        <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-900 space-y-2">
          <div className="font-bold flex items-center gap-1.5 text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Before Proceeding to Blood Bank</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700">
            <li>Drink 500ml of water before departing</li>
            <li>Carry a valid photo government ID</li>
            <li>Ensure you have had a light meal within the last 3 hours</li>
          </ul>
        </div>

        {/* Demo Disclaimer */}
        <div className="text-[11px] text-slate-400 text-center italic">
          * This is a prototype simulation. No live hospital dispatch is initiated.
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-sm transition-colors cursor-pointer"
          >
            I Acknowledge (Demo Confirm)
          </button>
        </div>

      </div>
    </Modal>
  );
}
