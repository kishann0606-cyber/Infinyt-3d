import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { fetchProducts } from '../lib/queries'
import type { Product } from '../lib/supabase'
import BrandLogo from '../components/BrandLogo'

export default function Products() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [brandFilter, setBrandFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch((e) => { console.error(e); setError('Failed to load products. Please try again.') })
      .finally(() => setLoading(false))
  }, [])

  const brands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort()
  }, [products])

  const types = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.product_type))).sort()
  }, [products])

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase()) ||
        (p.short_description || '').toLowerCase().includes(search.toLowerCase())
      const matchesBrand = brandFilter === 'all' || p.brand === brandFilter
      const matchesType = typeFilter === 'all' || p.product_type === typeFilter
      return matchesSearch && matchesBrand && matchesType
    })
  }, [products, search, brandFilter, typeFilter])

  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-slate-50 to-primary-50/30 py-12">
        <div className="container-x">
          <h1 className="font-display text-4xl font-extrabold text-slate-900 mb-2">Our Products</h1>
          <p className="text-slate-600 max-w-2xl">
            Explore our range of 3D printers, filaments, resins, and accessories from leading brands.
          </p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-x">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1">
              <div className="relative">
                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="input-field pl-12"
                />
              </div>
            </div>
            <div className="flex gap-3">
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="input-field cursor-pointer min-w-[140px]"
              >
                <option value="all">All Brands</option>
                {brands.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="input-field cursor-pointer min-w-[140px]"
              >
                <option value="all">All Types</option>
                {types.map((t) => (
                  <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}s</option>
                ))}
              </select>
            </div>
          </div>

          {/* Results */}
          {error && (
            <div className="text-center py-20">
              <p className="text-error-600 font-semibold mb-2">{error}</p>
              <button onClick={() => window.location.reload()} className="btn-primary mt-4">Retry</button>
            </div>
          )}

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="bg-slate-200 rounded-xl h-52 mb-4" />
                  <div className="bg-slate-200 h-4 rounded mb-2" />
                  <div className="bg-slate-200 h-3 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
              <p className="text-slate-500 font-semibold">No products found</p>
              <p className="text-slate-400 text-sm mt-1">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">{filtered.length} product{filtered.length !== 1 ? 's' : ''} found</p>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((product) => (
                  <Link
                    key={product.id}
                    to={`/products/${product.slug}`}
                    className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 group"
                  >
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      {product.image && (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}
                      {product.featured && (
                        <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          Featured
                        </span>
                      )}
                      {!product.in_stock && (
                        <span className="absolute top-3 right-3 bg-slate-800 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                          Out of Stock
                        </span>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-primary-600 font-semibold">{product.brand}</p>
                        {product.technology && (
                          <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">{product.technology}</span>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-sm text-slate-500 line-clamp-2">{product.short_description}</p>
                      <div className="mt-4 flex items-center gap-2 text-primary-600 text-sm font-semibold">
                        View Details
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Brand showcase */}
          {!loading && products.length > 0 && (
            <div className="mt-16 pt-10 border-t border-slate-100">
              <h3 className="font-display text-xl font-bold text-slate-900 text-center mb-6">Shop by Brand</h3>
              <div className="flex flex-wrap items-center justify-center gap-4">
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => setBrandFilter(brand)}
                    className="transition-transform hover:scale-105"
                  >
                    <BrandLogo brand={brand} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
