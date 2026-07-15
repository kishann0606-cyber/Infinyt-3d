import { motion } from 'framer-motion';
import { Link, useParams, Navigate } from 'react-router-dom';
import { ArrowRight, ArrowLeft, Check, Clock, PenTool, Zap, Scan, Lightbulb, Printer, Focus } from 'lucide-react';
import { services } from '../data/products';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'pen-tool': PenTool,
  'zap': Zap,
  'scan': Scan,
  'lightbulb': Lightbulb,
  'printer': Printer,
  'focus': Focus,
};

export function ServiceDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const service = services.find(s => s.slug === slug);

  if (!service) {
    return <Navigate to="/services" replace />;
  }

  const Icon = iconMap[service.icon] || PenTool;
  const relatedServices = services.filter(s => s.id !== service.id).slice(0, 3);

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
              to="/services"
              className="inline-flex items-center gap-2 text-navy-300 hover:text-accent-400 transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Services
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
                {service.name}
              </h1>
              <p className="text-xl text-navy-300 leading-relaxed">
                {service.description}
              </p>

              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  to={`/contact?service=${service.slug}`}
                  className="btn-accent"
                >
                  Get a Quote
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="tel:+919975937476"
                  className="btn-secondary border-white/20 text-white hover:bg-white/10"
                >
                  Call Us
                </a>
              </div>
            </div>

            <div className="relative">
              <motion.img
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                src={service.image}
                alt={service.name}
                className="rounded-2xl shadow-2xl w-full aspect-video object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding bg-white dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
                  What We Offer
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {service.features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-start gap-3 p-4 rounded-xl bg-navy-50 dark:bg-navy-800"
                    >
                      <Check className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="text-navy-700 dark:text-navy-200">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Process */}
              {service.process && service.process.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
                    Our Process
                  </h2>
                  <div className="space-y-4">
                    {service.process.map((step, index) => (
                      <motion.div
                        key={step.step}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="flex gap-4 p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-accent-500 text-white flex items-center justify-center font-bold">
                          {step.step}
                        </div>
                        <div>
                          <h3 className="font-semibold text-navy-900 dark:text-white mb-1">
                            {step.title}
                          </h3>
                          <p className="text-sm text-navy-500 dark:text-navy-400">
                            {step.description}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Deliverables */}
              {service.deliverables && service.deliverables.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-6">
                    Deliverables
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {service.deliverables.map((item) => (
                      <span
                        key={item}
                        className="px-4 py-2 rounded-full bg-accent-100 dark:bg-accent-500/10 text-accent-700 dark:text-accent-400 font-medium"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Pricing */}
              {service.pricing && service.pricing.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-navy-100 dark:border-navy-700"
                >
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4">
                    Pricing
                  </h3>
                  <div className="space-y-4">
                    {service.pricing.map((tier) => (
                      <div
                        key={tier.tier}
                        className="p-4 rounded-xl bg-navy-50 dark:bg-navy-700/50"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-navy-900 dark:text-white">
                            {tier.tier}
                          </span>
                          <span className="text-accent-500 font-bold">
                            {tier.price}
                          </span>
                        </div>
                        <p className="text-sm text-navy-500 dark:text-navy-400">
                          {tier.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Turnaround */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-navy-800 rounded-2xl p-6 border border-navy-100 dark:border-navy-700"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-accent-500" />
                  <h3 className="text-lg font-bold text-navy-900 dark:text-white">
                    Turnaround
                  </h3>
                </div>
                <p className="text-navy-600 dark:text-navy-300">
                  {service.turnaround}
                </p>
              </motion.div>

              {/* CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white"
              >
                <h3 className="text-lg font-bold mb-2">
                  Ready to Start?
                </h3>
                <p className="text-white/80 text-sm mb-4">
                  Get in touch with our team for a free consultation.
                </p>
                <Link
                  to={`/contact?service=${service.slug}`}
                  className="block w-full py-3 px-4 bg-white text-accent-600 rounded-xl font-semibold text-center hover:bg-navy-50 transition-colors"
                >
                  Request a Quote
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="section-padding bg-navy-50 dark:bg-navy-950">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">
              Related Services
            </h2>
            <p className="text-navy-500 dark:text-navy-400">
              Explore our other engineering solutions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {relatedServices.map((relatedService, index) => {
              const RelatedIcon = iconMap[relatedService.icon] || PenTool;
              return (
                <motion.div
                  key={relatedService.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/services/${relatedService.slug}`}
                    className="group block p-6 rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-300"
                  >
                    <RelatedIcon className="w-8 h-8 text-accent-500 mb-4" />
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors mb-2">
                      {relatedService.name}
                    </h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 line-clamp-2">
                      {relatedService.shortDescription}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
