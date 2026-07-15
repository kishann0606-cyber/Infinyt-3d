import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { faqs } from '../../data/products';
import { cn } from '../../lib/utils';

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <section className="section-padding bg-navy-50 dark:bg-navy-900">
      <div className="container-custom">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-accent mb-4">FAQ</span>
            <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
            <p className="text-navy-500 dark:text-navy-400 mb-6">
              Can't find what you're looking for? Our team is here to help.
            </p>
            <Link to="/contact" className="btn-accent">
              Contact Support
            </Link>
          </motion.div>

          {/* FAQ Items */}
          <div className="lg:col-span-2 space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white dark:bg-navy-800 rounded-xl border border-navy-100 dark:border-navy-700 overflow-hidden">
                  <button
                    onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between gap-4 p-5 text-left"
                  >
                    <div className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-accent-500 flex-shrink-0 mt-0.5" />
                      <span className="font-medium text-navy-900 dark:text-white">{faq.question}</span>
                    </div>
                    <ChevronDown
                      className={cn(
                        'w-5 h-5 text-navy-400 flex-shrink-0 transition-transform duration-300',
                        openId === faq.id && 'rotate-180'
                      )}
                    />
                  </button>
                  <AnimatePresence>
                    {openId === faq.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pl-12 text-navy-600 dark:text-navy-300">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
