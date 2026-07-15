import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Trash2, Copy, Check, Search, FolderOpen, Loader2, X, ExternalLink, Image } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  metadata: { size: number; mimetype: string } | null;
  publicUrl: string;
}

const BUCKETS = ['product-images', 'site-media'] as const;
type Bucket = typeof BUCKETS[number];

export function AdminMediaPage() {
  const [bucket, setBucket] = useState<Bucket>('product-images');
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [preview, setPreview] = useState<MediaFile | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.storage.from(bucket).list('', { limit: 200, sortBy: { column: 'updated_at', order: 'desc' } });
    if (error || !data) { setFiles([]); setLoading(false); return; }
    const withUrls: MediaFile[] = data.filter(f => f.id).map(f => {
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(f.name);
      return { name: f.name, id: f.id!, updated_at: f.updated_at || '', metadata: f.metadata as MediaFile['metadata'], publicUrl };
    });
    setFiles(withUrls);
    setLoading(false);
  }, [bucket]);

  useEffect(() => { fetchFiles(); }, [fetchFiles]);

  const uploadFiles = useCallback(async (fileList: FileList | File[]) => {
    const arr = Array.from(fileList).filter(f => f.type.startsWith('image/'));
    if (!arr.length) return;
    setUploading(true);
    for (let i = 0; i < arr.length; i++) {
      setUploadProgress(Math.round(((i) / arr.length) * 90));
      const file = arr[i];
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
      await supabase.storage.from(bucket).upload(path, file, { contentType: file.type, upsert: false });
    }
    setUploadProgress(100);
    await fetchFiles();
    setUploading(false);
    setUploadProgress(0);
  }, [bucket, fetchFiles]);

  const deleteFile = async (name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await supabase.storage.from(bucket).remove([name]);
    setFiles(f => f.filter(x => x.name !== name));
    if (preview?.name === name) setPreview(null);
  };

  const copyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.publicUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
  const totalSize = files.reduce((acc, f) => acc + (f.metadata?.size || 0), 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Media Library</h1>
        <p className="text-navy-400 text-sm">{files.length} files · {(totalSize / 1024 / 1024).toFixed(1)} MB used</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-2">
          {BUCKETS.map(b => (
            <button key={b} onClick={() => setBucket(b)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${bucket === b ? 'bg-accent-500 text-white' : 'bg-navy-800 text-navy-400 hover:text-white border border-navy-700'}`}>
              <FolderOpen className="w-4 h-4" />
              {b === 'product-images' ? 'Products' : 'Site Media'}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-navy-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files…"
            className="w-full pl-11 pr-4 py-2.5 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500/30" />
        </div>
        <button onClick={() => fileInputRef.current?.click()} disabled={uploading}
          className="flex items-center gap-2 px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex-shrink-0">
          {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Uploading…</> : <><Upload className="w-4 h-4" />Upload Images</>}
        </button>
        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={e => uploadFiles(e.target.files!)} />
      </div>

      {/* Upload progress */}
      {uploading && (
        <div className="bg-navy-800 border border-navy-700 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2 text-sm">
            <span className="text-white">Uploading…</span>
            <span className="text-navy-400">{uploadProgress}%</span>
          </div>
          <div className="w-full bg-navy-700 rounded-full h-1.5">
            <div className="bg-accent-500 h-1.5 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
          </div>
        </div>
      )}

      {/* Drop zone */}
      <div
        onDrop={e => { e.preventDefault(); setDragging(false); uploadFiles(e.dataTransfer.files); }}
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        className={`border-2 border-dashed rounded-xl py-5 text-center transition-all ${dragging ? 'border-accent-500 bg-accent-500/10' : 'border-navy-700 hover:border-navy-600'}`}>
        <Upload className="w-6 h-6 text-navy-500 mx-auto mb-1" />
        <p className="text-navy-500 text-sm">Drag & drop images here to upload</p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 text-accent-500 animate-spin" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-navy-400">
          <Image className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>{search ? 'No files match your search.' : 'No files yet — upload some images above.'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
          {filtered.map(file => (
            <motion.div key={file.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="group relative bg-navy-800 rounded-xl border border-navy-700 overflow-hidden aspect-square cursor-pointer hover:border-accent-500/50 transition-all"
              onClick={() => setPreview(file)}>
              <img src={file.publicUrl} alt={file.name} loading="lazy" className="w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.opacity = '0.3'; }} />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-end justify-between p-2 opacity-0 group-hover:opacity-100">
                <button onClick={e => { e.stopPropagation(); copyUrl(file); }}
                  className="p-1.5 bg-white/10 backdrop-blur rounded-lg text-white hover:bg-white/20 transition-colors">
                  {copiedId === file.id ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
                <button onClick={e => { e.stopPropagation(); deleteFile(file.name); }}
                  className="p-1.5 bg-red-500/20 backdrop-blur rounded-lg text-red-400 hover:bg-red-500/40 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Preview modal */}
      <AnimatePresence>
        {preview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setPreview(null)}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="bg-navy-800 rounded-2xl border border-navy-700 max-w-lg w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between p-4 border-b border-navy-700">
                <p className="text-white text-sm font-medium truncate max-w-xs">{preview.name}</p>
                <button onClick={() => setPreview(null)} className="text-navy-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-4">
                <img src={preview.publicUrl} alt={preview.name} className="w-full rounded-xl object-contain max-h-64" />
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-navy-400">Size</span><span className="text-white">{preview.metadata?.size ? (preview.metadata.size / 1024).toFixed(0) + ' KB' : '—'}</span></div>
                  <div className="flex justify-between"><span className="text-navy-400">Type</span><span className="text-white">{preview.metadata?.mimetype || '—'}</span></div>
                  <div className="flex justify-between"><span className="text-navy-400">Bucket</span><span className="text-white">{bucket}</span></div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => copyUrl(preview)}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-navy-700 hover:bg-navy-600 text-white rounded-xl text-sm transition-colors">
                    {copiedId === preview.id ? <><Check className="w-4 h-4 text-green-400" />Copied!</> : <><Copy className="w-4 h-4" />Copy URL</>}
                  </button>
                  <a href={preview.publicUrl} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 bg-navy-700 hover:bg-navy-600 text-white rounded-xl text-sm transition-colors">
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button onClick={() => deleteFile(preview.name)}
                    className="px-4 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
