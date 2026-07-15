import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ShoppingBag, Mail, Users, TrendingUp, ArrowRight, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Inquiry { id: string; name: string; email: string; service: string; created_at: string; status: string; }

export function AdminDashboardPage() {
  const [counts, setCounts] = useState({ products: 0, inquiries: 0, careers: 0 });
  const [recent, setRecent] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [p, i, c] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('contact_messages').select('id, name, email, service, created_at, status').order('created_at', { ascending: false }).limit(6),
        supabase.from('career_applications').select('id', { count: 'exact', head: true }),
      ]);
      setCounts({ products: p.count || 0, inquiries: i.data?.length || 0, careers: c.count || 0 });
      setRecent(i.data || []);
      setLoading(false);
    })();
  }, []);

  const cards = [
    { name: 'Products', value: counts.products, icon: Package, color: 'bg-blue-500', href: '/admin/products' },
    { name: 'Orders', value: 0, icon: ShoppingBag, color: 'bg-green-500', href: '/admin/orders' },
    { name: 'Inquiries', value: counts.inquiries, icon: Mail, color: 'bg-accent-500', href: '/admin/inquiries' },
    { name: 'Career Apps', value: counts.careers, icon: Users, color: 'bg-purple-500', href: '/admin/careers' },
  ];

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-navy-400 text-sm">Welcome back — here's your overview.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <motion.div key={card.name} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Link to={card.href} className="block bg-navy-800 rounded-xl p-5 border border-navy-700 hover:border-accent-500/40 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center`}>
                  <card.icon className="w-6 h-6 text-white" />
                </div>
                <ArrowUpRight className="w-4 h-4 text-navy-500" />
              </div>
              <p className="text-3xl font-bold text-white">{card.value}</p>
              <p className="text-sm text-navy-400 mt-1">{card.name}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Inquiries */}
        <div className="lg:col-span-2 bg-navy-800 rounded-xl border border-navy-700">
          <div className="flex items-center justify-between p-5 border-b border-navy-700">
            <h2 className="font-semibold text-white">Recent Inquiries</h2>
            <Link to="/admin/inquiries" className="text-sm text-accent-400 hover:text-accent-300 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-navy-700">
            {recent.length === 0 ? (
              <div className="p-5 text-center text-navy-400 text-sm">No recent inquiries</div>
            ) : recent.map((r) => (
              <div key={r.id} className="p-4 flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{r.name}</p>
                  <p className="text-navy-400 text-xs">{r.email}</p>
                </div>
                <div className="text-right">
                  <p className="text-navy-300 text-xs capitalize">{r.service?.replace(/-/g, ' ')}</p>
                  <p className="text-navy-500 text-xs">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-navy-800 rounded-xl border border-navy-700 p-5">
          <h2 className="font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link to="/admin/products" className="flex items-center gap-3 p-3 bg-navy-700 hover:bg-navy-600 rounded-xl transition-colors">
              <Package className="w-5 h-5 text-blue-400" />
              <span className="text-white text-sm">Add New Product</span>
            </Link>
            <Link to="/admin/inquiries" className="flex items-center gap-3 p-3 bg-navy-700 hover:bg-navy-600 rounded-xl transition-colors">
              <Mail className="w-5 h-5 text-accent-400" />
              <span className="text-white text-sm">Check Inquiries</span>
            </Link>
            <Link to="/admin/careers" className="flex items-center gap-3 p-3 bg-navy-700 hover:bg-navy-600 rounded-xl transition-colors">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">Review Applications</span>
            </Link>
            <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-navy-700 hover:bg-navy-600 rounded-xl transition-colors">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span className="text-white text-sm">View Live Website</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
