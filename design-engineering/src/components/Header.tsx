import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Products', path: '/products' },
    { label: 'Services', path: '/services' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ]

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/'
    return location.pathname.startsWith(path)
  }

  const handleNav = (path: string) => {
    setMobileOpen(false)
    navigate(path)
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-md py-2'
          : 'bg-white/90 backdrop-blur-sm py-3'
      }`}
    >
      <div className="container-x flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img
            src="/logo.svg"
            alt="Infinyt 3D"
            className="w-12 h-12 transition-transform group-hover:scale-105"
          />
          <div className="flex flex-col leading-tight">
            <span className="font-display font-extrabold text-2xl text-black tracking-tight">
              Infinyt 3D
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide uppercase">
              Pvt. Ltd.
            </span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive(link.path)
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Link to="/contact" className="btn-primary text-sm py-2.5 px-5">
            Get a Quote
          </Link>
        </div>

        <button
          className="lg:hidden p-2 rounded-lg hover:bg-slate-100"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="lg:hidden bg-white border-t border-slate-100 animate-slide-up">
          <div className="container-x py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNav(link.path)}
                className={`px-4 py-3 rounded-lg text-left text-sm font-semibold transition-all ${
                  isActive(link.path)
                    ? 'text-primary-600 bg-primary-50'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('/contact')}
              className="btn-primary text-sm py-3 mt-2"
            >
              Get a Quote
            </button>
          </div>
        </nav>
      )}
    </header>
  )
}
