import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AdminLayout } from './components/admin/AdminLayout';

function lazyNamed<T extends Record<string, React.ComponentType>>(
  importFn: () => Promise<T>,
  name: keyof T
) {
  return lazy(() => importFn().then(m => ({ default: m[name] as React.ComponentType })));
}

const HomePage              = lazyNamed(() => import('./pages/HomePage'),            'HomePage');
const ProductsPage          = lazyNamed(() => import('./pages/ProductsPage'),        'ProductsPage');
const ProductDetail         = lazy(() => import('./pages/ProductDetail'));
const ServicesPage          = lazyNamed(() => import('./pages/ServicesPage'),        'ServicesPage');
const ServiceDetailPage     = lazyNamed(() => import('./pages/ServiceDetailPage'),   'ServiceDetailPage');
const IndustryDetailPage    = lazyNamed(() => import('./pages/IndustryDetailPage'),  'IndustryDetailPage');
const MaterialsPage         = lazyNamed(() => import('./pages/MaterialsPage'),       'MaterialsPage');
const ContactPage           = lazyNamed(() => import('./pages/ContactPage'),         'ContactPage');
const CareersPage           = lazyNamed(() => import('./pages/CareersPage'),         'CareersPage');
const AboutPage             = lazyNamed(() => import('./pages/AboutPage'),           'AboutPage');
const BlogPage              = lazyNamed(() => import('./pages/BlogPage'),            'BlogPage');

const AdminLoginPage             = lazyNamed(() => import('./pages/admin/AdminLoginPage'),        'AdminLoginPage');
const AdminSignupPage            = lazyNamed(() => import('./pages/admin/AdminSignupPage'),       'AdminSignupPage');
const AdminDashboardPage         = lazyNamed(() => import('./pages/admin/AdminDashboardPage'),    'AdminDashboardPage');
const AdminProductsPage          = lazyNamed(() => import('./pages/admin/AdminProductsPage'),     'AdminProductsPage');
const AdminInquiriesPage         = lazyNamed(() => import('./pages/admin/AdminInquiriesPage'),    'AdminInquiriesPage');
const AdminOrdersPage            = lazyNamed(() => import('./pages/admin/AdminOrdersPage'),       'AdminOrdersPage');
const AdminCareersPage           = lazyNamed(() => import('./pages/admin/AdminCareersPage'),      'AdminCareersPage');
const AdminSettingsPage          = lazyNamed(() => import('./pages/admin/AdminSettingsPage'),     'AdminSettingsPage');
const AdminPrototypeRequestsPage = lazyNamed(() => import('./pages/admin/AdminPrototypeRequestsPage'), 'AdminPrototypeRequestsPage');
const AdminMediaPage             = lazyNamed(() => import('./pages/admin/AdminMediaPage'),        'AdminMediaPage');
const AdminSiteSettingsPage      = lazyNamed(() => import('./pages/admin/AdminSiteSettingsPage'), 'AdminSiteSettingsPage');

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-navy-950">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-500" />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="products/:slug" element={<ProductDetail />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="services/:slug" element={<ServiceDetailPage />} />
            <Route path="industries/:slug" element={<IndustryDetailPage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="portfolio" element={<HomePage />} />
            <Route path="blog" element={<BlogPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="careers" element={<CareersPage />} />
          </Route>

          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/signup" element={<AdminSignupPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="orders" element={<AdminOrdersPage />} />
            <Route path="inquiries" element={<AdminInquiriesPage />} />
            <Route path="prototype-requests" element={<AdminPrototypeRequestsPage />} />
            <Route path="careers" element={<AdminCareersPage />} />
            <Route path="media" element={<AdminMediaPage />} />
            <Route path="site-settings" element={<AdminSiteSettingsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
