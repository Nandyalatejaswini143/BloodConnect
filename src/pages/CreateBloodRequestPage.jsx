
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import {
  Droplet,
  ArrowLeft,
  MapPin,
  Hospital,
  Calendar,
  ClipboardList
} from 'lucide-react';

import {
  collection,
  doc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';

import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const COMPATIBLE_DONOR_GROUPS = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

export default function CreateBloodRequestPage() {
  const navigate = useNavigate();

  const { currentUser, patientProfile } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    patientName: '',
    bloodGroup: '',
    units: '1',
    hospitalName: '',
    city: '',
    requiredDate: '',
    urgency: 'Normal',
    contactNumber: '',
    notes: ''
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!currentUser) {
      setError('Please log in to submit a blood request.');
      return;
    }

    if (!/^\d{10}$/.test(formData.contactNumber)) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!COMPATIBLE_DONOR_GROUPS[formData.bloodGroup]) {
      setError('Please select a valid blood group.');
      return;
    }

    if (
      new Date(formData.requiredDate + 'T23:59:59') <
      new Date()
    ) {
      setError('Please select today or a future date.');
      return;
    }

    const cityKey = formData.city
      .split(',')[0]
      .trim()
      .toLowerCase();

    if (!cityKey) {
      setError('Please enter a valid city.');
      return;
    }

    try {
      setSubmitting(true);

      const batch = writeBatch(db);

      // Private request: accessible to the patient who created it.
      const privateRequestRef = doc(
        collection(db, 'emergencyRequests')
      );

      batch.set(privateRequestRef, {
        patientName: formData.patientName.trim(),
        bloodGroup: formData.bloodGroup,
        units: Number(formData.units),
        hospitalName: formData.hospitalName.trim(),
        city: formData.city.trim(),
        requiredDate: formData.requiredDate,
        urgency: formData.urgency,
        contactNumber: formData.contactNumber.trim(),
        notes: formData.notes.trim(),
        createdBy: currentUser.uid,
        patientEmail: currentUser.email,
        patientAccountName: patientProfile?.fullName || '',
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      // Public request: contains the patient UID for
      // ownership validation, but no contact details.
      const publicRequestRef = doc(
        db,
        'publicBloodRequests',
        privateRequestRef.id
      );

      batch.set(publicRequestRef, {
        patientId: currentUser.uid,
        bloodGroup: formData.bloodGroup,
        compatibleDonorGroups:
          COMPATIBLE_DONOR_GROUPS[formData.bloodGroup],
        units: Number(formData.units),
        hospitalName: formData.hospitalName.trim(),
        city: formData.city.trim(),
        cityKey,
        requiredDate: formData.requiredDate,
        urgency: formData.urgency,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      // Both documents are written together.
      await batch.commit();

      alert('Your blood request has been submitted successfully!');

      navigate('/patient-dashboard');

    } catch (submitError) {
      console.error(
        'Blood request submission failed:',
        submitError
      );

      setError(
        'Unable to submit your request. Please try again.'
      );

    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <Link
          to="/patient-dashboard"
          className="inline-flex items-center gap-2 text-slate-600 hover:text-red-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">

          <div className="bg-gradient-to-r from-red-600 to-red-500 p-7 text-white">
            <div className="flex items-center gap-3 mb-3">
              <Droplet size={27} />
              <span className="font-bold">BloodConnect</span>
            </div>

            <h1 className="text-3xl font-extrabold">
              Create Blood Request
            </h1>

            <p className="text-red-100 mt-2">
              Provide the required details to request blood from donors.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 space-y-6"
          >

            <div>
              <h2 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <ClipboardList className="text-red-600" />
                Request Details
              </h2>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Patient Full Name *
              </label>

              <input
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Enter patient name"
                className="w-full border border-slate-300 rounded-xl p-3 outline-none focus:ring-2 focus:ring-red-200"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Required Blood Group *
                </label>

                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3 bg-white"
                >
                  <option value="">Select blood group</option>

                  {[
                    'A+', 'A-', 'B+', 'B-',
                    'AB+', 'AB-', 'O+', 'O-'
                  ].map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Units Required *
                </label>

                <input
                  type="number"
                  name="units"
                  value={formData.units}
                  onChange={handleChange}
                  min="1"
                  max="20"
                  required
                  className="w-full border border-slate-300 rounded-xl p-3"
                />
              </div>

            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <Hospital className="inline w-4 h-4 mr-1" />
                Hospital Name *
              </label>

              <input
                name="hospitalName"
                value={formData.hospitalName}
                onChange={handleChange}
                required
                maxLength={150}
                placeholder="Enter hospital name"
                className="w-full border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                City / Location *
              </label>

              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                maxLength={100}
                placeholder="Enter hospital city"
                className="w-full border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">

              <div>
                <label className="block text-sm font-semibold mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  Required Date *
                </label>

                <input
                  type="date"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  min={new Date().toLocaleDateString('en-CA')}
                  required
                  className="w-full border border-slate-300 rounded-xl p-3"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Urgency *
                </label>

                <select
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  className="w-full border border-slate-300 rounded-xl p-3 bg-white"
                >
                  <option>Normal</option>
                  <option>Urgent</option>
                  <option>Emergency</option>
                </select>
              </div>

            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Contact Mobile Number *
              </label>

              <input
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                required
                maxLength={10}
                inputMode="numeric"
                placeholder="10-digit mobile number"
                className="w-full border border-slate-300 rounded-xl p-3"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Additional Information
              </label>

              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                maxLength={500}
                rows={3}
                placeholder="Any additional details (optional)"
                className="w-full border border-slate-300 rounded-xl p-3"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-xl">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-300 text-white rounded-xl p-4 font-bold transition"
            >
              {submitting
                ? 'Submitting...'
                : 'Submit Blood Request'}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Please verify all information before submitting.
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
