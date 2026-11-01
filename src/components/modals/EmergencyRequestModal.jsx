import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BLOOD_GROUPS } from '../../data/bloodCompatibility';

export default function EmergencyRequestModal({ isOpen, onClose, onCreated }) {
  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: 'O-',
    unitsRequired: 2,
    urgency: 'Critical',
    hospital: '',
    city: '',
    contactPerson: '',
    contactPhone: '',
    purpose: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      patientName: formData.patientName ? `Simulated: ${formData.patientName}` : 'Simulated Patient',
      bloodGroup: formData.bloodGroup,
      unitsRequired: Number(formData.unitsRequired),
      urgency: formData.urgency,
      urgencyColor: formData.urgency === 'Critical' ? 'bg-red-600 text-white' : 'bg-amber-600 text-white',
      hospital: formData.hospital || 'Memorial Medical Emergency Unit',
      city: formData.city || 'San Francisco, CA',
      distance: '1.5 miles away (Demo)',
      timePosted: 'Just now',
      purpose: formData.purpose || 'Emergency transfusion requirement',
      contactPerson: formData.contactPerson || 'Emergency Intake Lead',
      verified: true,
      isDemo: true
    };

    if (onCreated) {
      onCreated(newRequest);
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
      // Reset form
      setFormData({
        patientName: '',
        bloodGroup: 'O-',
        unitsRequired: 2,
        urgency: 'Critical',
        hospital: '',
        city: '',
        contactPerson: '',
        contactPhone: '',
        purpose: ''
      });
    }, 1800);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Emergency Blood Request"
      subtitle="Phase 1 Prototype Demo: Broadcasts simulated alert to nearby compatible voluntary donors"
      maxWidth="max-w-xl"
    >
      {submitted ? (
        <div className="py-8 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h4 className="text-xl font-bold text-[#0F172A]">
            Emergency Alert Dispatched (Demo)
          </h4>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            Your simulated urgent request has been broadcasted to verified {formData.bloodGroup} voluntary donors in the test network.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-800">
            <AlertTriangle className="w-4 h-4 text-[#DC2626] shrink-0" />
            <span>
              <strong>Notice:</strong> Demonstration system. No actual emergency services will be contacted from this form.
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Blood Group Needed *
              </label>
              <select
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                required
              >
                {BLOOD_GROUPS.map((g) => (
                  <option key={g} value={g}>{g} Group</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Units Required *
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.unitsRequired}
                onChange={(e) => setFormData({ ...formData, unitsRequired: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hospital or Clinic Name *
              </label>
              <input
                type="text"
                placeholder="e.g. City General Trauma Ward"
                value={formData.hospital}
                onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                City / Locality *
              </label>
              <input
                type="text"
                placeholder="e.g. San Francisco, CA"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Urgency Level
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
              >
                <option value="Critical">Critical (Immediate - next 1 hour)</option>
                <option value="Urgent">Urgent (Within 4 hours)</option>
                <option value="High Priority">High Priority (Same day)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Contact Person / Desk *
              </label>
              <input
                type="text"
                placeholder="e.g. Dr. Vance / Blood Bank Room 102"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Clinical Reason / Notes
            </label>
            <textarea
              rows="2"
              placeholder="e.g. Emergency surgery trauma blood reserve needed"
              value={formData.purpose}
              onChange={(e) => setFormData({ ...formData, purpose: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm text-[#0F172A] focus:outline-none focus:ring-2 focus:ring-[#DC2626]"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <Button
              type="submit"
              variant="emergency"
              size="md"
              icon={AlertTriangle}
            >
              Broadcast Urgent Request
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
}
