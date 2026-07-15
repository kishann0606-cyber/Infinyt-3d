import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchFeaturedProducts } from '../lib/queries'
import type { Product } from '../lib/supabase'
import GoogleRating from '../components/GoogleRating'
import BrandLogo from '../components/BrandLogo'

const partners = ['Bambu Lab', 'Creality', 'Elegoo', 'Anycubic', 'Phrozen']

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" /></svg>
    ),
    title: '3D Printing',
    description: 'Industrial-grade FDM, SLA, and resin printing with high precision and reliability.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
    ),
    title: 'Product Design',
    description: 'From concept to CAD — professional 3D modeling and design optimization services.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
    ),
    title: 'Rapid Prototyping',
    description: 'Fast turnaround prototyping to validate your designs before full production runs.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
    ),
    title: 'Filaments & Resins',
    description: 'Engineering-grade filaments and high-performance resins for every application.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
    ),
    title: '3D Scanning',
    description: 'Professional 3D scanning for reverse engineering and quality inspection.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
    ),
    title: 'Support & Maintenance',
    description: 'Expert technical support, calibration, and maintenance for all your equipment.',
  },
]

const stats = [
  { value: '500+', label: 'Projects Completed' },
  { value: '50+', label: 'Enterprise Clients' },
  { value: '17+', label: 'Products' },
  { value: '4.8', label: 'Google Rating' },
]

export default function Home() {
  const [featured, setFeatured] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
      .then(setFeatured)
      .catch((e) => console.error('Failed to load featured products:', e))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-primary-50/30">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -right-20 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-accent-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        <div className="container-x relative py-20 lg:py-28">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 bg-primary-50 border border-primary-100 rounded-full px-4 py-2 mb-6">
                <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
                <span className="text-sm font-semibold text-primary-700">Trusted 3D Printing Partner</span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6">
                Bringing Ideas to Life with{' '}
                <span className="bg-gradient-to-r from-primary-600 to-accent-500 bg-clip-text text-transparent">
                  3D Printing
                </span>
              </h1>
              <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-xl">
                Infinyt 3D Pvt. Ltd. delivers professional 3D printing, design, and manufacturing solutions. From rapid prototyping to production-grade parts, we've got you covered.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary">
                  Explore Products
                </Link>
                <Link to="/contact" className="btn-outline">
                  Get a Quote
                </Link>
              </div>
              <div className="mt-8 pt-8 border-t border-slate-100">
                <GoogleRating size="lg" />
              </div>
            </div>

            <div className="relative animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=900"
                  alt="3D Printing"
                  className="w-full h-[400px] lg:h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-5 border border-slate-100 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">ISO Certified</p>
                    <p className="text-xs text-slate-500">Quality Assured</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="container-x">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Authorized Partners</p>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900">
              Trusted by Leading 3D Printing Brands
            </h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {partners.map((brand) => (
              <BrandLogo key={brand} brand={brand} />
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 bg-gradient-to-r from-primary-600 to-accent-600">
        <div className="container-x">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-display text-4xl lg:text-5xl font-extrabold text-white">{stat.value}</p>
                <p className="text-sm text-primary-100 mt-1 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-20 bg-slate-50">
        <div className="container-x">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Our Services</p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
              Complete 3D Printing Solutions
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              From concept to production, we provide end-to-end additive manufacturing services tailored to your needs.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.title}
                className="card p-7 hover:shadow-lg hover:-translate-y-1 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-5 transition-all group-hover:bg-primary-600 group-hover:text-white">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl font-bold text-slate-900 mb-2">{service.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-white">
        <div className="container-x">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-sm font-semibold text-primary-600 uppercase tracking-wider mb-2">Featured</p>
              <h2 className="font-display text-3xl sm:text-4xl font-bold text-slate-900">
                Featured Products
              </h2>
            </div>
            <Link to="/products" className="hidden sm:inline-flex items-center gap-1 text-primary-600 font-semibold hover:gap-2 transition-all">
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-4 animate-pulse">
                  <div className="bg-slate-200 rounded-xl h-48 mb-4" />
                  <div className="bg-slate-200 h-4 rounded mb-2" />
                  <div className="bg-slate-200 h-3 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.slug}`}
                  className="card overflow-hidden hover:shadow-lg hover:-translate-y-1 group"
                >
                  <div className="relative h-48 overflow-hidden bg-slate-100">
                    {product.image && (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    )}
                    {product.featured && (
                      <span className="absolute top-3 left-3 bg-primary-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary-600 font-semibold mb-1">{product.brand}</p>
                    <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-sm text-slate-500 line-clamp-2">{product.short_description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <div className="text-center mt-10 sm:hidden">
            <Link to="/products" className="btn-primary">View All Products</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900">
        <div className="container-x text-center">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-8">
            Get in touch with our team to discuss your 3D printing needs. We offer free consultations and competitive pricing.
          </p>
          <Link to="/contact" className="btn-primary">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  )
}
