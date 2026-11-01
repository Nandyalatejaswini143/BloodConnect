
import React, { useEffect, useState } from 'react';

import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore';

import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

const DonorRequestsPage = () => {
  const { currentUser, donorProfile } = useAuth();

  const [requests, setRequests] = useState([]);
  const [responseStatuses, setResponseStatuses] = useState({});
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      if (!currentUser || !donorProfile) {
        if (isMounted) setLoading(false);
        return;
      }

      if (!donorProfile.availability) {
        if (isMounted) {
          setRequests([]);
          setLoading(false);
        }
        return;
      }

      const cityKey =
        donorProfile.cityKey ||
        (donorProfile.city || '')
          .split(',')[0]
          .trim()
          .toLowerCase();

      if (!cityKey || !donorProfile.bloodGroup) {
        if (isMounted) {
          setError('Your donor city or blood group is missing.');
          setLoading(false);
        }
        return;
      }

      try {
        if (isMounted) {
          setLoading(true);
          setError('');
        }

        const requestsQuery = query(
          collection(db, 'publicBloodRequests'),
          where(
            'compatibleDonorGroups',
            'array-contains',
            donorProfile.bloodGroup
          ),
          where('cityKey', '==', cityKey),
          where('status', '==', 'Pending')
        );

        const responsesQuery = query(
          collection(db, 'donorResponses'),
          where('donorId', '==', currentUser.uid)
        );

        const [requestSnapshot, responseSnapshot] =
          await Promise.all([
            getDocs(requestsQuery),
            getDocs(responsesQuery)
          ]);

        if (!isMounted) return;

        const matchingRequests = requestSnapshot.docs.map(
          (document) => ({
            id: document.id,
            ...document.data()
          })
        );

        const statuses = {};

        responseSnapshot.docs.forEach((document) => {
          const response = document.data();
          statuses[response.requestId] = response.status;
        });

        setRequests(matchingRequests);
        setResponseStatuses(statuses);

      } catch (err) {
        console.error('Error fetching requests:', err);

        if (isMounted) {
          setError(err.message || 'Unable to load blood requests.');
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
    donorProfile?.availability,
    donorProfile?.cityKey,
    donorProfile?.city,
    donorProfile?.bloodGroup
  ]);

  const handleInterest = async (request) => {
    if (!currentUser || !donorProfile) return;

    if (responseStatuses[request.id]) return;

    if (!request.patientId) {
      setError(
        'This request does not contain patient ownership information. Please refresh and try again.'
      );
      return;
    }

    try {
      setSubmittingId(request.id);
      setError('');
      setSuccess('');

      const responseId = `${request.id}_${currentUser.uid}`;

      await setDoc(
        doc(db, 'donorResponses', responseId),
        {
          requestId: request.id,
          patientId: request.patientId,
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
      console.error('Error submitting interest:', err);

      setError(
        err.message || 'Unable to submit your response.'
      );
    } finally {
      setSubmittingId('');
    }
  };

  const acceptedCount = Object.values(responseStatuses).filter(
    (status) => status === 'Accepted'
  ).length;

  if (loading) {
    return (
      <div className="p-8 text-center">
        Loading blood requests...
      </div>
    );
  }

  if (!donorProfile?.availability) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 text-center">
        <h2 className="text-xl font-bold">
          You are unavailable
        </h2>

        <p className="mt-2 text-gray-600">
          Turn on your donor availability to view matching requests.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold text-gray-900">
          Blood Requests
        </h1>

        <p className="mt-2 text-gray-600">
          Matching blood requests from your city.
        </p>

        <div className="mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-800">
          <p>
            <strong>Your blood group:</strong>{' '}
            {donorProfile.bloodGroup}
          </p>

          <p>
            <strong>Your city:</strong> {donorProfile.city}
          </p>
        </div>

        {/* ACCEPTANCE NOTIFICATION */}
        {acceptedCount > 0 && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5">
            <h2 className="font-bold text-green-800 text-lg">
              🎉 Good news! Your response was accepted.
            </h2>

            <p className="mt-2 text-sm text-green-700">
              A patient has accepted your interest in{' '}
              {acceptedCount === 1
                ? 'one blood request.'
                : `${acceptedCount} blood requests.`}
              {' '}Please check the accepted request details below.
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700 break-words">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-green-700">
            {success}
          </div>
        )}

        {!error && requests.length === 0 && (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm">
            <h2 className="text-xl font-semibold">
              No matching requests right now
            </h2>

            <p className="mt-2 text-gray-600">
              New requests will appear here when patients need
              compatible blood in your city.
            </p>
          </div>
        )}

        <div className="mt-8 space-y-5">
          {requests.map((request) => {
            const responseStatus = responseStatuses[request.id];

            const alreadyResponded = Boolean(responseStatus);

            const isAccepted = responseStatus === 'Accepted';
            const isRejected = responseStatus === 'Rejected';

            return (
              <div
                key={request.id}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-red-600">
                    {request.bloodGroup} Blood Required
                  </h2>

                  <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-800">
                    {request.status}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <p>
                    <strong>Units:</strong> {request.units}
                  </p>

                  <p>
                    <strong>Hospital:</strong> {request.hospitalName}
                  </p>

                  <p>
                    <strong>City:</strong> {request.city}
                  </p>

                  <p>
                    <strong>Required Date:</strong> {request.requiredDate}
                  </p>

                  <p>
                    <strong>Urgency:</strong> {request.urgency}
                  </p>
                </div>

                {/* DONOR RESPONSE STATUS */}
                {isAccepted && (
                  <div className="mt-5 rounded-lg border border-green-200 bg-green-50 p-4">
                    <p className="font-bold text-green-800">
                      ✓ Accepted by Patient
                    </p>

                    <p className="mt-1 text-sm text-green-700">
                      The patient has accepted your response.
                      Please follow up with the patient to coordinate donation.
                    </p>
                  </div>
                )}

                {isRejected && (
                  <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4">
                    <p className="font-bold text-red-700">
                      Response Rejected
                    </p>

                    <p className="mt-1 text-sm text-red-600">
                      The patient has rejected your response.
                    </p>
                  </div>
                )}

                {responseStatus === 'Interested' && (
                  <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <p className="font-semibold text-blue-800">
                      ✓ Interest Submitted
                    </p>

                    <p className="mt-1 text-sm text-blue-700">
                      Waiting for the patient to review your response.
                    </p>
                  </div>
                )}

                <div className="mt-6 border-t pt-5">
                  <button
                    type="button"
                    onClick={() => handleInterest(request)}
                    disabled={
                      alreadyResponded ||
                      submittingId === request.id
                    }
                    className={`w-full rounded-xl px-5 py-3 font-semibold text-white transition sm:w-auto ${
                      isAccepted
                        ? 'bg-green-600 cursor-not-allowed'
                        : isRejected
                          ? 'bg-gray-500 cursor-not-allowed'
                          : alreadyResponded
                            ? 'bg-blue-600 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 disabled:opacity-50'
                    }`}
                  >
                    {submittingId === request.id
                      ? 'Submitting...'
                      : isAccepted
                        ? '✓ Accepted by Patient'
                        : isRejected
                          ? 'Response Rejected'
                          : alreadyResponded
                            ? '✓ Interest Submitted'
                            : "I'm Interested"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default DonorRequestsPage;
