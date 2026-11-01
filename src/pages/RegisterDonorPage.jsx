import React, { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import {
  UserPlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Droplet,
  MapPin,
  Mail,
  Lock,
  User,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { BLOOD_GROUPS } from '../data/bloodCompatibility';
import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';

export default function RegisterDonorPage() {
  const { registerDonor, currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    bloodGroup: 'O+',
    city: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [location, setLocation] = useState(null);
  const [locationConsent, setLocationConsent] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);   

  // If already logged in, redirect to dashboard
  if (!authLoading && currentUser && !successData) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    const { fullName, email, password, confirmPassword, bloodGroup, city } = formData;

    if (!fullName.trim() || fullName.trim().length < 2) {
      return 'Please enter your full legal name (at least 2 characters).';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      return 'Please provide a valid email address.';
    }

    if (!bloodGroup || !BLOOD_GROUPS.includes(bloodGroup)) {
      return 'Please select a valid blood group.';
    }

    if (!city.trim() || city.trim().length < 2) {
      return 'Please enter your city or locality (at least 2 characters).';
    }

    if (!password) {
      return 'Please enter a password.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }

    if (password !== confirmPassword) {
      return 'Passwords do not match. Please verify both password entries.';
    }

    return null;
  };
  const getApproximateLocation = () => {
  if (!locationConsent) {
    window.alert("Please agree to share your approximate location first.");
    return;
  }

  if (!navigator.geolocation) {
    window.alert("Location detection is not supported by your browser.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = Number(position.coords.latitude.toFixed(2));
      const longitude = Number(position.coords.longitude.toFixed(2));

      setLocation({ latitude, longitude });
      setLocationLoading(false);
    },
    (error) => {
      setLocationLoading(false);

      if (error.code === 1) {
        window.alert("Location permission denied. Please allow location access.");
      } else {
        window.alert("Unable to detect your location. Please try again.");
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000
    }
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await registerDonor({
  fullName: formData.fullName,
  email: formData.email,
  password: formData.password,
  bloodGroup: formData.bloodGroup,
  city: formData.city,
  location: location
      });

      setSuccessData({
        uid: user.uid,
        fullName: formData.fullName,
        email: formData.email,
        bloodGroup: formData.bloodGroup,
        city: formData.city
      });
    } catch (err) {
      console.error('Registration error:', err);
      const friendlyMessage = getFriendlyAuthErrorMessage(
        err.code,
        err.message || 'Registration failed. Please check your information and try again.'
      );
      setError(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-[#F8FAFC] min-h-[calc(100vh-80px)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-xl mx-auto mb-8">
          <Badge variant="red" size="md" className="mb-2">
            Voluntary Donor Registration
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
            Register as a Blood Donor
          </h1>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Create your donor account with Firebase Authentication. Your profile will be added to the verified donor registry with initial availability set to resting.
          </p>
        </div>

        {successData ? (
          /* Registration Success Screen */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-12 text-center shadow-sm space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-18 h-18 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-12 h-12" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
                Account Created Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
                Welcome, {successData.fullName}!
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Your authenticated donor record has been registered in the Firebase Firestore database under collection <code className="bg-slate-100 text-[#DC2626] px-1.5 py-0.5 rounded text-xs font-mono font-bold">donors/{successData.uid}</code>.
              </p>
            </div>

            {/* Donor Digital Summary Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FEF2F2] to-white border border-red-200 text-left space-y-4">
              <div className="flex items-center justify-between border-b border-red-100 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#DC2626] text-white flex items-center justify-center font-black text-xl shadow-md shadow-red-500/20">
                    {successData.bloodGroup}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-[#0F172A]">{successData.fullName}</h4>
                    <span className="text-xs text-slate-500">{successData.email}</span>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                  Initial: Resting (Inactive)
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs text-slate-600">
                <div>
                  <span className="text-slate-400 block font-medium">City:</span>
                  <strong className="text-slate-900 text-sm">{successData.city}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block font-medium">Initial Availability:</span>
                  <strong className="text-amber-600 font-bold">false (Resting)</strong>
                </div>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                variant="primary"
                size="lg"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate('/dashboard')}
                className="w-full sm:w-auto shadow-md shadow-red-500/20"
              >
                Go to Donor Dashboard
              </Button>
            </div>
          </div>
        ) : (
          /* Registration Form Card */
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            
            {/* Error Message Alert */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-3 animate-in fade-in duration-200">
                <AlertCircle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
                <div className="flex-1 font-medium">{error}</div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. Eleanor Vance"
                    value={formData.fullName}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    disabled={isSubmitting}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    placeholder="donor@example.com"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    disabled={isSubmitting}
                    autoComplete="email"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                    required
                  />
                </div>
              </div>

              {/* Blood Group and City Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Blood Group */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Blood Group *
                  </label>
                  <div className="relative">
                    <Droplet className="w-4 h-4 text-[#DC2626] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => handleChange('bloodGroup', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all cursor-pointer disabled:opacity-60"
                      required
                    >
                      {BLOOD_GROUPS.map((g) => (
                        <option key={g} value={g}>
                          {g} Blood Group
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    City / Locality *
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="e.g. San Francisco"
                      value={formData.city}
                      onChange={(e) => handleChange('city', e.target.value)}
                      disabled={isSubmitting}
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                      required
                    />
                  </div>
                </div>

              </div>
                              {/* Approximate Location Consent */}
                <div className="mt-4 space-y-3 rounded-xl border border-red-100 bg-red-50 p-4">
                  <label className="flex items-start gap-3 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={locationConsent}
                      onChange={(e) => {
                        setLocationConsent(e.target.checked);
                        setLocation(null);
                      }}
                      className="mt-1"
                    />

                    <span>
                      I agree to share my approximate location to help nearby
                      people find me when blood is needed. My exact GPS
                      coordinates will not be stored.
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={getApproximateLocation}
                    disabled={!locationConsent || locationLoading}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {locationLoading
                      ? "Detecting location..."
                      : location
                        ? "Location detected ✓"
                        : "Detect my approximate location"}
                  </button>

                  {location && (
                    <p className="text-xs text-green-700">
                      Approximate location detected successfully.
                    </p>
                  )}
                </div>

              {/* Password and Confirm Password Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min. 6 characters"
                      value={formData.password}
                      onChange={(e) => handleChange('password', e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Re-enter password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange('confirmPassword', e.target.value)}
                      disabled={isSubmitting}
                      autoComplete="new-password"
                      className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

              </div>

              {/* Security and Privacy Notice */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 space-y-1">
                <div className="flex items-center gap-2 font-semibold text-slate-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Privacy Protection & Initial Status</span>
                </div>
                <p>
                  Your account will be registered with initial availability set to <strong>Resting (false)</strong>. Phone numbers and GPS coordinates are never publicly exposed.
                </p>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center shadow-md shadow-red-500/20"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Creating Donor Profile...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <UserPlus className="w-4 h-4" />
                      <span>Complete Donor Registration</span>
                    </span>
                  )}
                </Button>
              </div>

            </form>

            {/* Switch to Login */}
            <div className="mt-6 pt-5 border-t border-slate-100 text-center text-sm text-slate-600">
              <span>Already registered as a donor? </span>
              <Link
                to="/login"
                className="font-bold text-[#DC2626] hover:text-[#B91C1C] hover:underline transition-colors"
              >
                Sign In to Portal
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
