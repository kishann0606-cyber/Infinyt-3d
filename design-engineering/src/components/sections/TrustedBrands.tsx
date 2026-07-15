import { motion } from 'framer-motion';
import { trustedBrands } from '../../data/products';

const clientPartners = [
  {
    name: 'TCS',
    fullName: 'Tata Consultancy Services',
    initial: 'TCS',
    color: '#0066CC',
    description: 'IT & Digital Services',
  },
  {
    name: 'CommScope',
    fullName: 'CommScope',
    initial: 'CS',
    color: '#E31837',
    description: 'Network Infrastructure',
  },
  {
    name: 'Syntegon',
    fullName: 'Syntegon Technology',
    initial: 'SY',
    color: '#004B87',
    description: 'Packaging Solutions',
  },
  {
    name: 'Optel',
    fullName: 'Optel Group',
    initial: 'OP',
    color: '#006B3C',
    description: 'Track & Trace Solutions',
  },
  {
    name: 'IFB',
    fullName: 'IFB Industries',
    initial: 'IFB',
    color: '#1A1A2E',
    description: 'Engineering & Appliances',
  },
];

const brandsDoubled = [...trustedBrands, ...trustedBrands, ...trustedBrands];

export function TrustedBrands() {
  return (
    <>
      {/* Official Distributor Brands */}
      <section className="py-14 border-y border-navy-100 dark:border-navy-800 bg-navy-50/50 dark:bg-navy-900/50 overflow-hidden">
        <div className="container-custom mb-8">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center text-xs font-semibold tracking-[0.25em] uppercase text-navy-400 dark:text-navy-500"
          >
            Official Distributor & Reseller of
          </motion.p>
        </div>

        {/* Marquee Track */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-navy-50/50 dark:from-navy-900/50 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-navy-50/50 dark:from-navy-900/50 to-transparent z-10 pointer-events-none" />

          <motion.div
            animate={{ x: ['0%', '-33.333%'] }}
            transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
            className="flex items-center gap-12 lg:gap-20"
            style={{ width: 'max-content' }}
          >
            {brandsDoubled.map((brand, index) => (
              <motion.div
                key={`${brand}-${index}`}
                whileHover={{ scale: 1.1, opacity: 1 }}
                className="flex-shrink-0 opacity-35 hover:opacity-80 transition-opacity duration-300"
              >
                <span className="text-xl md:text-2xl lg:text-3xl font-black text-navy-400 dark:text-navy-600 tracking-widest whitespace-nowrap select-none">
                  {brand}
                </span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Client Partners Section */}
      <section className="py-16 lg:py-20 bg-white dark:bg-navy-900">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="badge badge-accent mb-4">Trusted By</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-navy-900 dark:text-white mb-4">
              Industry Leaders Choose Infinyt3D
            </h2>
            <p className="text-navy-500 dark:text-navy-400 max-w-2xl mx-auto">
              From global technology corporations to precision engineering firms, our clients trust us for quality, speed, and innovation.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {clientPartners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 p-6 flex flex-col items-center text-center hover:border-accent-500/30 hover:shadow-xl transition-all duration-300"
              >
                {/* Logo Circle */}
                <div
                  className="w-16 h-16 rounded-xl flex items-center justify-center mb-4 text-white font-black text-lg shadow-lg"
                  style={{ backgroundColor: partner.color }}
                >
                  {partner.initial}
                </div>

                {/* Name */}
                <h3 className="font-bold text-navy-900 dark:text-white text-sm leading-tight mb-1">
                  {partner.fullName}
                </h3>

                {/* Description */}
                <p className="text-xs text-navy-500 dark:text-navy-400 leading-relaxed">
                  {partner.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-accent-500 group-hover:w-3/4 transition-all duration-300 rounded-full" />
              </motion.div>
            ))}
          </div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 pt-10 border-t border-navy-100 dark:border-navy-800 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center"
          >
            <div>
              <p className="text-3xl font-bold text-accent-500 font-display">500+</p>
              <p className="text-navy-500 dark:text-navy-400 text-sm mt-1">Clients Served</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-500 font-display">15+</p>
              <p className="text-navy-500 dark:text-navy-400 text-sm mt-1">Years of Excellence</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-accent-500 font-display">20+</p>
              <p className="text-navy-500 dark:text-navy-400 text-sm mt-1">Industries Covered</p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
