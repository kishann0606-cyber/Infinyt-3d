import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Box, Droplet, Scan, Layers, Settings, Zap, Wrench, Package } from 'lucide-react';
import { getCategories, type Category } from '../../lib/supabase';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  box: Box,
  droplet: Droplet,
  scan: Scan,
  layers: Layers,
  settings: Settings,
  zap: Zap,
  wrench: Wrench,
};

export function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section className="section-padding bg-gradient-to-b from-white to-navy-50 dark:from-navy-950 dark:to-navy-900">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-2xl bg-navy-100 dark:bg-navy-800 animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-gradient-to-b from-white to-navy-50 dark:from-navy-950 dark:to-navy-900">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="badge badge-accent mb-4">Browse by Category</span>
          <h2 className="section-heading">Explore Our Solutions</h2>
          <p className="section-subheading mx-auto">
            From professional 3D printers to engineering materials, find everything you need for your next project.
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const Icon = iconMap[category.icon || ''] || Package;
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={`/products?category=${category.name}`}
                  className="group block relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/50 transition-all duration-500"
                >
                  {/* Background Image */}
                  {category.image_url && (
                    <div className="absolute inset-0 opacity-10 dark:opacity-5">
                      <img
                        src={category.image_url}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    </div>
                  )}

                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent-500/0 via-accent-500/0 to-accent-500/0 group-hover:from-accent-500/5 group-hover:via-transparent group-hover:to-accent-500/10 transition-all duration-500" />

                  <div className="relative p-6 lg:p-8">
                    {/* Icon */}
                    <div className="mb-4 inline-flex p-3 rounded-xl bg-navy-100 dark:bg-navy-700 group-hover:bg-accent-500 transition-colors duration-300">
                      <Icon className="w-6 h-6 text-navy-600 dark:text-navy-300 group-hover:text-white transition-colors duration-300" />
                    </div>

                    {/* Content */}
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2 group-hover:text-accent-500 transition-colors duration-300">
                      {category.name}
                    </h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 mb-4 line-clamp-2">
                      {category.description || 'Explore our range of products'}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-navy-400 dark:text-navy-500">
                        {category.product_count || 0} products
                      </span>
                      <span className="flex items-center gap-1 text-sm font-medium text-accent-500">
                        Explore
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
