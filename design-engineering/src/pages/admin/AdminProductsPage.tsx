import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, X, Save, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { ImageUpload } from '../../components/ui/ImageUpload';

interface Category { id: string; name: string; slug: string; }
interface Product {
  id: string; name: string; brand: string; category: string;
  price: number | string; image_url: string; in_stock: boolean; featured: boolean; created_at: string;
}

const defaultForm = { name: '', brand: '', category: '', price: '', image_url: '' as string | null, description: '', in_stock: true, featured: false };

export function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(defaultForm);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    const [prodRes, catRes] = await Promise.all([
      supabase.from('products').select('*').order('created_at', { ascending: false }),
      supabase.from('product_categories').select('id, name, slug').order('name'),
    ]);
    setProducts(prodRes.data || []);
    setCategories(catRes.data || []);
    setLoading(false);
  };

  const getCategoryName = (name: string) => name || 'Uncategorized';

  const openModal = (product?: Product) => {
    if (product) {
      setEditing(product);
      setForm({ name: product.name, brand: product.brand, category: product.category || '', price: product.price?.toString() || '', image_url: product.image_url || null, description: '', in_stock: product.in_stock, featured: product.featured });
    } else {
      setEditing(null);
      setForm(defaultForm);
    }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setEditing(null); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.brand) return;
    setSaving(true);
    const payload = {
      name: form.name,
      brand: form.brand,
      category: form.category || null,
      price: parseFloat(form.price) || 0,
      image_url: form.image_url || null,
      in_stock: form.in_stock,
      featured: form.featured,
      slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    };
    const { error } = editing
      ? await supabase.from('products').update(payload).eq('id', editing.id)
      : await supabase.from('products').insert(payload);
    if (error) alert('Error: ' + error.message);
    else { fetchData(); closeModal(); }
    setSaving(false);
  };

  const handleDelete = async (id: string, imageUrl: string | null) => {
    if (!confirm('Delete this product?')) return;
    // Delete image from storage if it's a Supabase Storage URL
    if (imageUrl?.includes('supabase')) {
      try {
        const url = new URL(imageUrl);
        const path = url.pathname.split('/object/public/product-images/')?.[1];
        if (path) await supabase.storage.from('product-images').remove([path]);
      } catch { /* ignore */ }
    }
    await supabase.from('products').delete().eq('id', id);
    fetchData();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-navy-400 text-sm">Manage your product catalog ({products.length} total)</p>
        </div>
        <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-xl transition-colors font-medium">
          <Plus className="w-5 h-5" /> Add Product
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
          className="w-full pl-12 pr-4 py-3 bg-navy-800 border border-navy-700 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
      </div>

      <div className="bg-navy-800 rounded-xl border border-navy-700 overflow-hidden">
        {loading ? (
          <div className="p-8 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-500" /></div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-navy-400">No products found. <button onClick={() => openModal()} className="text-accent-400 hover:underline">Add one?</button></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-navy-750 border-b border-navy-700">
                <tr>{['Product', 'Category', 'Price', 'Status', 'Actions'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-navy-400 uppercase tracking-wider last:text-right">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {filtered.map(p => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="hover:bg-navy-700/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-navy-600 overflow-hidden flex-shrink-0 border border-navy-500">
                          {p.image_url ? (
                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" loading="lazy"
                              onError={e => { (e.target as HTMLImageElement).style.opacity = '0'; }} />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-navy-400 text-xs">No img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{p.name}</p>
                          <p className="text-navy-400 text-xs">{p.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-navy-300 text-sm">{getCategoryName(p.category)}</td>
                    <td className="px-5 py-4 text-white font-medium">{Number(p.price) > 0 ? `₹${Number(p.price).toLocaleString('en-IN')}` : <span className="text-navy-400 text-xs">On Request</span>}</td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1.5 flex-wrap">
                        <span className={`px-2 py-0.5 text-xs rounded-full ${p.in_stock ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {p.in_stock ? 'In Stock' : 'Out of Stock'}
                        </span>
                        {p.featured && <span className="px-2 py-0.5 text-xs rounded-full bg-accent-500/20 text-accent-400">Featured</span>}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openModal(p)} className="p-2 text-navy-400 hover:text-white hover:bg-navy-600 rounded-lg transition-colors"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(p.id, p.image_url)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-navy-800 rounded-2xl border border-navy-700 w-full max-w-lg max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-navy-700">
              <h2 className="text-lg font-bold text-white">{editing ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal}><X className="w-5 h-5 text-navy-400 hover:text-white" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* Image Upload */}
              <ImageUpload
                value={form.image_url}
                onChange={url => setForm(f => ({ ...f, image_url: url }))}
                bucket="product-images"
                label="Product Image"
              />

              {/* Text fields */}
              {[
                { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Bambu Lab P1S' },
                { label: 'Brand *', key: 'brand', type: 'text', placeholder: 'e.g. Bambu Lab' },
                { label: 'Price (₹)', key: 'price', type: 'number', placeholder: '25000' },
              ].map(field => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-navy-300 mb-1.5">{field.label}</label>
                  <input type={field.type} value={(form as Record<string, string | boolean | null>)[field.key] as string} placeholder={field.placeholder}
                    onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                    required={field.label.includes('*')}
                    className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white placeholder:text-navy-500 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-navy-300 mb-1.5">Category</label>
                <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 bg-navy-900 border border-navy-600 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-accent-500/30">
                  <option value="">Select a category</option>
                  {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </select>
              </div>

              <div className="flex items-center gap-6">
                {[
                  { key: 'in_stock', label: 'In Stock' },
                  { key: 'featured', label: 'Featured on Homepage' },
                ].map(f => (
                  <label key={f.key} className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form[f.key as 'in_stock' | 'featured']} onChange={e => setForm({ ...form, [f.key]: e.target.checked })} className="w-4 h-4 rounded accent-accent-500" />
                    <span className="text-navy-300 text-sm">{f.label}</span>
                  </label>
                ))}
              </div>

              <button type="submit" disabled={saving}
                className="w-full py-3 bg-accent-500 hover:bg-accent-600 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-5 h-5 animate-spin" /> Saving…</> : <><Save className="w-5 h-5" /> {editing ? 'Update Product' : 'Save Product'}</>}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
