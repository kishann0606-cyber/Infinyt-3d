import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, PenTool, Zap, Scan, Lightbulb, Printer, Focus } from 'lucide-react';
import { services } from '../../data/products';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'pen-tool': PenTool,
  'zap': Zap,
  'scan': Scan,
  'lightbulb': Lightbulb,
  'printer': Printer,
  'focus': Focus,
};

export function Services() {
  return (
    <section className="section-padding bg-navy-900 dark:bg-navy-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 blueprint-bg opacity-10" />

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">Our Services</span>
          <h2 className="text-display-md lg:text-display-lg font-display font-bold text-white mb-4">
            What We Do
          </h2>
          <p className="text-lg text-navy-300 max-w-2xl mx-auto">
            Professional 3D printing, design, and prototyping services to bring your ideas to reality.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || PenTool;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group"
              >
                <Link
                  to={`/services/${service.slug}`}
                  className="block h-full p-6 lg:p-8 rounded-2xl bg-navy-800/50 border border-navy-700 hover:border-accent-500/50 transition-all duration-500 hover:bg-navy-800/80"
                >
                  {/* Icon */}
                  <div className="mb-6 inline-flex p-4 rounded-2xl bg-navy-700/50 group-hover:bg-accent-500 transition-colors duration-300">
                    <Icon className="w-8 h-8 text-navy-300 group-hover:text-white transition-colors duration-300" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-accent-400 transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-navy-400 text-sm leading-relaxed mb-6">
                    {service.shortDescription}
                  </p>

                  {/* Features Pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {service.features.slice(0, 3).map((feature) => (
                      <span
                        key={feature}
                        className="text-xs px-3 py-1 rounded-full bg-navy-700/50 text-navy-300 group-hover:bg-navy-700 group-hover:text-navy-200 transition-colors"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2 text-accent-400 font-medium">
                    Learn More
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 p-8 lg:p-12 rounded-3xl bg-gradient-to-r from-accent-500/10 via-accent-500/5 to-transparent border border-accent-500/20"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Need a custom solution?</h3>
              <p className="text-navy-300">Let our experts help you find the perfect solution for your project.</p>
            </div>
            <Link to="/contact" className="btn-accent whitespace-nowrap">
              Schedule Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
