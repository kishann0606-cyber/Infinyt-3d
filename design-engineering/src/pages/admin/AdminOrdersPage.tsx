import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, X, Mail, Phone, Package, CreditCard } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Order {
  id: string; customer_name: string; customer_email: string; customer_phone: string;
  product_name: string; quantity: number; total_amount: number; status: string; payment_status: string; created_at: string;
}

const STATUS = { pending: 'bg-yellow-500/20 text-yellow-400', processing: 'bg-blue-500/20 text-blue-400', shipped: 'bg-purple-500/20 text-purple-400', delivered: 'bg-green-500/20 text-green-400', cancelled: 'bg-red-500/20 text-red-400' };
const PAYMENT = { pending: 'bg-orange-500/20 text-orange-400', paid: 'bg-green-500/20 text-green-400', failed: 'bg-red-500/20 text-red-400', refunded: 'bg-gray-500/20 text-gray-400' };

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('orders').update({ status }).eq('id', id);
    fetchOrders();
  };

  const filtered = orders.filter(o => {
    const m = o.customer_name?.toLowerCase().includes(search.toLowerCase()) || o.customer_email?.toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || o.status === filter;
    return m && s;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Orders</h1>
        <p className="text-navy-400 text-sm">Track and manage customer orders</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
            className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white">
          {['all','pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Status' : s}</option>)}
        </select>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-navy-400">No orders yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-navy-700">
                <tr>{['Customer','Product','Total','Status','Payment',''].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filtered.map(o => (
                  <motion.tr key={o.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-navy-700/40 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{o.customer_name}</p>
                      <p className="text-navy-400 text-xs">{o.customer_email}</p>
                    </td>
                    <td className="px-5 py-4 text-navy-300 text-sm">{o.product_name}</td>
                    <td className="px-5 py-4 text-white font-medium">₹{o.total_amount?.toLocaleString()}</td>
                    <td className="px-5 py-4">
                      <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${STATUS[o.status as keyof typeof STATUS] || 'bg-navy-600 text-navy-300'}`}>
                        {Object.keys(STATUS).map(s => <option key={s} value={s} className="capitalize bg-navy-900">{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${PAYMENT[o.payment_status as keyof typeof PAYMENT] || 'bg-navy-600 text-navy-300'}`}>{o.payment_status}</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(o)} className="p-2 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-md">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="text-lg font-bold text-white">Order Details</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-navy-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              {[
                { icon: Package, label: 'Product', value: selected.product_name },
                { icon: Mail, label: 'Email', value: selected.customer_email, href: `mailto:${selected.customer_email}` },
                { icon: Phone, label: 'Phone', value: selected.customer_phone, href: `tel:${selected.customer_phone}` },
                { icon: CreditCard, label: 'Total', value: `₹${selected.total_amount?.toLocaleString()} (Qty: ${selected.quantity})` },
              ].map(item => item.value && (
                <div key={item.label} className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-navy-400 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-navy-400">{item.label}</p>
                    {item.href ? <a href={item.href} className="text-accent-400 text-sm hover:underline">{item.value}</a>
                      : <p className="text-white text-sm">{item.value}</p>}
                  </div>
                </div>
              ))}
              <p className="text-navy-400 text-xs">Ordered: {new Date(selected.created_at).toLocaleString()}</p>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
