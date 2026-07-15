import { motion } from 'framer-motion';
import { useState } from 'react';
import { materials } from '../data/products';
import { cn } from '../lib/utils';

export function MaterialsPage() {
  const [selectedType, setSelectedType] = useState<'all' | 'filament' | 'resin'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);

  const filteredMaterials = materials.filter(
    (m) => selectedType === 'all' || m.type === selectedType
  );

  const material = selectedMaterial ? materials.find((m) => m.id === selectedMaterial) : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-accent-500/10 to-navy-100 dark:from-navy-900 dark:to-navy-950">
        <div className="container-custom relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <span className="badge badge-accent mb-4">Materials Library</span>
            <h1 className="text-display-lg font-display font-bold text-navy-900 dark:text-white mb-6">
              Premium Materials for Every Application
            </h1>
            <p className="text-xl text-navy-500 dark:text-navy-400 leading-relaxed">
              Choose from our extensive selection of engineering-grade filaments and resins.
              Each material is optimized for specific applications and performance requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 border-b border-navy-100 dark:border-navy-800">
        <div className="container-custom">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-2">
              {(['all', 'filament', 'resin'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'px-6 py-2.5 rounded-xl text-sm font-medium transition-all',
                    selectedType === type
                      ? 'bg-navy-900 dark:bg-white text-white dark:text-navy-900'
                      : 'bg-navy-100 dark:bg-navy-800 text-navy-600 dark:text-navy-300 hover:bg-navy-200 dark:hover:bg-navy-700'
                  )}
                >
                  {type === 'all' ? 'All Materials' : type === 'filament' ? 'FDM Filaments' : 'SLA Resins'}
                </button>
              ))}
            </div>
            <p className="text-sm text-navy-500 dark:text-navy-400">
              {filteredMaterials.length} materials
            </p>
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material, index) => (
              <motion.div
                key={material.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                onClick={() => setSelectedMaterial(material.id)}
                className="cursor-pointer"
              >
                <div
                  className={cn(
                    'group block relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 border transition-all duration-500 hover:shadow-card-hover',
                    selectedMaterial === material.id
                      ? 'border-accent-500 ring-2 ring-accent-500/20'
                      : 'border-navy-100 dark:border-navy-700 hover:border-accent-500/30'
                  )}
                >
                  {/* Color Bar */}
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
                    </div>

                    {/* Name */}
                    <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2 group-hover:text-accent-500 transition-colors">
                      {material.name}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-navy-500 dark:text-navy-400 mb-4 line-clamp-2">
                      {material.description}
                    </p>

                    {/* Properties */}
                    <div className="space-y-3">
                      <PropertyBar label="Strength" value={material.properties.strength} color={material.color} />
                      <PropertyBar label="Durability" value={material.properties.durability} color={material.color} />
                      <PropertyBar label="Flexibility" value={material.properties.flexibility} color={material.color} />
                    </div>

                    {/* Applications */}
                    <div className="mt-4 pt-4 border-t border-navy-100 dark:border-navy-700">
                      <p className="text-xs text-navy-400 dark:text-navy-500 mb-2">Best for:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {material.applications.slice(0, 3).map((app) => (
                          <span key={app} className="text-xs text-navy-600 dark:text-navy-300">
                            {app}{material.applications.indexOf(app) < 2 && material.applications.length > 1 ? ', ' : ''}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Detail Modal */}
      {material && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedMaterial(null)}
        >
          <div className="absolute inset-0 bg-navy-900/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white dark:bg-navy-800 rounded-2xl shadow-soft-xl"
          >
            <div className="sticky top-0 p-6 border-b border-navy-100 dark:border-navy-700 bg-white dark:bg-navy-800 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: material.color }}
                  />
                  <h3 className="text-xl font-bold text-navy-900 dark:text-white">{material.name}</h3>
                </div>
                <button
                  onClick={() => setSelectedMaterial(null)}
                  className="p-2 rounded-lg hover:bg-navy-100 dark:hover:bg-navy-700"
                >
                  x
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-navy-600 dark:text-navy-300">{material.description}</p>

              {/* Print Settings */}
              {material.type === 'filament' && (
                <div>
                  <h4 className="font-semibold text-navy-900 dark:text-white mb-3">Print Settings</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-900">
                      <p className="text-xs text-navy-500 dark:text-navy-400">Nozzle Temp</p>
                      <p className="font-medium text-navy-900 dark:text-white">{material.printSettings.nozzleTemp}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-900">
                      <p className="text-xs text-navy-500 dark:text-navy-400">Bed Temp</p>
                      <p className="font-medium text-navy-900 dark:text-white">{material.printSettings.bedTemp}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-900">
                      <p className="text-xs text-navy-500 dark:text-navy-400">Print Speed</p>
                      <p className="font-medium text-navy-900 dark:text-white">{material.printSettings.printSpeed}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-navy-50 dark:bg-navy-900">
                      <p className="text-xs text-navy-500 dark:text-navy-400">Cooling</p>
                      <p className="font-medium text-navy-900 dark:text-white">{material.printSettings.cooling}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Advantages */}
              <div>
                <h4 className="font-semibold text-navy-900 dark:text-white mb-3">Advantages</h4>
                <ul className="space-y-2">
                  {material.advantages.map((advantage) => (
                    <li key={advantage} className="flex items-center gap-2 text-navy-600 dark:text-navy-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-500" />
                      {advantage}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applications */}
              <div>
                <h4 className="font-semibold text-navy-900 dark:text-white mb-3">Applications</h4>
                <div className="flex flex-wrap gap-2">
                  {material.applications.map((app) => (
                    <span key={app} className="text-sm px-3 py-1.5 rounded-full bg-navy-100 dark:bg-navy-700 text-navy-700 dark:text-navy-200">
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
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
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-xs font-medium text-navy-600 dark:text-navy-300 w-8">{value}%</span>
    </div>
  );
}
