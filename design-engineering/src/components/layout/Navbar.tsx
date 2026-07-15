import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Menu, X, Search, Sun, Moon, ChevronDown,
  Printer, Layers, Droplet, Scan, Settings, Zap, PenTool
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../hooks/useAnimations';
import { useScrollPosition } from '../../hooks/useAnimations';

const navigation = [
  {
    name: 'Products',
    href: '/products',
    megaMenu: true,
    items: [
      { name: '3D Printers', href: '/products?category=3D+Printers', icon: Printer, description: 'FDM, CoreXY, and resin printers' },
      { name: 'Filaments', href: '/products?category=Filaments', icon: Layers, description: 'Engineering-grade filaments' },
      { name: 'Resins', href: '/products?category=Resins', icon: Droplet, description: 'Photopolymer resins' },
      { name: '3D Scanners', href: '/products?category=3D+Scanners', icon: Scan, description: '3D scanning solutions' },
      { name: 'Accessories', href: '/products?category=Accessories', icon: Settings, description: 'Essential accessories' },
      { name: 'All Products', href: '/products', icon: Printer, description: 'Browse everything' },
    ],
  },
  {
    name: 'Services',
    href: '/services',
    megaMenu: true,
    items: [
      { name: 'CAD Design', href: '/services/cad-design', icon: PenTool, description: 'Professional 3D modeling' },
      { name: 'Rapid Prototyping', href: '/services/rapid-prototyping', icon: Zap, description: 'Fast prototyping' },
      { name: 'Reverse Engineering', href: '/services/reverse-engineering', icon: Scan, description: 'Convert parts to CAD' },
      { name: 'Product Design', href: '/services/product-design', icon: PenTool, description: 'End-to-end development' },
      { name: '3D Printing', href: '/services/3d-printing-services', icon: Printer, description: 'Production runs' },
      { name: '3D Scanning', href: '/services/3d-scanning-services', icon: Scan, description: 'Precision scanning' },
    ],
  },
  { name: 'Materials', href: '/materials' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { scrollPosition, scrollDirection } = useScrollPosition();
  const location = useLocation();

  const isScrolled = scrollPosition > 50;
  const hideNav = scrollDirection === 'down' && scrollPosition > 300;

  useEffect(() => {
    setIsOpen(false);
    setActiveMenu(null);
  }, [location]);

  return (
    <>
      <motion.header
        initial={{ y: 0 }}
        animate={{ y: hideNav ? -100 : 0 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 dark:bg-navy-900/80 backdrop-blur-xl border-b border-navy-100 dark:border-navy-800 shadow-soft'
            : 'bg-transparent'
        )}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <motion.img
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                src="/images/products/infinyt_3dlodo.jpg"
                alt="Infinyt 3D Pvt. Ltd."
                className="h-11 w-11 rounded-full object-cover shadow-soft"
              />
              <div className="leading-tight">
                <span className="font-display font-bold text-xl text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors">
                  Infinyt <span className="text-accent-500">3D</span>
                </span>
                <p className="text-[10px] text-navy-400 dark:text-navy-500 font-medium tracking-wide">Pvt. Ltd.</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.megaMenu && setActiveMenu(item.name)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <Link
                    to={item.href}
                    className={cn(
                      'px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center gap-1',
                      location.pathname.startsWith(item.href)
                        ? 'text-accent-500'
                        : 'text-navy-600 hover:text-navy-900 dark:text-navy-300 dark:hover:text-white'
                    )}
                  >
                    {item.name}
                    {item.megaMenu && <ChevronDown className="w-4 h-4" />}
                  </Link>

                  <AnimatePresence>
                    {item.megaMenu && activeMenu === item.name && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 pt-4"
                      >
                        <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-soft-xl border border-navy-100 dark:border-navy-700 p-6 min-w-[480px]">
                          <div className="grid grid-cols-2 gap-4">
                            {item.items?.map((subItem) => (
                              <Link
                                key={subItem.name}
                                to={subItem.href}
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-navy-50 dark:hover:bg-navy-700/50 transition-colors group"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500 transition-colors">
                                  <subItem.icon className="w-5 h-5 text-accent-500 group-hover:text-white" />
                                </div>
                                <div>
                                  <div className="font-medium text-navy-900 dark:text-white">{subItem.name}</div>
                                  <div className="text-sm text-navy-500 dark:text-navy-400">{subItem.description}</div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-lg text-navy-600 hover:text-navy-900 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={toggleTheme}
                className="p-2.5 rounded-lg text-navy-600 hover:text-navy-900 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </motion.button>

              <Link to="/contact?quote=true" className="hidden md:inline-flex btn-accent text-sm">
                Get Quote
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2.5 rounded-lg text-navy-600 hover:text-navy-900 hover:bg-navy-100 dark:text-navy-300 dark:hover:text-white dark:hover:bg-navy-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-navy-900/20 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-navy-900 shadow-soft-xl"
            >
              <div className="flex flex-col h-full pt-20 pb-6 px-6 overflow-y-auto">
                <div className="space-y-1">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        className={cn(
                          'block px-4 py-3 text-lg font-medium rounded-xl transition-colors',
                          location.pathname.startsWith(item.href)
                            ? 'bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400'
                            : 'text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800'
                        )}
                      >
                        {item.name}
                      </Link>
                      {item.items && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.items.map((subItem) => (
                            <Link key={subItem.name} to={subItem.href}
                              className="block px-4 py-2 text-sm text-navy-500 dark:text-navy-400 hover:text-navy-900 dark:hover:text-white">
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-6">
                  <Link to="/contact?quote=true" className="btn-accent w-full justify-center">Get a Quote</Link>
                </div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4"
          >
            <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" onClick={() => setSearchOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative w-full max-w-2xl bg-white dark:bg-navy-800 rounded-2xl shadow-soft-xl overflow-hidden"
            >
              <div className="flex items-center gap-4 p-4 border-b border-navy-100 dark:border-navy-700">
                <Search className="w-5 h-5 text-navy-400" />
                <input type="text" placeholder="Search products, services, materials..."
                  className="flex-1 bg-transparent text-navy-900 dark:text-white placeholder-navy-400 focus:outline-none" autoFocus />
                <button onClick={() => setSearchOpen(false)} className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700">
                  <X className="w-5 h-5 text-navy-500" />
                </button>
              </div>
              <div className="p-4 text-center text-navy-500 dark:text-navy-400">
                <p className="text-sm">Type to search…</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
