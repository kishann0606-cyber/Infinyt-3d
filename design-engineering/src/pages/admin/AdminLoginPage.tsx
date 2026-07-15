import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { data: adminData } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', data.user.id)
        .maybeSingle();

      if (adminData) {
        navigate('/admin/dashboard');
      } else {
        setError('Access denied. Admin privileges required.');
        await supabase.auth.signOut();
      }
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        {/* Logo header */}
        <div className="text-center mb-8">
          <img src="/images/products/infinyt_3dlodo.jpg" alt="Infinyt3D" className="w-16 h-16 rounded-full object-cover mx-auto mb-4 border-2 border-accent-500" />
          <h1 className="text-2xl font-bold text-white">Admin Login</h1>
          <p className="text-navy-400 text-sm mt-1">Infinyt3D Management Panel</p>
        </div>

        <div className="bg-navy-800 rounded-2xl p-8 border border-navy-700 shadow-2xl">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-4 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-colors"
                  placeholder="admin@infinyt3d.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-navy-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-12 pr-4 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500 transition-colors"
                  placeholder="Enter your password" />
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-navy-400">
              Need an admin account?{' '}
              <Link to="/admin/signup" className="text-accent-400 hover:text-accent-300 font-medium">Register here</Link>
            </p>
            <p className="text-xs text-navy-600">Restricted access — admin setup code required</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
