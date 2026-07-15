import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../lib/auth';
import {
  LayoutDashboard, Package, ShoppingBag, Mail, Users, LogOut,
  Menu, X, ChevronRight, Settings, ExternalLink, Bell, FileText, Image, Globe
} from 'lucide-react';
import { useState, ElementType } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavItem { name: string; path: string; icon: ElementType; badge?: string }
interface NavGroup { label: string; items: NavItem[] }

const navGroups: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { name: 'Products', path: '/admin/products', icon: Package },
      { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
      { name: 'Media Library', path: '/admin/media', icon: Image },
      { name: 'Site Images & Text', path: '/admin/site-settings', icon: Globe },
    ],
  },
  {
    label: 'CRM',
    items: [
      { name: 'Inquiries', path: '/admin/inquiries', icon: Mail },
      { name: 'Prototype Requests', path: '/admin/prototype-requests', icon: FileText },
      { name: 'Career Applications', path: '/admin/careers', icon: Users },
    ],
  },
  {
    label: 'System',
    items: [
      { name: 'Settings', path: '/admin/settings', icon: Settings },
    ],
  },
];

function SidebarContent({ location, onClose, signOut, userEmail }: {
  location: { pathname: string };
  onClose?: () => void;
  signOut: () => void;
  userEmail?: string;
}) {
  return (
    <>
      {/* Brand */}
      <div className="p-5 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin/dashboard" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-9 h-9 bg-accent-500 rounded-xl flex items-center justify-center flex-shrink-0">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-bold text-white text-sm leading-tight">Infinyt 3D Pvt. Ltd.</p>
            <p className="text-navy-500 text-xs">Admin Portal</p>
          </div>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-navy-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav groups */}
      <nav className="flex-1 p-3 space-y-4 overflow-y-auto">
        {navGroups.map(group => (
          <div key={group.label}>
            <p className="px-3 mb-1.5 text-xs font-semibold text-navy-600 uppercase tracking-wider">{group.label}</p>
            <div className="space-y-0.5">
              {group.items.map(item => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                      isActive
                        ? 'bg-accent-500 text-white shadow-lg shadow-accent-500/25'
                        : 'text-navy-400 hover:bg-white/5 hover:text-white'
                    }`}>
                    <item.icon className="w-4.5 h-4.5 flex-shrink-0" style={{ width: 18, height: 18 }} />
                    <span className="flex-1">{item.name}</span>
                    {item.badge && (
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-accent-500/20 text-accent-400'}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-3">
        <a href="/" target="_blank" rel="noreferrer"
          className="flex items-center gap-2 px-3 py-2 text-navy-400 hover:text-white text-sm rounded-xl hover:bg-white/5 transition-colors">
          <ExternalLink className="w-4 h-4" />
          View Live Site
        </a>
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-accent-500/20 rounded-full flex items-center justify-center text-accent-400 text-sm font-bold flex-shrink-0">
            {userEmail?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-medium truncate">{userEmail}</p>
            <p className="text-navy-500 text-xs">Administrator</p>
          </div>
          <button onClick={signOut} title="Sign out"
            className="text-navy-500 hover:text-red-400 transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
}

export function AdminLayout() {
  const { user, loading, isAdmin, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500" />
      </div>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy-950 text-white">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-navy-400 mb-6">Your account doesn't have admin privileges.</p>
          <button onClick={signOut} className="px-6 py-3 bg-accent-500 hover:bg-accent-600 rounded-xl transition-colors font-medium">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  const currentPage = navGroups.flatMap(g => g.items).find(i => i.path === location.pathname);

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-navy-900 border-r border-white/8 flex flex-col lg:hidden">
              <SidebarContent location={location} onClose={() => setSidebarOpen(false)} signOut={signOut} userEmail={user?.email} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 flex-col bg-navy-900 border-r border-white/8 flex-shrink-0">
        <SidebarContent location={location} signOut={signOut} userEmail={user?.email} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-navy-900/80 backdrop-blur border-b border-white/8 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-navy-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm text-navy-500">
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{currentPage?.name || 'Dashboard'}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 text-navy-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <Link to="/admin/settings"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                location.pathname === '/admin/settings' ? 'bg-accent-500/20 text-accent-400' : 'text-navy-400 hover:text-white hover:bg-white/5'
              }`}>
              <div className="w-7 h-7 bg-accent-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                {user?.email?.[0]?.toUpperCase() || 'A'}
              </div>
              <span className="hidden sm:block">{user?.email?.split('@')[0]}</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
