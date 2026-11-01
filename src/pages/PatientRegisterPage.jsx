
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  User,
  Mail,
  Lock,
  MapPin,
  Eye,
  EyeOff,
  HeartPulse,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';

export default function PatientRegisterPage() {
  const { registerPatient, currentUser, userRole, loading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    city: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  if (currentUser && userRole === 'donor') {
    return <NavigateToDonor />;
  }

  if (currentUser && userRole === 'patient') {
    return <NavigateToPatient />;
  }

  const handleChange = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value
    }));

    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const { fullName, email, password, confirmPassword, city } = formData;

    if (
      fullName.trim().length < 2 ||
      !email.trim() ||
      !city.trim()
    ) {
      setError('Please complete all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      setSubmitting(true);

      await registerPatient({
        fullName,
        email,
        password,
        city
      });

      setSuccess(true);

    } catch (err) {
      console.error('Patient registration error:', err);

      setError(
        getFriendlyAuthErrorMessage(
          err.code,
          err.message || 'Patient registration failed.'
        )
      );

    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-5">
        <div className="bg-white rounded-3xl p-8 text-center shadow-sm max-w-md w-full">
          <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto mb-4" />

          <h2 className="text-2xl font-bold text-slate-900">
            Patient Account Created!
          </h2>

          <p className="text-slate-600 mt-3">
            Welcome to BloodConnect. Your patient account is ready.
          </p>

          <button
            onClick={() => navigate('/patient-dashboard')}
            className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl p-3 font-bold"
          >
            Go to Patient Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4">
      <div className="max-w-xl mx-auto">

        <div className="text-center mb-8">
          <HeartPulse className="w-12 h-12 text-red-600 mx-auto mb-3" />

          <h1 className="text-3xl font-extrabold text-slate-900">
            Patient Registration
          </h1>

          <p className="text-slate-600 mt-2">
            Create an account to search for blood donors.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-9 shadow-sm">

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl flex gap-2 text-sm text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <div>
              <label className="block text-sm font-semibold mb-2">
                Full Name
              </label>

              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border rounded-xl p-3 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Email Address
              </label>

              <div className="relative">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className="w-full border rounded-xl p-3 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                City / Locality
              </label>

              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                  placeholder="Enter your city"
                  className="w-full border rounded-xl p-3 pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full border rounded-xl p-3 pl-10 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Confirm Password
              </label>

              <div className="relative">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />

                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full border rounded-xl p-3 pl-10 pr-12"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-500"
                >
                  {showConfirmPassword
                    ? <EyeOff size={18} />
                    : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <UserPlus size={18} />
              {submitting ? 'Creating Account...' : 'Create Patient Account'}
            </button>

          </form>

          <div className="text-center mt-6 text-sm text-slate-600">
            Already registered?{' '}
            <Link to="/login" className="text-red-600 font-bold">
              Login
            </Link>
          </div>

          <div className="text-center mt-3 text-sm text-slate-600">
            Want to donate blood?{' '}
            <Link to="/register" className="text-red-600 font-bold">
              Register as Donor
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

function NavigateToDonor() {
  const navigate = useNavigate();
  React.useEffect(() => navigate('/dashboard', { replace: true }), [navigate]);
  return null;
}

function NavigateToPatient() {
  const navigate = useNavigate();
  React.useEffect(() => navigate('/patient-dashboard', { replace: true }), [navigate]);
  return null;
}
