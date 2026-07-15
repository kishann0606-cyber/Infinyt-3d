import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, X, Mail, Phone, FileText, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface Application {
  id: string; name: string; email: string; phone: string; position: string;
  message: string; resume_url: string | null; status: string; created_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-500/20 text-blue-400',
  reviewed: 'bg-yellow-500/20 text-yellow-400',
  shortlisted: 'bg-green-500/20 text-green-400',
  rejected: 'bg-red-500/20 text-red-400',
};

export function AdminCareersPage() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<Application | null>(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const { data } = await supabase.from('career_applications').select('*').order('created_at', { ascending: false });
    setApps(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from('career_applications').update({ status }).eq('id', id);
    fetchData();
  };

  const filtered = apps.filter(a => {
    const m = a.name.toLowerCase().includes(search.toLowerCase()) || a.email.toLowerCase().includes(search.toLowerCase()) || a.position.toLowerCase().includes(search.toLowerCase());
    const s = filter === 'all' || a.status === filter;
    return m && s;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Career Applications</h1>
        <p className="text-navy-400 text-sm">Review and manage job applications</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search applications…"
            className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} className="px-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white">
          {['all','new','reviewed','shortlisted','rejected'].map(s => <option key={s} value={s}>{s === 'all' ? 'All Status' : s}</option>)}
        </select>
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-navy-400">No applications found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-navy-700">
                <tr>{['Applicant','Position','Date','Status',''].map(h => <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filtered.map(a => (
                  <motion.tr key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-navy-700/40 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-white font-medium text-sm">{a.name}</p>
                      <p className="text-navy-400 text-xs">{a.email}</p>
                    </td>
                    <td className="px-5 py-4 text-navy-300 text-sm">{a.position}</td>
                    <td className="px-5 py-4 text-navy-400 text-sm">{new Date(a.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <select value={a.status} onChange={e => updateStatus(a.id, e.target.value)}
                        className={`px-2 py-1 text-xs rounded-full border-0 cursor-pointer ${STATUS_COLORS[a.status] || 'bg-navy-600 text-navy-300'}`}>
                        <option value="new">New</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => setSelected(a)} className="p-2 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
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
            className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-lg">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="text-lg font-bold text-white">Application — {selected.name}</h2>
              <button onClick={() => setSelected(null)}><X className="w-5 h-5 text-navy-400" /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2"><Mail className="w-4 h-4 text-navy-400" />
                  <a href={`mailto:${selected.email}`} className="text-accent-400 hover:underline truncate">{selected.email}</a></div>
                <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-navy-400" />
                  <a href={`tel:${selected.phone}`} className="text-accent-400 hover:underline">{selected.phone}</a></div>
              </div>
              <p className="text-sm text-navy-300"><span className="text-navy-400">Position: </span>{selected.position}</p>
              <p className="text-xs text-navy-500">Applied: {new Date(selected.created_at).toLocaleString()}</p>
              {selected.resume_url && (
                <a href={selected.resume_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-accent-400 hover:text-accent-300 text-sm">
                  <Download className="w-4 h-4" /> Download Resume
                </a>
              )}
              {selected.message && (
                <div>
                  <div className="flex items-center gap-2 mb-2"><FileText className="w-4 h-4 text-navy-400" /><span className="text-navy-400 text-sm">Cover Letter</span></div>
                  <p className="text-white text-sm whitespace-pre-wrap bg-navy-900 p-4 rounded-xl">{selected.message}</p>
                </div>
              )}
              <a href={`mailto:${selected.email}?subject=Re: Your Application for ${selected.position} at Infinyt3D`}
                className="block w-full py-2.5 bg-accent-500 hover:bg-accent-600 text-white font-medium rounded-xl transition-colors text-center text-sm">
                Contact via Email
              </a>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
