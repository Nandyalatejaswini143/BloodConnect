import React, { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import {
  Droplet,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';

export default function LoginPage() {
  const { loginDonor, currentUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated and not loading, redirect to dashboard or original destination
  const from = location.state?.from?.pathname || '/dashboard';
  if (!authLoading && currentUser) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError('Please enter a valid email address format.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    try {
      setIsSubmitting(true);
      await loginDonor(trimmedEmail, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      const friendlyMessage = getFriendlyAuthErrorMessage(
        err.code,
        err.message || 'Unable to sign in. Please verify your email and password.'
      );
      setError(friendlyMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-16 bg-[#F8FAFC] min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full max-w-md px-4 sm:px-6">
        
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#B91C1C] to-[#DC2626] text-white shadow-lg shadow-red-500/25 mb-4">
            <Droplet className="w-7 h-7 fill-white" />
          </div>

          <Badge variant="red" size="md" className="mb-2">
            Donor Portal Access
          </Badge>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] tracking-tight">
            Welcome Back, Donor
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Sign in to manage your availability and emergency response status.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
          
          {/* Error Message Box */}
          {error && (
            <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-200 text-xs sm:text-sm text-red-800 flex items-start gap-3 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            
            {/* Email Field */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="donor@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="email"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-[#0F172A] bg-slate-50/60 focus:outline-none focus:ring-2 focus:ring-[#DC2626] focus:bg-white transition-all disabled:opacity-60"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  autoComplete="current-password"
                  disabled={isSubmitting}
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
                    <span>Signing In...</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </div>

          </form>

          {/* Privacy Note */}
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Encrypted Donor Authentication</span>
          </div>

        </div>

        {/* Switch to Register */}
        <div className="text-center mt-6 text-sm text-slate-600">
          <span>Not registered as a voluntary donor yet? </span>
          <Link
            to="/register"
            className="font-bold text-[#DC2626] hover:text-[#B91C1C] hover:underline transition-colors"
          >
            Register as Donor
          </Link>
        </div>

      </div>
    </div>
  );
}
