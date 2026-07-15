import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getProductBySlug, getProducts, type Product } from '../lib/supabase'

const BRAND_LOGOS: Record<string, string> = {
  'Creality': '/images/products/infinyt_3dlodo.jpg',
  'Bambu Lab': '/images/products/infinyt3d_lsoso.jpg',
  'Elegoo': '/images/products/infinyt_3dlodo.jpg',
  'Anycubic': '/images/products/infinyt3d_lsoso.jpg',
}

function BrandLogo({ brand }: { brand: string }) {
  const logo = BRAND_LOGOS[brand]
  if (!logo) return <span className="text-lg font-bold text-slate-700">{brand}</span>
  return <img src={logo} alt={brand} className="h-8 object-contain" />
}

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [product, setProduct] = useState<Product | null>(null)
  const [related, setRelated] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setError(null)
    getProductBySlug(slug)
      .then(async (data) => {
        if (!data) { setError('Product not found'); return }
        setProduct(data)
        const all = await getProducts({ category: data.category, limit: 5 })
        setRelated(all.filter(p => p.id !== data.id).slice(0, 4))
      })
      .catch((e) => { console.error(e); setError('Failed to load product') })
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="container-x py-20">
        <div className="grid lg:grid-cols-2 gap-10 animate-pulse">
          <div className="bg-slate-200 rounded-3xl h-96" />
          <div className="space-y-4">
            <div className="bg-slate-200 h-8 rounded w-1/3" />
            <div className="bg-slate-200 h-12 rounded" />
            <div className="bg-slate-200 h-24 rounded" />
            <div className="bg-slate-200 h-40 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container-x py-20 text-center">
        <p className="text-slate-500 font-semibold text-lg mb-2">{error || 'Product not found'}</p>
        <Link to="/products" className="btn-primary mt-4">Back to Products</Link>
      </div>
    )
  }

  const specEntries = Object.entries(product.specifications || {})
  const hasFeatures = product.features && product.features.length > 0
  const hasFaqs = product.faqs && product.faqs.length > 0

  return (
    <div className="animate-fade-in">
      <div className="container-x py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary-600">Products</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Image */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-100 shadow-lg">
            {product.image_url ? (
              <img src={product.image_url} alt={product.name} className="w-full h-[400px] lg:h-[500px] object-cover" />
            ) : (
              <div className="w-full h-[400px] lg:h-[500px] flex items-center justify-center text-slate-400">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            {product.featured && (
              <span className="absolute top-4 left-4 bg-primary-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                Featured
              </span>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="mb-4">
              <BrandLogo brand={product.brand} />
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-extrabold text-slate-900 mb-3">
              {product.name}
            </h1>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              {product.short_description}
            </p>

            {/* Key specs */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {product.technology && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Technology</p>
                  <p className="text-slate-900 font-semibold">{product.technology}</p>
                </div>
              )}
              {product.build_volume && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Build Volume</p>
                  <p className="text-slate-900 font-semibold">{product.build_volume}</p>
                </div>
              )}
              {product.layer_resolution && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Layer Resolution</p>
                  <p className="text-slate-900 font-semibold">{product.layer_resolution}</p>
                </div>
              )}
              {product.warranty && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 font-semibold uppercase mb-1">Warranty</p>
                  <p className="text-slate-900 font-semibold">{product.warranty}</p>
                </div>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-3 mb-6">
              {product.in_stock ? (
                <span className="inline-flex items-center gap-2 text-success-600 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  In Stock
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-slate-500 font-semibold">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Out of Stock
                </span>
              )}
            </div>

            {/* Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {product.badges.map((badge) => (
                  <span key={badge} className="bg-primary-50 text-primary-700 text-sm font-medium px-3 py-1.5 rounded-lg">
                    {badge}
                  </span>
                ))}
              </div>
            )}

            <Link to="/contact" className="btn-primary w-full sm:w-auto">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l2 2m0 0l7.89 7.89a2 2 0 002.22 0L21 8M5 5v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2z" /></svg>
              Request a Quote
            </Link>
          </div>
        </div>

        {/* Description */}
        {product.description && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Overview</h2>
            <p className="text-slate-600 leading-relaxed text-lg">{product.description}</p>
          </div>
        )}

        {/* Features */}
        {hasFeatures && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Key Features</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {product.features.map((feature, i) => (
                <div key={i} className="flex items-start gap-3 bg-slate-50 rounded-xl p-4">
                  <svg className="w-5 h-5 text-success-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full specs table */}
        {specEntries.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">Specifications</h2>
            <div className="card overflow-hidden">
              <table className="w-full">
                <tbody>
                  {specEntries.map(([key, value], i) => (
                    <tr key={key} className={i % 2 === 0 ? 'bg-slate-50/50' : ''}>
                      <td className="px-6 py-3 text-sm font-semibold text-slate-700 w-1/3">{key}</td>
                      <td className="px-6 py-3 text-sm text-slate-600">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQs */}
        {hasFaqs && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-4">FAQs</h2>
            <div className="space-y-3">
              {product.faqs.map((faq, i) => (
                <details key={i} className="card p-5 group">
                  <summary className="font-semibold text-slate-900 cursor-pointer flex items-center justify-between">
                    {faq.question}
                    <svg className="w-5 h-5 text-slate-400 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </summary>
                  <p className="text-slate-600 mt-3 text-sm leading-relaxed">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        )}

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl font-bold text-slate-900 mb-6">Related Products</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((rp) => (
                <Link key={rp.id} to={`/products/${rp.slug}`} className="group block">
                  <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 mb-3">
                    {rp.image_url && (
                      <img src={rp.image_url} alt={rp.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    )}
                  </div>
                  <p className="text-sm font-semibold text-slate-900 group-hover:text-primary-600 transition-colors">{rp.name}</p>
                  <p className="text-xs text-slate-500">{rp.brand}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-4">
          <Link to="/products" className="btn-outline">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Products
          </Link>
        </div>
      </div>
    </div>
  )
}
