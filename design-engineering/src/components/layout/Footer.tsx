import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Mail, Clock,
  ArrowRight, Heart, MessageCircle, Shield,
  Linkedin, Twitter, Instagram, Youtube
} from 'lucide-react';
import { contactInfo, categories, services } from '../../data/products';
import { getYear } from '../../lib/utils';

const footerLinks = {
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Careers', href: '/careers' },
    { name: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, href: 'https://linkedin.com/company/infinyt3d' },
  { name: 'Twitter', icon: Twitter, href: 'https://twitter.com/infinyt3d' },
  { name: 'Instagram', icon: Instagram, href: 'https://instagram.com/infinyt3d' },
  { name: 'YouTube', icon: Youtube, href: 'https://youtube.com/infinyt3d' },
];

const WHATSAPP_NUMBER = '919975937476';
const PHONE_NUMBER = '+91 9975937476';

export function Footer() {
  return (
    <footer className="bg-navy-900 dark:bg-navy-950 text-white">
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-3 mb-6">
              <img
                src="/images/products/infinyt_3dlodo.jpg"
                alt="Infinyt 3D Pvt. Ltd."
                className="w-12 h-12 rounded-full object-cover"
              />
              <span className="font-display font-bold text-xl">
                Infinyt <span className="text-accent-500">3D</span> Pvt. Ltd.
              </span>
            </Link>
            <p className="text-navy-400 mb-6 max-w-xs leading-relaxed">
              Transforming ideas into reality with premium 3D printing and engineering solutions in Goa, India.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start gap-3 text-navy-400">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{contactInfo.address}, {contactInfo.city}, {contactInfo.state} {contactInfo.zip}</span>
              </div>
              <a
                href={`tel:${PHONE_NUMBER}`}
                className="flex items-center gap-3 text-navy-400 hover:text-accent-400 transition-colors group"
              >
                <Phone className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">{PHONE_NUMBER}</span>
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-navy-400 hover:text-green-400 transition-colors group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="text-sm">WhatsApp Us</span>
              </a>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-navy-400 hover:text-accent-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
                <span className="text-sm">{contactInfo.email}</span>
              </a>
              <div className="flex items-start gap-3 text-navy-400">
                <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                  {contactInfo.hours.map((h, i) => (
                    <div key={i}>{h.day}: {h.hours}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Products</h4>
            <ul className="space-y-2.5">
              {categories.slice(0, 5).map((category) => (
                <li key={category.id}>
                  <Link
                    to={`/products?category=${encodeURIComponent(category.name)}`}
                    className="text-navy-400 hover:text-accent-400 transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {category.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-navy-400 hover:text-accent-400 transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {service.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h4 className="font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-navy-400 hover:text-accent-400 transition-colors text-sm inline-flex items-center gap-1 group"
                  >
                    {link.name}
                    <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>

            {/* Admin Link */}
            <div className="mt-6 pt-4 border-t border-navy-800">
              <h4 className="font-semibold text-white mb-3 text-sm">Admin</h4>
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 text-navy-400 hover:text-accent-400 transition-colors text-sm group"
              >
                <Shield className="w-4 h-4 text-accent-500" />
                Admin Panel
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-navy-800">
        <div className="container-custom py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-navy-500 text-sm">
              &copy; {getYear()} Infinyt 3D Pvt. Ltd. All rights reserved. Made with{' '}
              <Heart className="w-4 h-4 inline text-accent-500" /> in Goa, India.
            </p>
            <div className="flex items-center gap-4">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-navy-500 hover:text-accent-400 text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg bg-navy-800 hover:bg-accent-500 flex items-center justify-center text-navy-400 hover:text-white transition-colors"
                  aria-label={social.name}
                >
                  <social.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
