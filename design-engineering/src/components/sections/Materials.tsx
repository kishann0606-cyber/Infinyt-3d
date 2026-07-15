import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Info } from 'lucide-react';
import { materials } from '../../data/products';
import { cn } from '../../lib/utils';

export function MaterialsPreview() {
  return (
    <section className="section-padding bg-gradient-to-b from-navy-50 to-white dark:from-navy-900 dark:to-navy-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="badge badge-accent mb-4">Materials Library</span>
          <h2 className="section-heading">Premium Materials</h2>
          <p className="section-subheading mx-auto">
            Choose from our extensive selection of engineering-grade filaments and resins, each optimized for specific applications.
          </p>
        </motion.div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {materials.slice(0, 8).map((material, index) => (
            <motion.div
              key={material.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 overflow-hidden hover:border-accent-500/30 transition-all duration-500 hover:shadow-card-hover">
                {/* Color Indicator */}
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: material.color }}
                />

                <div className="p-6">
                  {/* Type Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={cn(
                      'text-xs font-medium px-2.5 py-1 rounded-full',
                      material.type === 'filament'
                        ? 'bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300'
                        : 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400'
                    )}>
                      {material.type === 'filament' ? 'FDM' : 'SLA'}
                    </span>
                    <button className="p-1.5 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700 text-navy-400 transition-colors">
                      <Info className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Material Name */}
                  <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2 group-hover:text-accent-500 transition-colors">
                    {material.name}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-navy-500 dark:text-navy-400 mb-4 line-clamp-2">
                    {material.description}
                  </p>

                  {/* Properties Bars */}
                  <div className="space-y-3">
                    <PropertyBar label="Strength" value={material.properties.strength} color={material.color} />
                    <PropertyBar label="Durability" value={material.properties.durability} color={material.color} />
                  </div>

                  {/* Applications */}
                  <div className="mt-4 pt-4 border-t border-navy-100 dark:border-navy-700">
                    <div className="flex flex-wrap gap-1.5">
                      {material.applications.slice(0, 2).map((app) => (
                        <span
                          key={app}
                          className="text-xs text-navy-400 dark:text-navy-500"
                        >
                          {app}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link to="/materials" className="btn-secondary">
            View Full Material Library
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function PropertyBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-navy-500 dark:text-navy-400 w-16">{label}</span>
      <div className="flex-1 h-1.5 bg-navy-100 dark:bg-navy-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          className="h-full rounded-full transition-all"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium text-navy-600 dark:text-navy-300 w-8">{value}%</span>
    </div>
  );
}
