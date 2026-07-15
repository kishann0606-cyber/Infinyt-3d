import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, X, Mail, Phone, FileText, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface PrototypeRequest {
  id: string; name: string; email: string; phone: string | null; company: string | null;
  description: string; status: string; priority: string; estimated_price: number | null;
  notes: string | null; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
  quoted: 'bg-accent-500/20 text-accent-400',
  approved: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
  completed: 'bg-emerald-500/20 text-emerald-400',
};

const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-500/20 text-gray-400',
  normal: 'bg-blue-500/20 text-blue-400',
  high: 'bg-orange-500/20 text-orange-400',
  urgent: 'bg-red-500/20 text-red-400',
};

export function AdminPrototypeRequestsPage() {
  const [requests, setRequests] = useState<PrototypeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<PrototypeRequest | null>(null);
  const [notes, setNotes] = useState('');
  const [price, setPrice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase
      .from('prototype_requests')
      .select('*')
      .order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('prototype_requests').update({ status }).eq('id', id);
    fetchData();
  };

  const saveNotes = async () => {
    if (!selected) return;
    setSaving(true);
    const update: Record<string, unknown> = { notes };
    if (price) update.estimated_price = parseFloat(price);
    await supabase.from('prototype_requests').update(update).eq('id', selected.id);
    fetchData();
    setSelected(prev => prev ? { ...prev, notes, estimated_price: price ? parseFloat(price) : prev.estimated_price } : null);
    setSaving(false);
  };

  const openDetail = (req: PrototypeRequest) => {
    setSelected(req);
    setNotes(req.notes || '');
    setPrice(req.estimated_price?.toString() || '');
  };

  const filtered = requests.filter(r => {
    const m = r.name.toLowerCase().includes(search.toLowerCase()) || r.email.toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || r.status === filter;
    return m && s;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Prototype Requests</h1>
        <p className="text-navy-400 text-sm">Custom 3D printing and prototyping inquiries</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests…"
            className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white">
          {['all','pending','reviewing','quoted','approved','completed','rejected'].map(s => (
            <option key={s} value={s} className="capitalize">{s === 'all' ? 'All Status' : s}</option>
          ))}
        </select>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-navy-400">No prototype requests found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-navy-700">
                <tr>{['Client','Description','Priority','Status','Date',''].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filtered.map(r => (
                  <motion.tr key={r.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-navy-700/40 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{r.name}</p>
                      <p className="text-navy-400 text-xs">{r.email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-navy-300 text-sm max-w-xs truncate">{r.description}</p>
                      {r.company && <p className="text-navy-500 text-xs">{r.company}</p>}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize ${PRIORITY_COLORS[r.priority] || 'bg-navy-600 text-navy-300'}`}>
                        {r.priority}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <select value={r.status} onChange={e => updateStatus(r.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer capitalize ${STATUS_COLORS[r.status] || 'bg-navy-600 text-navy-300'}`}>
                        {['pending','reviewing','quoted','approved','rejected','completed'].map(s => (
                          <option key={s} value={s} className="bg-navy-900 capitalize">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4 text-navy-400 text-sm">{new Date(r.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <button onClick={() => openDetail(r)} className="p-2 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors">
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

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Layers className="w-5 h-5 text-accent-500" />
                Prototype Request
              </h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-navy-400 hover:text-white" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-navy-400" />
                  <a href={`mailto:${selected.email}`} className="text-accent-400 hover:underline truncate">{selected.email}</a>
                </div>
                {selected.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-navy-400" />
                    <a href={`tel:${selected.phone}`} className="text-accent-400 hover:underline">{selected.phone}</a>
                  </div>
                )}
              </div>

              {selected.company && (
                <p className="text-sm text-navy-300"><span className="text-navy-400">Company: </span>{selected.company}</p>
              )}

              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs rounded-full capitalize ${PRIORITY_COLORS[selected.priority] || ''}`}>
                  Priority: {selected.priority}
                </span>
                <span className="px-2 py-1 text-xs rounded-full capitalize text-navy-400 bg-navy-700">
                  {new Date(selected.created_at).toLocaleString()}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-navy-400" /><span className="text-navy-400 text-sm">Description</span></div>
                <p className="text-white text-sm whitespace-pre-wrap bg-navy-900 p-4 rounded-xl">{selected.description}</p>
              </div>

              {/* Estimate price input */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 uppercase tracking-wide">Estimated Price (₹)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="Enter quote amount"
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 text-sm" />
              </div>

              {/* Internal notes */}
              <div>
                <label className="block text-xs text-navy-400 mb-1.5 uppercase tracking-wide">Internal Notes</label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Add internal notes…"
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 resize-none text-sm" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={saveNotes} disabled={saving}
                  className="py-2.5 bg-navy-700 hover:bg-navy-600 text-white font-medium rounded-xl transition-colors text-sm disabled:opacity-50">
                  {saving ? 'Saving…' : 'Save Notes'}
                </button>
                <a href={`mailto:${selected.email}?subject=Re: Your Prototype Request — Infinyt3D`}
                  className="py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors text-center text-sm">
                  Reply via Email
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
