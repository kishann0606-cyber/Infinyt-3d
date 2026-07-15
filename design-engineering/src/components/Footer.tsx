import { Link } from 'react-router-dom'

const partnerBrands = [
  'Bambu Lab',
  'Creality',
  'Elegoo',
  'Anycubic',
  'Phrozen',
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="container-x py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo.svg" alt="Infinyt 3D" className="w-12 h-12" />
              <div>
                <span className="font-display font-extrabold text-xl text-white">Infinyt 3D</span>
                <span className="block text-[10px] text-slate-400 tracking-wide uppercase">Pvt. Ltd.</span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Professional 3D printing, design, and manufacturing solutions. Your trusted partner in additive manufacturing.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/products" className="hover:text-primary-400 transition-colors">Products</Link></li>
              <li><Link to="/services" className="hover:text-primary-400 transition-colors">Services</Link></li>
              <li><Link to="/about" className="hover:text-primary-400 transition-colors">About</Link></li>
              <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Our Partners</h4>
            <ul className="space-y-2 text-sm">
              {partnerBrands.map((brand) => (
                <li key={brand} className="flex items-center gap-2">
                  <BrandMiniLogo brand={brand} />
                  <span className="text-slate-400">{brand}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span>info@infinyt3d.com</span>
              </li>
              <li className="flex items-start gap-2">
                <svg className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <span>+91 99999 99999</span>
              </li>
            </ul>
            <Link to="/admin/login" className="inline-block mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Admin Login
            </Link>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500">
            (c) {new Date().getFullYear()} Infinyt 3D Pvt. Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 text-warning-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
              <span>4.8 Google Rating</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}

function BrandMiniLogo({ brand }: { brand: string }) {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-white/10 text-[8px] font-bold text-white shrink-0">
      {brand.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
    </span>
  )
}
