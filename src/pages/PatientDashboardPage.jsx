
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import {
  HeartPulse,
  Search,
  MapPin,
  ClipboardList,
  Clock,
  ShieldCheck,
  Droplet,
  ArrowRight,
  LogOut,
  User,
  RefreshCw,
  Users,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  Mail
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';

import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  getDoc,
  writeBatch,
  serverTimestamp
} from 'firebase/firestore';

export default function PatientDashboardPage() {
  const {
    currentUser,
    patientProfile,
    logoutDonor
  } = useAuth();

  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [requestError, setRequestError] = useState('');

  const [responsesByRequest, setResponsesByRequest] = useState({});
  const [expandedRequests, setExpandedRequests] = useState([]);
  const [loadingResponseIds, setLoadingResponseIds] = useState([]);
  const [responseErrors, setResponseErrors] = useState({});

  const [updatingResponseIds, setUpdatingResponseIds] = useState([]);
  const [responseActionErrors, setResponseActionErrors] = useState({});

  // Private donor contact details, loaded only after acceptance.
  const [contactDetailsByResponse, setContactDetailsByResponse] = useState({});

  const handleLogout = async () => {
    try {
      await logoutDonor();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Fetch patient's blood request history.
  const fetchRequests = async () => {
    if (!currentUser) {
      setRequests([]);
      setLoadingRequests(false);
      return;
    }

    try {
      setLoadingRequests(true);
      setRequestError('');

      const requestsQuery = query(
        collection(db, 'emergencyRequests'),
        where('createdBy', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );

      const snapshot = await getDocs(requestsQuery);

      setRequests(
        snapshot.docs.map((document) => ({
          id: document.id,
          ...document.data()
        }))
      );

    } catch (error) {
      console.error('Error fetching blood requests:', error);

      setRequestError(
        'Unable to load your requests. Please refresh and try again.'
      );
    } finally {
      setLoadingRequests(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [currentUser?.uid]);

  // Fetch private donor contact information after acceptance.
  const fetchAcceptedDonorContact = async (donor) => {
    if (
      !donor?.donorId ||
      donor.status !== 'Accepted' ||
      contactDetailsByResponse[donor.id]
    ) {
      return;
    }

    try {
      const donorRef = doc(db, 'donors', donor.donorId);
      const donorSnapshot = await getDoc(donorRef);

      if (donorSnapshot.exists()) {
        const profile = donorSnapshot.data();

        setContactDetailsByResponse((previous) => ({
          ...previous,
          [donor.id]: {
            fullName: profile.fullName || donor.donorName || 'Donor',
            email: profile.email || ''
          }
        }));
      }
    } catch (error) {
      console.error('Error fetching accepted donor contact:', error);

      setContactDetailsByResponse((previous) => ({
        ...previous,
        [donor.id]: {
          error: 'Unable to load donor contact details. Please refresh.'
        }
      }));
    }
  };

  // Fetch donors interested in a particular request.
  const fetchInterestedDonors = async (requestId) => {
    if (expandedRequests.includes(requestId)) {
      setExpandedRequests((previous) =>
        previous.filter((id) => id !== requestId)
      );
      return;
    }

    setExpandedRequests((previous) => [
      ...previous,
      requestId
    ]);

    if (responsesByRequest[requestId]) {
      return;
    }

    try {
      setLoadingResponseIds((previous) => [
        ...previous,
        requestId
      ]);

      setResponseErrors((previous) => ({
        ...previous,
        [requestId]: ''
      }));

      const responsesQuery = query(
  collection(db, 'donorResponses'),
  where('patientId', '==', currentUser.uid),
  where('requestId', '==', requestId)
);
      const snapshot = await getDocs(responsesQuery);

      const donors = snapshot.docs.map((document) => ({
        id: document.id,
        ...document.data()
      }));

      setResponsesByRequest((previous) => ({
        ...previous,
        [requestId]: donors
      }));

      // Load contact details only for accepted donors.
      for (const donor of donors) {
        if (donor.status === 'Accepted') {
          await fetchAcceptedDonorContact(donor);
        }
      }

    } catch (error) {
      console.error('Error fetching interested donors:', error);

      setResponseErrors((previous) => ({
        ...previous,
        [requestId]:
          error.code === 'permission-denied'
            ? 'You do not have permission to view these donor responses.'
            : 'Unable to load interested donors. Please try again.'
      }));

    } finally {
      setLoadingResponseIds((previous) =>
        previous.filter((id) => id !== requestId)
      );
    }
  };

  // Accept or reject an interested donor.
  const handleDonorResponse = async (
    requestId,
    responseId,
    donorId,
    newStatus
  ) => {
    try {
      setUpdatingResponseIds((previous) => [
        ...previous,
        responseId
      ]);

      setResponseActionErrors((previous) => ({
        ...previous,
        [responseId]: ''
      }));

      const batch = writeBatch(db);

      const responseRef = doc(
        db,
        'donorResponses',
        responseId
      );

      // Update donor response status.
      batch.update(responseRef, {
        status: newStatus
      });

      // Create a private contact relationship only when accepted.
      if (newStatus === 'Accepted') {
        if (!donorId) {
          throw new Error('Donor ID is missing.');
        }

        const contactId = `${currentUser.uid}_${donorId}`;

        const contactRef = doc(
          db,
          'acceptedContacts',
          contactId
        );

        batch.set(contactRef, {
          patientId: currentUser.uid,
          donorId,
          requestId,
          createdAt: serverTimestamp()
        });
      }
console.log('CURRENT PATIENT UID:', currentUser?.uid);
console.log('REQUEST ID:', requestId);
console.log('DONOR ID:', donorId);
console.log('RESPONSE ID:', responseId);
      // Both operations succeed together or fail together.
      await batch.commit();
console.log('ACCEPTANCE BATCH SUCCESSFUL');
      // Update displayed response status.
      setResponsesByRequest((previous) => ({
        ...previous,
        [requestId]: (previous[requestId] || []).map((donor) =>
          donor.id === responseId
            ? { ...donor, status: newStatus }
            : donor
        )
      }));

      // Fetch donor's private profile after acceptance succeeds.
      if (newStatus === 'Accepted') {
        await fetchAcceptedDonorContact({
          id: responseId,
          donorId,
          donorName:
            responsesByRequest[requestId]?.find(
              (donor) => donor.id === responseId
            )?.donorName,
          status: 'Accepted'
        });
      }

    } catch (error) {
      console.error('Error updating donor response:', error);

      setResponseActionErrors((previous) => ({
        ...previous,
        [responseId]:
          error.code === 'permission-denied'
            ? 'Permission denied. Please check your Firestore rules.'
            : error.message ||
              'Unable to update donor status. Please try again.'
      }));

    } finally {
      setUpdatingResponseIds((previous) =>
        previous.filter((id) => id !== responseId)
      );
    }
  };

  const fullName =
    patientProfile?.fullName ||
    currentUser?.displayName ||
    'Patient';

  const city = patientProfile?.city || 'Not provided';

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-blue-100 text-blue-700';

      case 'Fulfilled':
        return 'bg-emerald-100 text-emerald-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      case 'Cancelled':
        return 'bg-slate-100 text-slate-600';

      default:
        return 'bg-amber-100 text-amber-700';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* HEADER */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-5 py-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">

          <div>
            <div className="flex items-center gap-2 text-red-600 mb-2">
              <HeartPulse size={25} />
              <span className="font-bold">BloodConnect</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Patient Dashboard
            </h1>

            <p className="text-slate-500 mt-1">
              Find blood donors and manage your blood requests.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-semibold"
          >
            <LogOut size={17} />
            Logout
          </button>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-5 py-10">

        {/* WELCOME SECTION */}
        <div className="bg-gradient-to-r from-red-600 to-red-500 rounded-3xl p-7 sm:p-10 text-white shadow-lg">

          <div className="flex items-center gap-3 mb-4">
            <User size={22} />
            <span className="font-semibold">Welcome back</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold">
            Hello, {fullName}!
          </h2>

          <p className="mt-3 text-red-100 max-w-2xl">
            Your BloodConnect patient account is ready. Search for nearby
            blood donors when you need help.
          </p>

          <div className="mt-5 flex items-center gap-2 text-sm text-red-100">
            <MapPin size={17} />
            {city}
          </div>

        </div>

        {/* ACTION CARDS */}
        <div className="mt-10">

          <h2 className="text-xl font-bold text-slate-900 mb-5">
            What would you like to do?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* FIND DONORS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-5">
                <Search className="text-red-600" size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Find Nearby Donors
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-6">
                Search for compatible blood donors based on blood group,
                location and distance.
              </p>

              <Link
                to="/find-donors"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 font-semibold"
              >
                Search Donors
                <ArrowRight size={17} />
              </Link>

            </div>

            {/* MY BLOOD REQUESTS */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <ClipboardList className="text-blue-600" size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                My Blood Requests
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-6">
                You have {requests.length} submitted blood request(s).
              </p>

              <Link
                to="/create-blood-request"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 font-semibold"
              >
                Create Blood Request
                <ArrowRight size={17} />
              </Link>

            </div>

            {/* EMERGENCY */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">

              <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-5">
                <Clock className="text-amber-600" size={25} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">
                Emergency Blood Request
              </h3>

              <p className="text-slate-500 text-sm mt-2 leading-6">
                Access the emergency request section when blood is urgently
                required.
              </p>

              <Link
                to="/patient-emergency"
                className="mt-6 flex items-center justify-center gap-2 w-full bg-amber-500 hover:bg-amber-600 text-white rounded-xl p-3 font-semibold"
              >
                Emergency Section
                <ArrowRight size={17} />
              </Link>

            </div>

          </div>
        </div>

        {/* MY REQUEST HISTORY */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex flex-col sm:flex-row justify-between gap-3 mb-6">

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                My Blood Request History
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Track your blood requests and see interested donors.
              </p>
            </div>

            <button
              onClick={fetchRequests}
              disabled={loadingRequests}
              className="flex items-center gap-2 text-sm font-semibold text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              <RefreshCw size={16} />
              Refresh
            </button>

          </div>

          {loadingRequests ? (

            <p className="text-slate-500 text-sm">
              Loading your blood requests...
            </p>

          ) : requestError ? (

            <p className="text-red-600 bg-red-50 p-4 rounded-xl text-sm">
              {requestError}
            </p>

          ) : requests.length === 0 ? (

            <div className="text-center py-10">
              <Droplet className="mx-auto text-slate-300" size={35} />

              <p className="font-semibold text-slate-700 mt-3">
                No blood requests yet
              </p>

              <p className="text-sm text-slate-500 mt-1">
                Your submitted requests will appear here.
              </p>
            </div>

          ) : (

            <div className="space-y-4">

              {requests.map((request) => {

                const isExpanded =
                  expandedRequests.includes(request.id);

                const donors =
                  responsesByRequest[request.id] || [];

                const isLoading =
                  loadingResponseIds.includes(request.id);

                return (
                  <div
                    key={request.id}
                    className="border border-slate-200 rounded-xl p-5"
                  >

                    {/* REQUEST DETAILS */}
                    <div className="flex flex-col sm:flex-row justify-between gap-3">

                      <div>
                        <h3 className="font-bold text-lg text-slate-900">
                          {request.bloodGroup} Blood
                        </h3>

                        <p className="text-sm text-slate-600 mt-1">
                          {request.units} unit(s) required
                        </p>
                      </div>

                      <span
                        className={`text-xs font-bold px-3 py-1.5 rounded-full h-fit ${getStatusStyle(request.status)}`}
                      >
                        {request.status || 'Pending'}
                      </span>

                    </div>

                    <div className="mt-4 grid sm:grid-cols-2 gap-3 text-sm text-slate-600">

                      <p>
                        <strong>Hospital:</strong> {request.hospitalName}
                      </p>

                      <p>
                        <strong>City:</strong> {request.city}
                      </p>

                      <p>
                        <strong>Required date:</strong> {request.requiredDate}
                      </p>

                      <p>
                        <strong>Urgency:</strong> {request.urgency}
                      </p>

                    </div>

                    {/* VIEW INTERESTED DONORS */}
                    <div className="mt-5 border-t border-slate-100 pt-4">

                      <button
                        type="button"
                        onClick={() => fetchInterestedDonors(request.id)}
                        disabled={isLoading}
                        className="flex items-center justify-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-5 py-3 font-semibold text-sm disabled:opacity-50"
                      >
                        <Users size={18} />

                        {isLoading
                          ? 'Loading donors...'
                          : isExpanded
                            ? 'Hide Interested Donors'
                            : 'View Interested Donors'}

                        {isExpanded
                          ? <ChevronUp size={18} />
                          : <ChevronDown size={18} />}
                      </button>

                    </div>

                    {/* INTERESTED DONORS */}
                    {isExpanded && (

                      <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-5">

                        <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                          <Users size={19} className="text-red-600" />
                          Interested Donors
                        </h4>

                        {isLoading ? (

                          <p className="text-sm text-slate-500">
                            Loading interested donors...
                          </p>

                        ) : responseErrors[request.id] ? (

                          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                            {responseErrors[request.id]}
                          </div>

                        ) : donors.length === 0 ? (

                          <div className="text-center py-6">
                            <Users
                              size={30}
                              className="mx-auto text-slate-300"
                            />

                            <p className="font-semibold text-slate-700 mt-3">
                              No interested donors yet
                            </p>

                            <p className="text-sm text-slate-500 mt-1">
                              Donors who express interest will appear here.
                            </p>
                          </div>

                        ) : (

                          <div className="space-y-3">

                            {donors.map((donor) => {
                              const isUpdating =
                                updatingResponseIds.includes(donor.id);

                              const contact =
                                contactDetailsByResponse[donor.id];

                              return (
                                <div
                                  key={donor.id}
                                  className="bg-white border border-slate-200 rounded-xl p-4"
                                >

                                  <div className="flex flex-col sm:flex-row justify-between gap-3">

                                    <div>
                                      <h5 className="font-bold text-slate-900">
                                        {donor.donorName || 'Voluntary Donor'}
                                      </h5>

                                      <p className="text-sm text-slate-600 mt-1">
                                        Blood Group: {' '}
                                        <strong>
                                          {donor.donorBloodGroup || 'Not provided'}
                                        </strong>
                                      </p>

                                      <p className="text-sm text-slate-600 mt-1">
                                        City: {donor.city || 'Not provided'}
                                      </p>
                                    </div>

                                    <span
                                      className={`rounded-full px-3 py-1.5 text-xs font-bold h-fit ${getStatusStyle(donor.status)}`}
                                    >
                                      {donor.status || 'Interested'}
                                    </span>

                                  </div>

                                  {/* ACCEPT AND REJECT BUTTONS */}
                                  {donor.status === 'Interested' && (

                                    <div className="flex flex-wrap gap-3 mt-4">

                                      <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={() =>
                                          handleDonorResponse(
                                            request.id,
                                            donor.id,
                                            donor.donorId,
                                            'Accepted'
                                          )
                                        }
                                        className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                                      >
                                        <CheckCircle size={16} />
                                        {isUpdating ? 'Updating...' : 'Accept'}
                                      </button>

                                      <button
                                        type="button"
                                        disabled={isUpdating}
                                        onClick={() =>
                                          handleDonorResponse(
                                            request.id,
                                            donor.id,
                                            donor.donorId,
                                            'Rejected'
                                          )
                                        }
                                        className="flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50"
                                      >
                                        <XCircle size={16} />
                                        Reject
                                      </button>

                                    </div>

                                  )}

                                  {responseActionErrors[donor.id] && (
                                    <p className="mt-3 text-sm text-red-600">
                                      {responseActionErrors[donor.id]}
                                    </p>
                                  )}

                                  {/* ACCEPTED DONOR CONTACT DETAILS */}
                                  {donor.status === 'Accepted' && (
                                    <div className="mt-4 rounded-xl bg-blue-50 border border-blue-100 p-4">

                                      <p className="text-sm text-blue-800 font-semibold flex items-center gap-2">
                                        <CheckCircle size={17} />
                                        You accepted this donor's response.
                                      </p>

                                      <div className="mt-3">
                                        {contact?.error ? (
                                          <p className="text-sm text-red-600">
                                            {contact.error}
                                          </p>
                                        ) : contact ? (
                                          <div className="space-y-2 text-sm text-slate-700">

                                            <p>
                                              <strong>Donor Name:</strong>{' '}
                                              {contact.fullName}
                                            </p>

                                            <p className="flex items-start gap-2">
                                              <Mail size={16} className="mt-0.5 text-blue-600" />
                                              <span>
                                                <strong>Email:</strong>{' '}
                                                {contact.email || 'Not available'}
                                              </span>
                                            </p>

                                          </div>
                                        ) : (
                                          <p className="text-sm text-blue-700">
                                            Loading accepted donor contact details...
                                          </p>
                                        )}
                                      </div>

                                    </div>
                                  )}

                                  {donor.status === 'Rejected' && (
                                    <p className="mt-3 text-sm text-red-600 font-medium">
                                      You rejected this donor's response.
                                    </p>
                                  )}

                                </div>
                              );
                            })}

                          </div>

                        )}

                      </div>

                    )}

                  </div>
                );
              })}

            </div>

          )}

        </div>

        {/* ACCOUNT INFORMATION */}
        <div className="mt-10 bg-white rounded-2xl border border-slate-200 p-6">

          <div className="flex items-center gap-3 mb-5">
            <ShieldCheck className="text-emerald-600" size={24} />

            <h2 className="text-xl font-bold text-slate-900">
              Account Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="font-semibold text-slate-900 mt-1">
                {fullName}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>

              <p className="font-semibold text-slate-900 mt-1 break-all">
                {currentUser?.email || 'Not available'}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">City</p>

              <p className="font-semibold text-slate-900 mt-1">
                {city}
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Account Type</p>

              <p className="font-semibold text-red-600 mt-1 flex items-center gap-2">
                <Droplet size={16} />
                Patient
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
