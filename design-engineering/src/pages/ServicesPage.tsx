import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PenTool, Zap, Scan, Lightbulb, Printer, Focus } from 'lucide-react';
import { services } from '../data/products';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'pen-tool': PenTool,
  'zap': Zap,
  'scan': Scan,
  'lightbulb': Lightbulb,
  'printer': Printer,
  'focus': Focus,
};

export function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-10" />
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">
              Our Services
            </span>
            <h1 className="text-display-lg font-display font-bold mb-6">
              Engineering Solutions for Every Stage
            </h1>
            <p className="text-xl text-navy-300 leading-relaxed">
              From concept to production, our comprehensive engineering services deliver exceptional results.
              Partner with our expert team to bring your ideas to life.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="space-y-8">
            {services.map((service, index) => {
              const Icon = iconMap[service.icon] || PenTool;
              return (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/services/${service.slug}`}
                    className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-500 hover:shadow-card-hover"
                  >
                    <div className="grid md:grid-cols-3 gap-6 p-6 lg:p-8">
                      {/* Icon */}
                      <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 p-4 rounded-2xl bg-navy-100 dark:bg-navy-700 group-hover:bg-accent-500 transition-colors duration-300">
                          <Icon className="w-8 h-8 text-navy-600 dark:text-navy-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <div className="md:hidden">
                          <h3 className="text-xl font-semibold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors">
                            {service.name}
                          </h3>
                          <p className="text-sm text-navy-500 dark:text-navy-400 mt-1">
                            {service.shortDescription}
                          </p>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="md:col-span-2">
                        <div className="hidden md:block">
                          <h3 className="text-xl font-semibold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors mb-3">
                            {service.name}
                          </h3>
                          <p className="text-navy-500 dark:text-navy-400 mb-4">
                            {service.description}
                          </p>
                        </div>

                        {/* Features */}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {service.features.slice(0, 4).map((feature) => (
                            <span
                              key={feature}
                              className="text-xs px-3 py-1.5 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>

                        {/* Footer */}
                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-navy-100 dark:border-navy-700">
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-navy-500 dark:text-navy-400">
                              Turnaround: <span className="font-medium text-navy-700 dark:text-navy-200">{service.turnaround}</span>
                            </span>
                            {service.pricing[0] && (
                              <span className="text-navy-500 dark:text-navy-400">
                                Starting from: <span className="font-medium text-accent-500">{service.pricing[0].price}</span>
                              </span>
                            )}
                          </div>
                          <span className="flex items-center gap-1 text-accent-500 font-medium">
                            Learn More
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-navy-50 dark:bg-navy-900">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-display-md font-display font-bold text-navy-900 dark:text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-navy-500 dark:text-navy-400 mb-8 max-w-2xl mx-auto">
              Contact our team for a free consultation and let us help you find the perfect solution for your project.
            </p>
            <Link to="/contact" className="btn-accent">
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
