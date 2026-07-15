import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Save, Loader2, CheckCircle, AlertCircle, Upload, X, Image as ImageIcon, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface SiteSetting {
  id: string;
  key: string;
  value: string | null;
  label: string;
  type: 'text' | 'image' | 'url';
  group: string;
}

const GROUP_LABELS: Record<string, string> = {
  branding: 'Branding & Logo',
  homepage: 'Homepage',
  about: 'About Page',
  workshop: 'Workshop Gallery',
  portfolio: 'Portfolio',
  company: 'Company Info',
  social: 'Social Links',
};

export function AdminSiteSettingsPage() {
  const [settings, setSettings] = useState<SiteSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);
  const [activeGroup, setActiveGroup] = useState('branding');

  const groups = [...new Set(settings.map(s => s.group))].filter(g => GROUP_LABELS[g]);

  const fetchSettings = useCallback(async () => {
    const { data } = await supabase.from('site_settings').select('*').order('group').order('key');
    setSettings(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchSettings(); }, [fetchSettings]);

  const updateValue = (key: string, value: string) => {
    setSettings(prev => prev.map(s => s.key === key ? { ...s, value } : s));
  };

  const saveSetting = async (setting: SiteSetting) => {
    setSaving(setting.key);
    const { error } = await supabase
      .from('site_settings')
      .update({ value: setting.value, updated_at: new Date().toISOString() })
      .eq('key', setting.key);
    setSaving(null);
    if (!error) {
      setSaved(setting.key);
      setTimeout(() => setSaved(null), 2000);
    }
  };

  const handleImageUpload = async (setting: SiteSetting, file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploading(setting.key);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `site/${setting.key}-${Date.now()}.${ext}`;
    const { data, error } = await supabase.storage
      .from('site-media')
      .upload(path, file, { contentType: file.type, upsert: true });
    if (!error && data) {
      const { data: { publicUrl } } = supabase.storage.from('site-media').getPublicUrl(path);
      const updated = { ...setting, value: publicUrl };
      updateValue(setting.key, publicUrl);
      await saveSetting(updated);
    }
    setUploading(null);
  };

  const filtered = settings.filter(s => s.group === activeGroup);

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Site Settings & Images</h1>
        <p className="text-navy-400 text-sm">Change any image or text on the website from here.</p>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2 border-b border-navy-700 pb-3">
        {groups.map(group => (
          <button key={group} onClick={() => setActiveGroup(group)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeGroup === group
                ? 'bg-accent-500 text-white'
                : 'bg-navy-800 text-navy-400 hover:text-white border border-navy-700'
            }`}>
            {GROUP_LABELS[group] || group}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-accent-500 animate-spin" /></div>
      ) : (
        <div className="space-y-4">
          {filtered.map(setting => (
            <motion.div key={setting.key}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="bg-navy-800 rounded-2xl border border-navy-700 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <label className="block text-sm font-medium text-white mb-1">{setting.label}</label>
                  <p className="text-xs text-navy-500 mb-3 font-mono">{setting.key}</p>

                  {setting.type === 'image' ? (
                    <div className="space-y-3">
                      {/* Current image preview */}
                      {setting.value ? (
                        <div className="relative inline-block group">
                          <img src={setting.value} alt={setting.label}
                            className="h-32 w-auto rounded-xl object-cover border border-navy-600" />
                          <button
                            onClick={() => updateValue(setting.key, '')}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="h-32 w-48 rounded-xl border-2 border-dashed border-navy-600 flex flex-col items-center justify-center gap-2 text-navy-500">
                          <ImageIcon className="w-8 h-8" />
                          <span className="text-xs">No image set</span>
                        </div>
                      )}

                      {/* URL input */}
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={setting.value || ''}
                          onChange={e => updateValue(setting.key, e.target.value)}
                          placeholder="Image URL or upload below…"
                          className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                        />
                        <button
                          onClick={() => saveSetting(setting)}
                          disabled={saving === setting.key}
                          className="px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm">
                          {saving === setting.key ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === setting.key ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Upload button */}
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-navy-700 hover:bg-navy-600 text-white rounded-xl text-sm cursor-pointer transition-colors border border-navy-600">
                        {uploading === setting.key ? (
                          <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</>
                        ) : (
                          <><Upload className="w-4 h-4" />Upload New Image</>
                        )}
                        <input type="file" accept="image/*" className="hidden"
                          onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(setting, f); e.target.value = ''; }}
                          disabled={!!uploading} />
                      </label>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <input
                        type={setting.type === 'url' ? 'url' : 'text'}
                        value={setting.value || ''}
                        onChange={e => updateValue(setting.key, e.target.value)}
                        placeholder={setting.type === 'url' ? 'https://…' : 'Enter value…'}
                        className="flex-1 px-3 py-2 bg-navy-900 border border-navy-600 rounded-xl text-white text-sm placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30"
                      />
                      <button
                        onClick={() => saveSetting(setting)}
                        disabled={saving === setting.key}
                        className="px-3 py-2 bg-accent-500 hover:bg-accent-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center gap-1.5 text-sm">
                        {saving === setting.key ? <Loader2 className="w-4 h-4 animate-spin" /> : saved === setting.key ? <CheckCircle className="w-4 h-4 text-green-300" /> : <Save className="w-4 h-4" />}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="text-center py-12 text-navy-400">
              <RefreshCw className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No settings in this group yet.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
