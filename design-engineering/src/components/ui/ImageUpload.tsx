import { useState, useRef, useCallback } from 'react';
import { Upload, X, Image, Loader2, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket?: string;
  folder?: string;
  label?: string;
  accept?: string;
}

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith('image/')) return file;
  return new Promise(resolve => {
    const img = document.createElement('img');
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width <= MAX_DIMENSION && height <= MAX_DIMENSION && file.size < 500_000) {
        resolve(file);
        return;
      }
      const scale = Math.min(MAX_DIMENSION / width, MAX_DIMENSION / height, 1);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) { resolve(file); return; }
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
      }, 'image/jpeg', JPEG_QUALITY);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

function generateFileName(original: string): string {
  const ext = original.match(/\.[^.]+$/)?.[0] || '.jpg';
  const base = original.replace(/\.[^.]+$/, '').replace(/[^a-z0-9]/gi, '-').toLowerCase().slice(0, 30);
  return `${base}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
}

export function ImageUpload({ value, onChange, bucket = 'product-images', folder = '', label = 'Product Image', accept = 'image/jpeg,image/jpg,image/png,image/webp' }: ImageUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploaded, setUploaded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const uploadFile = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);
    setProgress(10);

    try {
      const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      if (!allowed.includes(file.type)) {
        throw new Error('Only JPG, PNG and WEBP images are supported.');
      }
      if (file.size > 20 * 1024 * 1024) {
        throw new Error('File must be under 20 MB.');
      }

      setProgress(25);
      const compressed = await compressImage(file);
      setProgress(50);

      const path = folder ? `${folder}/${generateFileName(compressed.name)}` : generateFileName(compressed.name);

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(path, compressed, { contentType: compressed.type, upsert: false });

      if (uploadError) throw new Error(uploadError.message);

      setProgress(90);
      const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

      setProgress(100);
      setUploaded(true);
      onChange(publicUrl);
      setTimeout(() => { setUploaded(false); setProgress(0); }, 2000);
    } catch (err) {
      setError((err as Error).message);
      setProgress(0);
    } finally {
      setUploading(false);
    }
  }, [bucket, folder, onChange]);

  const handleFiles = (files: FileList | null) => {
    if (files?.[0]) uploadFile(files[0]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = async () => {
    if (!value) return;
    try {
      const url = new URL(value);
      const pathParts = url.pathname.split(`/object/public/${bucket}/`);
      if (pathParts[1]) {
        await supabase.storage.from(bucket).remove([pathParts[1]]);
      }
    } catch {
      // ignore cleanup errors
    }
    onChange(null);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-navy-300 mb-1.5">{label}</label>

      {value ? (
        <div className="relative group rounded-xl overflow-hidden border border-navy-600 bg-navy-900">
          <img
            src={value}
            alt="Product"
            className="w-full h-48 object-cover"
            loading="lazy"
            onError={e => { (e.target as HTMLImageElement).src = ''; }}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
            <button type="button" onClick={() => inputRef.current?.click()}
              className="p-2.5 bg-white/10 backdrop-blur rounded-xl text-white hover:bg-white/20 transition-colors">
              <Upload className="w-5 h-5" />
            </button>
            <button type="button" onClick={handleRemove}
              className="p-2.5 bg-red-500/20 backdrop-blur rounded-xl text-red-400 hover:bg-red-500/40 transition-colors">
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          {uploaded && (
            <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-green-500/90 text-white text-xs px-2.5 py-1.5 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5" /> Uploaded
            </div>
          )}
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={e => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
            dragging ? 'border-accent-500 bg-accent-500/10' : 'border-navy-600 hover:border-accent-500/60 bg-navy-900'
          } ${uploading ? 'pointer-events-none' : ''}`}
        >
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="w-10 h-10 text-accent-500 mx-auto animate-spin" />
              <p className="text-sm text-navy-300">Uploading…</p>
              <div className="w-full bg-navy-700 rounded-full h-1.5 max-w-xs mx-auto">
                <div className="bg-accent-500 h-1.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
              </div>
            </div>
          ) : (
            <>
              <Image className="w-10 h-10 text-navy-500 mx-auto mb-3" />
              <p className="text-sm font-medium text-navy-300">Drag & drop an image here</p>
              <p className="text-xs text-navy-500 mt-1">or click to browse</p>
              <p className="text-xs text-navy-600 mt-2">JPG, PNG, WEBP — max 20 MB</p>
            </>
          )}
        </div>
      )}

      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
      />
    </div>
  );
}
