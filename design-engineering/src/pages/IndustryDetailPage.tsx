import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Car, Plane, Building2, HeartPulse, Smile, GraduationCap, Factory, Bot, Package, Microscope } from 'lucide-react';
import { industries, services } from '../data/products';

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

export function IndustryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const industry = industries.find(i => i.slug === slug);

  if (!industry) {
    return <Navigate to="/" replace />;
  }

  const Icon = iconMap[industry.icon] || Factory;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-10" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-navy-300 hover:text-accent-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid lg:grid-cols-2 gap-8 items-center"
          >
            <div>
              <div className="inline-flex p-4 rounded-2xl bg-accent-500/20 mb-6">
                <Icon className="w-12 h-12 text-accent-400" />
              </div>
              <h1 className="text-display-lg font-display font-bold mb-4">
                {industry.name}
              </h1>
              <p className="text-xl text-navy-300 leading-relaxed">
                {industry.description}
              </p>

              {industry.stats && (
                <div className="flex gap-6 mt-8">
                  {industry.stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-3xl font-bold text-accent-400">{stat.value}</p>
                      <p className="text-sm text-navy-400">{stat.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src={industry.image}
                alt={industry.name}
                className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Applications */}
      <section className="section-padding bg-white dark:bg-navy-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-8 text-center">
              Applications in {industry.name}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {industry.applications.map((app, index) => (
                <motion.div
                  key={app}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-navy-50 dark:bg-navy-800"
                >
                  <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                  <span className="text-navy-700 dark:text-navy-200">{app}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Services for this Industry */}
      <section className="section-padding bg-navy-50 dark:bg-navy-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">
              Our Services for {industry.name}
            </h2>
            <p className="text-navy-500 dark:text-navy-400 max-w-2xl mx-auto">
              Comprehensive solutions tailored to the unique requirements of the {industry.name.toLowerCase()} industry.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service, index) => {
              const ServiceIcon = iconMap[service.icon] || Factory;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="group block p-6 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-300"
                  >
                    <ServiceIcon className="w-8 h-8 text-accent-500 mb-4" />
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors mb-2">
                      {service.name}
                    </h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 line-clamp-2">
                      {service.shortDescription}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">
              Let our experts help you find the perfect solution for your {industry.name.toLowerCase()} needs.
            </p>
            <Link
              to={`/contact?industry=${industry.slug}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-600 rounded-xl font-semibold hover:bg-navy-50 transition-colors"
            >
              Get a Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
