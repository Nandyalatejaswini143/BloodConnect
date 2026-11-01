
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import {
  Droplet,
  Clock,
  MapPin,
  PlusCircle,
  Info,
  AlertCircle
} from 'lucide-react';

import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { BLOOD_GROUPS } from '../data/bloodCompatibility';

export default function EmergencyRequestsPage() {
  const { currentUser, donorProfile } = useAuth();

  const [requests, setRequests] = useState([]);
  const [responseStatuses, setResponseStatuses] = useState({});
  const [selectedGroup, setSelectedGroup] = useState('ALL');
  const [selectedUrgency, setSelectedUrgency] = useState('ALL');

  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch matching real blood requests and previous donor responses.
  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError('');

        if (!currentUser) {
          setRequests([]);
          setResponseStatuses({});
          setError('Please log in to view emergency blood requests.');
          return;
        }

        // This page requires an active donor profile.
        if (!donorProfile) {
          setRequests([]);
          setResponseStatuses({});
          setError('Please log in with your donor account.');
          return;
        }

        if (!donorProfile.availability) {
          setRequests([]);
          setResponseStatuses({});
          setError('Turn on your donor availability to view matching requests.');
          return;
        }

        const cityKey =
          donorProfile.cityKey ||
          donorProfile.city?.trim().toLowerCase().replace(/\s+/g, '');

        const bloodGroup = donorProfile.bloodGroup;

        if (!cityKey || !bloodGroup) {
          setRequests([]);
          setResponseStatuses({});
          setError('Your donor city or blood group is missing from your profile.');
          return;
        }

        // IMPORTANT:
        // These filters must match the Firestore security rules.
        const requestsQuery = query(
          collection(db, 'publicBloodRequests'),
          where('status', '==', 'Pending'),
          where('cityKey', '==', cityKey),
          where(
            'compatibleDonorGroups',
            'array-contains',
            bloodGroup
          )
        );

        const requestSnapshot = await getDocs(requestsQuery);

        if (!isMounted) return;

        const realRequests = requestSnapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }));

        // Display newest requests first.
        realRequests.sort((a, b) => {
          const timeA = a.createdAt?.toMillis?.() || 0;
          const timeB = b.createdAt?.toMillis?.() || 0;
          return timeB - timeA;
        });

        setRequests(realRequests);

        // Fetch this donor's previous responses.
        const responsesQuery = query(
          collection(db, 'donorResponses'),
          where('donorId', '==', currentUser.uid)
        );

        const responseSnapshot = await getDocs(responsesQuery);

        if (!isMounted) return;

        const statuses = {};

        responseSnapshot.docs.forEach((document) => {
          const response = document.data();
          statuses[response.requestId] = response.status;
        });

        setResponseStatuses(statuses);

      } catch (err) {
        console.error('Error fetching emergency requests:', err);

        if (isMounted) {
          setError(
            err.message || 'Unable to load emergency blood requests.'
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [
    currentUser?.uid,
    donorProfile?.fullName,
    donorProfile?.availability,
    donorProfile?.city,
    donorProfile?.cityKey,
    donorProfile?.bloodGroup
  ]);

  // Submit donor interest.
  const handleInterest = async (request) => {
    if (!currentUser || !donorProfile) {
      setError('Please log in with your donor account to respond.');
      return;
    }

    if (!donorProfile.availability) {
      setError('Please turn on your donor availability first.');
      return;
    }

    if (responseStatuses[request.id]) return;

    try {
      setSubmittingId(request.id);
      setError('');
      setSuccess('');

      const responseId = `${request.id}_${currentUser.uid}`;

      await setDoc(
        doc(db, 'donorResponses', responseId),
        {
          requestId: request.id,
          donorId: currentUser.uid,
          donorName: donorProfile.fullName || 'Voluntary Donor',
          donorBloodGroup: donorProfile.bloodGroup,
          city: donorProfile.city,
          createdAt: serverTimestamp(),
          status: 'Interested'
        }
      );

      setResponseStatuses((previous) => ({
        ...previous,
        [request.id]: 'Interested'
      }));

      setSuccess('Your interest has been submitted successfully!');

    } catch (err) {
      console.error('Error submitting donor interest:', err);

      setError(
        err.message || 'Unable to submit your response.'
      );
    } finally {
      setSubmittingId('');
    }
  };

  // Apply blood group and urgency filters.
  const filtered = requests.filter((request) => {
    const matchGroup =
      selectedGroup === 'ALL' ||
      request.bloodGroup === selectedGroup;

    const matchUrgency =
      selectedUrgency === 'ALL' ||
      (request.urgency || '').toLowerCase() ===
        selectedUrgency.toLowerCase();

    return matchGroup && matchUrgency;
  });

  const getUrgencyStyle = (urgency) => {
    switch ((urgency || '').toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-700';

      case 'urgent':
        return 'bg-orange-100 text-orange-700';

      case 'high priority':
        return 'bg-yellow-100 text-yellow-800';

      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not specified';

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }
    );
  };

  const formatPostedTime = (timestamp) => {
    if (!timestamp?.toDate) return 'Recently posted';

    return timestamp.toDate().toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-200 text-[#DC2626] text-xs font-bold uppercase tracking-wider mb-2">
              <span className="w-2 h-2 rounded-full bg-[#DC2626] animate-pulse" />
              <span>Live Blood Requests</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
              Emergency Blood Requests Board
            </h1>

            <p className="mt-2 text-slate-600 text-sm sm:text-base max-w-2xl">
              View real blood requests posted by patients and respond
              if you are available to donate.
            </p>
          </div>

          <Link
            to="/create-blood-request"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold shadow-md hover:shadow-lg transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post Emergency Request</span>
          </Link>
        </div>

        {/* Information */}
        <div className="mb-8 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <div>
            <strong>Real Requests:</strong> These requests are fetched
            directly from Firebase. Patient contact information remains
            private and is shared through the existing acceptance process.
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 break-words">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-200 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 flex flex-wrap items-center justify-between gap-4">

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-2">
              Blood Group:
            </span>

            <button
              onClick={() => setSelectedGroup('ALL')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedGroup === 'ALL'
                  ? 'bg-[#DC2626] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All
            </button>

            {BLOOD_GROUPS.map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedGroup === group
                    ? 'bg-[#DC2626] text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {group}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Urgency:
            </span>

            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 focus:outline-none"
            >
              <option value="ALL">All Urgencies</option>
              <option value="Critical">Critical</option>
              <option value="Urgent">Urgent</option>
              <option value="High Priority">High Priority</option>
              <option value="Normal">Normal</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="bg-white rounded-2xl p-10 text-center text-slate-600">
            Loading real emergency requests...
          </div>
        )}

        {/* Requests */}
        {!loading && (
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 text-sm">
                <Droplet className="w-10 h-10 mx-auto mb-3 text-slate-300" />

                <h2 className="text-lg font-bold text-slate-700">
                  No emergency requests found
                </h2>

                <p className="mt-2">
                  No real requests match your current filters.
                  New patient requests will appear here.
                </p>
              </div>
            ) : (
              filtered.map((request) => {
                const responseStatus = responseStatuses[request.id];

                const alreadyResponded = Boolean(responseStatus);

                const isAccepted = responseStatus === 'Accepted';
                const isRejected = responseStatus === 'Rejected';

                return (
                  <div
                    key={request.id}
                    className="bg-white rounded-2xl border-2 border-red-100 hover:border-red-300 p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#DC2626] to-[#B91C1C] text-white flex flex-col items-center justify-center font-black shrink-0 shadow-md shadow-red-500/20">
                        <span className="text-2xl leading-none">
                          {request.bloodGroup}
                        </span>

                        <span className="text-[9px] uppercase tracking-wider opacity-90">
                          Needed
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getUrgencyStyle(request.urgency)}`}
                          >
                            {request.urgency || 'Normal'}
                          </span>

                          <span className="text-xs text-slate-400 font-mono">
                            {request.id}
                          </span>

                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {formatPostedTime(request.createdAt)}
                          </span>
                        </div>

                        <h3 className="text-lg font-bold text-[#0F172A]">
                          {request.units} Units Required — {request.hospitalName}
                        </h3>

                        <div className="text-xs text-slate-500 flex flex-wrap items-center gap-3 pt-1">
                          <span className="flex items-center gap-1 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                            {request.city}
                          </span>
                        </div>

                        <p className="text-xs text-slate-600">
                          <strong>Required Date:</strong>{' '}
                          {formatDate(request.requiredDate)}
                        </p>

                        {/* Donor response status */}
                        {isAccepted && (
                          <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                            <p className="font-bold text-green-800 text-sm">
                              ✓ Accepted by Patient
                            </p>
                            <p className="mt-1 text-xs text-green-700">
                              The patient has accepted your response.
                            </p>
                          </div>
                        )}

                        {isRejected && (
                          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                            <p className="font-bold text-red-700 text-sm">
                              Response Rejected
                            </p>
                          </div>
                        )}

                        {responseStatus === 'Interested' && (
                          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
                            <p className="font-semibold text-blue-800 text-sm">
                              ✓ Interest Submitted
                            </p>
                            <p className="mt-1 text-xs text-blue-700">
                              Waiting for the patient to review your response.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center shrink-0 self-end md:self-center">
                      <button
                        type="button"
                        onClick={() => handleInterest(request)}
                        disabled={
                          !donorProfile ||
                          !donorProfile.availability ||
                          alreadyResponded ||
                          submittingId === request.id
                        }
                        className={`px-5 py-2.5 rounded-xl text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 ${
                          isAccepted
                            ? 'bg-green-600 cursor-not-allowed'
                            : isRejected
                              ? 'bg-gray-500 cursor-not-allowed'
                              : alreadyResponded
                                ? 'bg-blue-600 cursor-not-allowed'
                                : 'bg-[#DC2626] hover:bg-[#B91C1C] disabled:opacity-50 disabled:cursor-not-allowed'
                        }`}
                      >
                        <Droplet className="w-4 h-4 fill-white" />

                        {submittingId === request.id
                          ? 'Submitting...'
                          : isAccepted
                            ? 'Accepted by Patient'
                            : isRejected
                              ? 'Response Rejected'
                              : alreadyResponded
                                ? 'Interest Submitted'
                                : !donorProfile
                                  ? 'Donor Login Required'
                                  : !donorProfile.availability
                                    ? 'Unavailable'
                                    : "I'm Interested"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
