import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Lock, Mail, Shield, CheckCircle, AlertCircle, Eye, EyeOff,
  User, Key, Bell, Globe, Plus, Trash2, Save, Loader2, Send
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth';

interface EmailSettings {
  id: string;
  recipients: string[];
  cc: string[];
  bcc: string[];
  reply_to: string | null;
  sender_name: string;
  subject_prefix: string;
  resend_api_key: string | null;
}

export function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'email' | 'system'>('profile');

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [passLoading, setPassLoading] = useState(false);
  const [passMsg, setPassMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [emailSettings, setEmailSettings] = useState<EmailSettings | null>(null);
  const [emailLoading, setEmailLoading] = useState(true);
  const [emailSaving, setEmailSaving] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [newRecipient, setNewRecipient] = useState('');
  const [newCc, setNewCc] = useState('');
  const [testEmailSending, setTestEmailSending] = useState(false);

  // email_logs uses: id, to_email, subject, status, error_message, created_at
  const [emailLogs, setEmailLogs] = useState<{ id: string; to_email: string; subject: string | null; status: string; created_at: string; error_message: string | null }[]>([]);

  useEffect(() => {
    if (activeTab === 'email') fetchEmailSettings();
  }, [activeTab]);

  const fetchEmailSettings = async () => {
    setEmailLoading(true);
    const [{ data: settings }, { data: logs }] = await Promise.all([
      supabase.from('email_settings').select('*').limit(1).maybeSingle(),
      supabase.from('email_logs').select('id, to_email, subject, status, created_at, error_message').order('created_at', { ascending: false }).limit(20),
    ]);
    if (settings) setEmailSettings(settings);
    setEmailLogs(logs || []);
    setEmailLoading(false);
  };

  const saveEmailSettings = async () => {
    if (!emailSettings) return;
    setEmailSaving(true);
    setEmailMsg(null);
    const { error } = await supabase.from('email_settings').update({
      recipients: emailSettings.recipients,
      cc: emailSettings.cc,
      bcc: emailSettings.bcc,
      reply_to: emailSettings.reply_to || null,
      sender_name: emailSettings.sender_name,
      subject_prefix: emailSettings.subject_prefix,
      resend_api_key: emailSettings.resend_api_key || null,
      updated_at: new Date().toISOString(),
    }).eq('id', emailSettings.id);
    setEmailMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Email settings saved.' });
    setEmailSaving(false);
  };

  const sendTestEmail = async () => {
    if (!emailSettings?.recipients?.length) return;
    setTestEmailSending(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-enquiry-email`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
          body: JSON.stringify({ enquiryType: 'Test', name: 'Admin Test', email: user?.email || 'test@example.com', message: 'This is a test email from the Infinyt 3D Pvt. Ltd. Admin Panel.' }),
        }
      );
      const d = await res.json();
      setEmailMsg(res.ok ? { type: 'success', text: 'Test email sent!' } : { type: 'error', text: d.error || 'Send failed.' });
    } catch { setEmailMsg({ type: 'error', text: 'Network error.' }); }
    setTestEmailSending(false);
    fetchEmailSettings();
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassMsg(null);
    if (newPass !== confirmPass) { setPassMsg({ type: 'error', text: 'Passwords do not match.' }); return; }
    if (newPass.length < 8) { setPassMsg({ type: 'error', text: 'Min 8 characters.' }); return; }
    setPassLoading(true);
    const { error } = await supabase.auth.updateUser({ password: newPass });
    setPassMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Password updated.' });
    if (!error) { setNewPass(''); setConfirmPass(''); }
    setPassLoading(false);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Key },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'system', label: 'Site Info', icon: Globe },
  ] as const;

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-navy-400 text-sm">Manage your account and notification preferences</p>
      </div>

      <div className="flex gap-1 border-b border-navy-700 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab === tab.id ? 'border-accent-500 text-accent-400' : 'border-transparent text-navy-400 hover:text-white'}`}>
            <tab.icon className="w-4 h-4" />{tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Shield className="w-5 h-5 text-accent-500" />Account</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-14 h-14 bg-accent-500 rounded-full flex items-center justify-center text-white text-xl font-bold">{user?.email?.[0]?.toUpperCase() || 'A'}</div>
              <div>
                <p className="text-white font-medium">{user?.email}</p>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-accent-500/20 text-accent-400 text-xs rounded-full mt-1"><Shield className="w-3 h-3" /> Administrator</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { label: 'User ID', value: user?.id?.slice(0, 18) + '…', mono: true },
                { label: 'Last Sign In', value: user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '—' },
                { label: 'Account Created', value: user?.created_at ? new Date(user.created_at).toLocaleDateString() : '—' },
                { label: 'Email Status', value: 'Verified ✓' },
              ].map(item => (
                <div key={item.label} className="bg-navy-900 rounded-xl p-4">
                  <p className="text-xs text-navy-500 mb-1">{item.label}</p>
                  <p className={`text-white text-sm ${item.mono ? 'font-mono' : ''}`}>{item.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Bell className="w-5 h-5 text-accent-500" />Notifications</h2>
            {[
              { label: 'New contact form submission', desc: 'Email notification when someone fills the contact form', checked: true },
              { label: 'New career application', desc: 'When a job application is received', checked: true },
              { label: 'New prototype request', desc: 'When a custom printing request arrives', checked: false },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-3 border-b border-navy-700 last:border-0">
                <div><p className="text-white text-sm font-medium">{item.label}</p><p className="text-navy-500 text-xs">{item.desc}</p></div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                  <div className="w-10 h-5 bg-navy-700 peer-checked:bg-accent-500 rounded-full transition-colors after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
                </label>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {activeTab === 'security' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-5 flex items-center gap-2"><Lock className="w-5 h-5 text-accent-500" />Change Password</h2>
            {passMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`mb-4 p-4 rounded-xl flex items-center gap-3 ${passMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-red-500/10 border border-red-500/30 text-red-400'}`}>
                {passMsg.type === 'success' ? <CheckCircle className="w-5 h-5 flex-shrink-0" /> : <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                <p className="text-sm">{passMsg.text}</p>
              </motion.div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {[{ label: 'New Password', val: newPass, set: setNewPass, ph: 'Min 8 characters' }, { label: 'Confirm Password', val: confirmPass, set: setConfirmPass, ph: 'Re-enter password' }].map(f => (
                <div key={f.label}>
                  <label className="block text-sm font-medium text-navy-300 mb-1.5">{f.label}</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-500" />
                    <input type={showPass ? 'text' : 'password'} value={f.val} onChange={e => f.set(e.target.value)} required
                      className="w-full pl-12 pr-12 py-3 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
                      placeholder={f.ph} />
                    {f.label === 'New Password' && (
                      <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-navy-500">
                        {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="submit" disabled={passLoading}
                className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {passLoading ? <><Loader2 className="w-5 h-5 animate-spin" />Updating…</> : 'Update Password'}
              </button>
            </form>
          </div>
        </motion.div>
      )}

      {activeTab === 'email' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          {emailLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-accent-500 animate-spin" /></div>
          ) : emailSettings ? (
            <>
              <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-semibold text-white flex items-center gap-2"><Mail className="w-5 h-5 text-accent-500" />Notification Recipients</h2>
                  <button onClick={sendTestEmail} disabled={testEmailSending}
                    className="flex items-center gap-2 px-3 py-2 text-xs bg-navy-700 hover:bg-navy-600 text-navy-300 hover:text-white rounded-lg transition-colors disabled:opacity-50">
                    {testEmailSending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    Send Test
                  </button>
                </div>

                {emailMsg && (
                  <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm ${emailMsg.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {emailMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {emailMsg.text}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-2">To (Recipients)</label>
                    <div className="space-y-2">
                      {(emailSettings.recipients || []).map((r, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <input value={r} onChange={e => { const arr = [...emailSettings.recipients]; arr[i] = e.target.value; setEmailSettings({ ...emailSettings, recipients: arr }); }}
                            className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
                          <button onClick={() => setEmailSettings({ ...emailSettings, recipients: emailSettings.recipients.filter((_, j) => j !== i) })} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                      <div className="flex gap-2">
                        <input value={newRecipient} onChange={e => setNewRecipient(e.target.value)} placeholder="Add email address…"
                          className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 placeholder:text-navy-500"
                          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newRecipient) { setEmailSettings({ ...emailSettings, recipients: [...(emailSettings.recipients || []), newRecipient] }); setNewRecipient(''); } } }} />
                        <button onClick={() => { if (newRecipient) { setEmailSettings({ ...emailSettings, recipients: [...(emailSettings.recipients || []), newRecipient] }); setNewRecipient(''); } }}
                          className="p-2 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-2">CC</label>
                    <div className="flex gap-2">
                      <input value={newCc} onChange={e => setNewCc(e.target.value)} placeholder="CC email addresses…"
                        className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30 placeholder:text-navy-500"
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (newCc) { setEmailSettings({ ...emailSettings, cc: [...(emailSettings.cc || []), newCc] }); setNewCc(''); } } }} />
                      <button onClick={() => { if (newCc) { setEmailSettings({ ...emailSettings, cc: [...(emailSettings.cc || []), newCc] }); setNewCc(''); } }}
                        className="p-2 bg-navy-700 text-white rounded-xl hover:bg-navy-600 transition-colors">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    {(emailSettings.cc || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {(emailSettings.cc || []).map((c, i) => (
                          <span key={i} className="flex items-center gap-1 px-2.5 py-1 bg-navy-700 text-navy-300 text-xs rounded-full">
                            {c}
                            <button onClick={() => setEmailSettings({ ...emailSettings, cc: (emailSettings.cc || []).filter((_, j) => j !== i) })} className="text-navy-500 hover:text-red-400 ml-0.5">×</button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1.5">Sender Name</label>
                      <input value={emailSettings.sender_name || ''} onChange={e => setEmailSettings({ ...emailSettings, sender_name: e.target.value })}
                        className="w-full px-3 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-navy-300 mb-1.5">Subject Prefix</label>
                      <input value={emailSettings.subject_prefix || ''} onChange={e => setEmailSettings({ ...emailSettings, subject_prefix: e.target.value })}
                        className="w-full px-3 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy-300 mb-1.5">Resend API Key</label>
                    <input type="password" value={emailSettings.resend_api_key || ''} onChange={e => setEmailSettings({ ...emailSettings, resend_api_key: e.target.value })}
                      placeholder="re_xxxxxxxxxxxx (get one at resend.com)"
                      className="w-full px-3 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-accent-500/30 placeholder:text-navy-500 placeholder:font-sans" />
                    <p className="text-xs text-navy-500 mt-1.5">Get a free API key at resend.com — free tier: 3,000 emails/month.</p>
                  </div>

                  <button onClick={saveEmailSettings} disabled={emailSaving}
                    className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                    {emailSaving ? <><Loader2 className="w-5 h-5 animate-spin" />Saving…</> : <><Save className="w-5 h-5" />Save Email Settings</>}
                  </button>
                </div>
              </div>

              <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
                <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Mail className="w-5 h-5 text-accent-500" />Recent Email Logs</h2>
                {emailLogs.length === 0 ? (
                  <p className="text-navy-400 text-sm">No email logs yet.</p>
                ) : (
                  <div className="space-y-2">
                    {emailLogs.map(log => (
                      <div key={log.id} className="flex items-center gap-3 p-3 bg-navy-900 rounded-xl text-sm">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${log.status === 'sent' ? 'bg-green-400' : 'bg-red-400'}`} />
                        <span className="text-navy-300 flex-1 truncate">{log.subject || log.to_email}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${log.status === 'sent' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{log.status}</span>
                        {log.error_message && <span className="text-red-400 text-xs truncate max-w-xs">{log.error_message}</span>}
                        <span className="text-navy-500 text-xs">{new Date(log.created_at).toLocaleDateString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <p className="text-navy-400">No email settings found.</p>
          )}
        </motion.div>
      )}

      {activeTab === 'system' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
            <h2 className="font-semibold text-white mb-4 flex items-center gap-2"><Globe className="w-5 h-5 text-accent-500" />Site Information</h2>
            <div className="space-y-3">
              {[
                { label: 'Company', value: 'Infinyt 3D Pvt. Ltd.' },
                { label: 'Supabase Project', value: import.meta.env.VITE_SUPABASE_URL?.replace('https://', '').split('.')[0] || '—' },
                { label: 'Environment', value: import.meta.env.MODE },
                { label: 'Version', value: '2.0.0' },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between py-3 border-b border-navy-700 last:border-0">
                  <p className="text-navy-400 text-sm">{item.label}</p>
                  <p className="text-white text-sm font-mono">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
