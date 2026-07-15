import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AdminSignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminCode, setAdminCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const passwordStrength = (p: string) => {
    let score = 0;
    if (p.length >= 8) score++;
    if (p.length >= 12) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  };

  const strength = passwordStrength(password);
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'][strength];
  const strengthColor = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-500'][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({ email, password, adminCode }),
        }
      );

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error || 'Registration failed. Please try again.');
        setLoading(false);
        return;
      }

      setSuccess(true);
      // Auto sign in after successful registration
      setTimeout(async () => {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (!signInError) {
          navigate('/admin/dashboard');
        } else {
          navigate('/admin/login');
        }
      }, 2000);
    } catch {
      setError('Network error. Please check your connection.');
    }

    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 px-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Account Created!</h2>
          <p className="text-navy-400">Signing you in to the admin panel…</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <img src="/images/products/infinyt_3dlodo.jpg" alt="Infinyt3D"
            className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-accent-500" />
          <h1 className="text-2xl font-bold text-white">Create Admin Account</h1>
          <p className="text-navy-400 text-sm mt-1">Infinyt3D Management Panel</p>
        </div>

        <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700 shadow-2xl">

          {/* Info banner */}
          <div className="mb-6 p-4 bg-accent-500/10 border border-accent-500/30 rounded-xl flex items-start gap-3">
            <KeyRound className="w-5 h-5 text-accent-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-accent-300">
              You need the <strong>Admin Setup Code</strong> to register. Contact the system owner if you don't have one.
            </p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-colors"
                  placeholder="admin@infinyt3d.com" />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full pl-12 pr-12 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-colors"
                  placeholder="Minimum 8 characters" />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500 hover:text-navy-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= strength ? strengthColor : 'bg-navy-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-navy-500">{strengthLabel}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required
                  className={`w-full pl-12 pr-4 py-3 bg-navy-900 border rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 transition-colors ${
                    confirmPassword && password !== confirmPassword ? 'border-red-500/60 focus:border-red-500' : 'border-navy-600 focus:border-accent-500'
                  }`}
                  placeholder="Re-enter password" />
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="text-xs text-red-400 mt-1">Passwords do not match</p>
              )}
            </div>

            {/* Admin Code */}
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Admin Setup Code</label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type="password" value={adminCode} onChange={e => setAdminCode(e.target.value)} required
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-colors"
                  placeholder="Enter the setup code" />
              </div>
              <p className="text-xs text-navy-500 mt-1">Default code: INFINYT3D_SETUP_2024</p>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating Account…</>
              ) : (
                <><UserPlus className="w-5 h-5" />Create Admin Account</>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-navy-500">
            Already have an account?{' '}
            <Link to="/admin/login" className="text-accent-400 hover:text-accent-300 font-medium">Sign In</Link>
          </p>
        </div>

        <p className="text-center text-xs text-navy-600 mt-6">
          Infinyt3D Pvt. Ltd. — Admin Portal · Restricted Access
        </p>
      </motion.div>
    </div>
  );
}
