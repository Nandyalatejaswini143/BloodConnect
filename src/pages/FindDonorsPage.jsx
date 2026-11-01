
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  MapPin,
  ShieldCheck,
  Droplet,
  Users
} from 'lucide-react';

import Badge from '../components/common/Badge';
import Card from '../components/common/Card';

import { db } from '../firebase';
import {
  collection,
  getDocs
} from 'firebase/firestore';

const BLOOD_GROUP_OPTIONS = [
  'ALL',
  'A+',
  'A-',
  'B+',
  'B-',
  'AB+',
  'AB-',
  'O+',
  'O-'
];

export default function FindDonorsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedGroup = searchParams.get('group') || 'ALL';
  const locationQuery = searchParams.get('location') || '';

  const [availabilityFilter, setAvailabilityFilter] = useState('ALL');

  const [donors, setDonors] = useState([]);
  const [loadingDonors, setLoadingDonors] = useState(true);
  const [donorError, setDonorError] = useState('');

  // Fetch public donor information from Firestore.
  useEffect(() => {
    const fetchDonors = async () => {
      try {
        setLoadingDonors(true);
        setDonorError('');

        const snapshot = await getDocs(
          collection(db, 'publicDonorDirectory')
        );

        const donorList = snapshot.docs.map((document) => {
          const data = document.data();

          return {
            id: document.id,
            bloodGroup: data.bloodGroup || '',
            city: data.city || '',
            availability: data.availability === true
          };
        });

        setDonors(donorList);

        console.log('REAL DONORS FETCHED:', donorList);

      } catch (error) {
        console.error('Error fetching donors:', error);

        setDonorError(
          'Unable to load donors. Please check your login and try again.'
        );
      } finally {
        setLoadingDonors(false);
      }
    };

    fetchDonors();
  }, []);

  // Update URL search parameters.
  const updateSearchParam = (key, value) => {
    const nextParams = new URLSearchParams(searchParams);

    if (value && value !== 'ALL') {
      nextParams.set(key, value);
    } else {
      nextParams.delete(key);
    }

    setSearchParams(nextParams);
  };

  // Filter donors by blood group, city and availability.
  const filteredDonors = donors.filter((donor) => {
    const matchGroup =
      selectedGroup === 'ALL' ||
      donor.bloodGroup === selectedGroup;

    const matchLocation =
      locationQuery.trim() === '' ||
      donor.city.toLowerCase().includes(
        locationQuery.trim().toLowerCase()
      );

    const matchAvailability =
      availabilityFilter === 'ALL' ||
      (availabilityFilter === 'AVAILABLE' &&
        donor.availability === true) ||
      (availabilityFilter === 'UNAVAILABLE' &&
        donor.availability === false);

    return (
      matchGroup &&
      matchLocation &&
      matchAvailability
    );
  });

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-screen">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Page Header */}
        <div className="max-w-3xl mb-8">

          <Badge variant="red" size="md" className="mb-2">
            Voluntary Donor Directory
          </Badge>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Find Blood Donors
          </h1>

          <p className="mt-2 text-slate-600 text-sm sm:text-base">
            Search voluntary blood donors by blood group,
            city and availability.
          </p>

        </div>

        {/* Search and Filters */}
        <Card className="p-5 mb-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* Blood Group Filter */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Blood Group
              </label>

              <select
                value={selectedGroup}
                onChange={(e) =>
                  updateSearchParam('group', e.target.value)
                }
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white outline-none focus:border-red-400"
              >
                {BLOOD_GROUP_OPTIONS.map((group) => (
                  <option key={group} value={group}>
                    {group === 'ALL'
                      ? 'All Blood Groups'
                      : group}
                  </option>
                ))}
              </select>

            </div>

            {/* City Filter */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                City
              </label>

              <div className="relative">

                <MapPin className="absolute left-3 top-3.5 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) =>
                    updateSearchParam('location', e.target.value)
                  }
                  placeholder="Enter city name"
                  className="w-full border border-slate-200 rounded-xl p-3 pl-10 text-sm bg-white outline-none focus:border-red-400"
                />

              </div>

            </div>

            {/* Availability Filter */}
            <div>

              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Availability
              </label>

              <select
                value={availabilityFilter}
                onChange={(e) =>
                  setAvailabilityFilter(e.target.value)
                }
                className="w-full border border-slate-200 rounded-xl p-3 text-sm bg-white outline-none focus:border-red-400"
              >
                <option value="ALL">All Donors</option>
                <option value="AVAILABLE">Available</option>
                <option value="UNAVAILABLE">Unavailable</option>
              </select>

            </div>

          </div>

        </Card>

        {/* Donor Count */}
        {!loadingDonors && !donorError && (
          <div className="flex items-center justify-between mb-6">

            <div className="flex items-center gap-2 text-slate-600 text-sm">

              <Users className="w-4 h-4" />

              <span>
                {filteredDonors.length} donor(s) found
              </span>

            </div>

          </div>
        )}

        {/* Loading State */}
        {loadingDonors && (
          <div className="text-center py-16">

            <div className="animate-spin rounded-full h-10 w-10 border-4 border-red-200 border-t-red-600 mx-auto mb-4"></div>

            <p className="text-slate-500 text-sm">
              Loading real donors...
            </p>

          </div>
        )}

        {/* Error State */}
        {!loadingDonors && donorError && (
          <div className="text-center py-16">

            <p className="text-red-600 font-semibold">
              {donorError}
            </p>

          </div>
        )}

        {/* Empty State */}
        {!loadingDonors &&
          !donorError &&
          filteredDonors.length === 0 && (

            <div className="text-center py-16">

              <Droplet className="w-12 h-12 text-slate-300 mx-auto mb-4" />

              <h3 className="text-lg font-bold text-slate-700">
                No donors found
              </h3>

              <p className="text-sm text-slate-500 mt-2">
                Try changing your blood group, city or availability filters.
              </p>

            </div>
          )}

        {/* Real Donor Cards */}
        {!loadingDonors &&
          !donorError &&
          filteredDonors.length > 0 && (

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {filteredDonors.map((donor) => (

                <Card
                  key={donor.id}
                  className="p-6 flex flex-col justify-between hover:border-red-200 transition-all"
                >

                  <div>

                    {/* Donor Header */}
                    <div className="flex items-center justify-between mb-5">

                      <div className="flex items-center gap-3">

                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#DC2626] to-[#B91C1C] text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/20">
                          {donor.bloodGroup}
                        </div>

                        <div>

                          <h3 className="font-bold text-base text-[#0F172A]">
                            Blood Donor
                          </h3>

                          <span className="text-xs text-slate-400">
                            Directory Member
                          </span>

                        </div>

                      </div>

                      <ShieldCheck className="w-5 h-5 text-emerald-600" />

                    </div>

                    {/* Donor Details */}
                    <div className="space-y-3 py-4 border-y border-slate-100 text-xs">

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Blood Group:
                        </span>

                        <span className="font-semibold text-slate-800">
                          {donor.bloodGroup}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          City:
                        </span>

                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#DC2626]" />
                          {donor.city}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500">
                          Availability:
                        </span>

                        <span
                          className={`font-semibold ${
                            donor.availability
                              ? 'text-emerald-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {donor.availability
                            ? 'Available'
                            : 'Unavailable'}
                        </span>
                      </div>

                    </div>

                  </div>

                  {/* Protected Information */}
                  <div className="pt-4 mt-2">

                    <p className="text-[11px] text-slate-400">
                      Donor personal information is protected.
                    </p>

                  </div>

                </Card>

              ))}

            </div>
          )}

      </div>

    </div>
  );
}
