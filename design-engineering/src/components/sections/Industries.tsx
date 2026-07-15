import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Car, Plane, Building2, HeartPulse, Smile, GraduationCap,
  Factory, Bot, Package, Microscope, ArrowRight
} from 'lucide-react';
import { industries } from '../../data/products';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'car': Car,
  'plane': Plane,
  'building-2': Building2,
  'heart-pulse': HeartPulse,
  'smile': Smile,
  'graduation-cap': GraduationCap,
  'factory': Factory,
  'bot': Bot,
  'package': Package,
  'microscope': Microscope,
};

export function Industries() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="badge badge-accent mb-4">Industries We Serve</span>
          <h2 className="section-heading">Powering Innovation Across Sectors</h2>
          <p className="section-subheading mx-auto">
            From aerospace to medical devices, our solutions power innovation across the world's most demanding industries.
          </p>
        </motion.div>

        {/* Industries Grid */}
        <div className="relative">
          {/* Background Decoration */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-accent-500/5 to-navy-500/5 rounded-full blur-3xl" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {industries.map((industry, index) => {
              const Icon = iconMap[industry.icon] || Factory;
              return (
                <motion.div
                  key={industry.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link
                    to={`/industries/${industry.slug}`}
                    className="group block text-center p-6 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-500 hover:shadow-card-hover"
                  >
                    {/* Icon */}
                    <div className="mx-auto mb-4 w-14 h-14 rounded-xl bg-navy-100 dark:bg-navy-700 flex items-center justify-center group-hover:bg-accent-500 transition-colors duration-300">
                      <Icon className="w-7 h-7 text-navy-600 dark:text-navy-300 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Name */}
                    <h3 className="text-sm font-semibold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors">
                      {industry.name}
                    </h3>

                    {/* Applications Count */}
                    <p className="text-xs text-navy-400 dark:text-navy-500 mt-1">
                      {industry.applications.length} applications
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Applications Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-6 lg:p-8 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 dark:from-navy-800 dark:to-navy-900 text-white"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-2">Custom Solutions for Every Industry</h3>
              <p className="text-navy-300">
                We understand that each industry has unique requirements. Our team works closely with you to develop tailored solutions that meet your specific needs.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              {['ISO 9001', 'ISO 13485', 'AS9100D', 'ITAR'].map((cert) => (
                <span
                  key={cert}
                  className="px-4 py-2 rounded-lg bg-white/10 text-white text-sm font-medium"
                >
                  {cert}
                </span>
              ))}
            </div>
            <Link to="/contact" className="btn-accent whitespace-nowrap">
              Get Custom Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
