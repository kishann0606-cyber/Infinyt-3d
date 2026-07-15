import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, X, Mail, Phone, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Inquiry {
  id: string; name: string; email: string; phone: string | null; company: string | null;
  service: string | null; subject: string | null; message: string; status: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  read: 'bg-yellow-500/20 text-yellow-400',
  replied: 'bg-green-500/20 text-green-400',
  closed: 'bg-gray-500/20 text-gray-400',
};

export function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<Inquiry | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setInquiries(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id);
    fetchData();
    if (selected?.id === id) setSelected(prev => prev ? { ...prev, status } : null);
  };

  const filtered = inquiries.filter(i => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase()) || i.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || i.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inquiries</h1>
        <p className="text-navy-400 text-sm">Customer messages & contact form submissions</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search inquiries…"
            className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white focus:outline-none">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-navy-400">No inquiries found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-navy-700">
                <tr>
                  {['Name', 'Service', 'Date', 'Status', ''].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filtered.map(inq => (
                  <motion.tr key={inq.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-navy-700/40 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{inq.name}</p>
                      <p className="text-navy-400 text-xs">{inq.email}</p>
                    </td>
                    <td className="px-5 py-4 text-navy-300 text-sm capitalize">{(inq.service || inq.subject || '')?.replace(/-/g, ' ')}</td>
                    <td className="px-5 py-4 text-navy-400 text-sm">{new Date(inq.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <select value={inq.status} onChange={e => updateStatus(inq.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${STATUS_COLORS[inq.status] || 'bg-navy-600 text-navy-300'}`}>
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(inq)} className="p-2 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="text-lg font-bold text-white">Inquiry from {selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-navy-400 hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-navy-400" />
                  <a href={`mailto:${selected.email}`} className="text-accent-400 text-sm hover:underline">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-navy-400" />
                    <a href={`tel:${selected.phone}`} className="text-accent-400 text-sm hover:underline">{selected.phone}</a>
                  </div>
                )}
              </div>
              {selected.company && <p className="text-navy-300 text-sm"><span className="text-navy-400">Company: </span>{selected.company}</p>}
              <p className="text-navy-300 text-sm"><span className="text-navy-400">Service: </span><span className="capitalize">{(selected.service || selected.subject || '')?.replace(/-/g, ' ')}</span></p>
              <p className="text-navy-300 text-sm"><span className="text-navy-400">Date: </span>{new Date(selected.created_at).toLocaleString()}</p>
              <div>
                <div className="flex items-center gap-2 mb-2"><MessageSquare className="w-4 h-4 text-navy-400" /><span className="text-navy-400 text-sm">Message</span></div>
                <p className="text-white text-sm whitespace-pre-wrap bg-navy-900 p-4 rounded-xl">{selected.message}</p>
              </div>
              <div className="flex gap-3">
                <a href={`mailto:${selected.email}?subject=Re: Your Inquiry - Infinyt3D`}
                  className="flex-1 py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors text-center text-sm">
                  Reply via Email
                </a>
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/[^0-9]/g, '')}?text=Hi ${selected.name}, thank you for contacting Infinyt3D!`}
                    target="_blank" rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-colors text-center text-sm">
                    WhatsApp
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
