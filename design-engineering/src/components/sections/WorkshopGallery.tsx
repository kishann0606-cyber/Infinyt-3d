import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X, ZoomIn, ArrowRight, Sparkles, Wrench, Box } from 'lucide-react';

const galleryImages = [
  {
    src: '/workshop/gallery/20241221_143410.jpg',
    alt: 'Infinyt3D team training workshop',
    label: 'Team Training',
    span: 'large',
  },
  {
    src: '/workshop/gallery/20250113_143939.jpg',
    alt: 'VR technology demonstration at Infinyt3D',
    label: 'Tech Demo',
    span: 'small',
  },
  {
    src: '/workshop/gallery/20241221_164131.jpg',
    alt: 'Sales training session at Infinyt3D',
    label: 'Workshop',
    span: 'small',
  },
  {
    src: '/workshop/gallery/20241221_142158.jpg',
    alt: 'Infinyt3D knowledge session',
    label: 'Knowledge Session',
    span: 'small',
  },
  {
    src: '/workshop/gallery/dsdd.webp',
    alt: 'Infinyt3D team collaboration',
    label: 'Collaboration',
    span: 'small',
  },
];

const prototypeImages = [
  {
    src: '/images/products/IMG-20170407-WA0013.jpg',
    alt: 'Custom 3D printed prototype',
    title: 'Functional Prototype',
    description: 'Engineering-grade functional prototype',
  },
  {
    src: '/images/feedback/feedbck1.png',
    alt: 'Custom prototype project',
    title: 'Custom Design',
    description: 'Tailored to client specifications',
  },
  {
    src: '/images/feedback/fdbck2.png',
    alt: 'Rapid prototype result',
    title: 'Rapid Turnaround',
    description: 'Delivered within 48 hours',
  },
  {
    src: '/images/feedback/fdbck3.png',
    alt: 'Complex prototype',
    title: 'Complex Geometry',
    description: 'Intricate details captured',
  },
];

export function WorkshopGallery() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <section className="section-padding bg-white dark:bg-navy-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge badge-accent mb-4">Workshop &amp; Gallery</span>
          <h2 className="section-heading">Inside Infinyt3D</h2>
          <p className="section-subheading mx-auto">
            A glimpse into our workspace, training sessions, and the innovative environment we foster every day.
          </p>
        </motion.div>

        {/* Masonry Gallery Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 lg:gap-4 mb-12">
          {/* Large image — spans 2 rows on md+ */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:row-span-2 relative group cursor-pointer rounded-2xl overflow-hidden"
            onClick={() => setLightbox(galleryImages[0].src)}
          >
            <img
              src={galleryImages[0].src}
              alt={galleryImages[0].alt}
              className="w-full h-full object-cover min-h-[240px] md:min-h-[400px] group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <span className="text-white font-semibold text-sm">{galleryImages[0].label}</span>
            </div>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <ZoomIn className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>

          {/* Right-side smaller images */}
          {galleryImages.slice(1).map((img, index) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: (index + 1) * 0.1 }}
              className="relative group cursor-pointer rounded-2xl overflow-hidden"
              onClick={() => setLightbox(img.src)}
            >
              <img
                src={img.src}
                alt={img.alt}
                className="w-full h-[180px] md:h-[192px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white font-medium text-xs">{img.label}</span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                  <ZoomIn className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Prototype Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-accent-500 mb-3">
              <Box className="w-5 h-5" />
              <span className="font-semibold">Our Work</span>
            </div>
            <h3 className="text-2xl font-bold text-navy-900 dark:text-white">
              Prototypes We've Made
            </h3>
            <p className="text-navy-500 dark:text-navy-400 mt-2">
              Real projects designed and printed for our clients
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {prototypeImages.map((img, index) => (
              <motion.div
                key={img.src}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative rounded-2xl overflow-hidden bg-navy-100 dark:bg-navy-800 cursor-pointer"
                onClick={() => setLightbox(img.src)}
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="text-white font-semibold text-sm">{img.title}</p>
                  <p className="text-white/70 text-xs">{img.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Custom Prototypes CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 text-white p-8 lg:p-12"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-20 -top-20 w-64 h-64 border border-accent-500/10 rounded-full"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              className="absolute -right-10 -top-10 w-48 h-48 border border-accent-500/10 rounded-full"
            />
            <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Wrench className="w-32 h-32 text-accent-500/10" />
              </motion.div>
            </div>
          </div>

          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-accent-500/20 border border-accent-500/30 rounded-full px-4 py-1.5 mb-4">
                <Sparkles className="w-4 h-4 text-accent-400" />
                <span className="text-accent-400 text-sm font-medium">Custom Work</span>
              </div>
              <h3 className="text-2xl lg:text-3xl font-bold mb-3">
                We Make Customized Prototypes
              </h3>
              <p className="text-navy-300 max-w-xl text-lg">
                From concept to physical reality — we design and 3D print custom prototypes tailored to your exact specifications. Bring your ideas to life with our expert engineering team.
              </p>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-2 mt-5">
                {['Rapid Turnaround', 'Any Complexity', 'All Materials', 'CAD Design Included'].map((f) => (
                  <span key={f} className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80">
                    {f}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 flex-shrink-0">
              <Link
                to="/contact?service=rapid-prototyping&type=custom"
                className="btn-accent text-base px-8 py-3"
              >
                Request Custom Prototype
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/services/rapid-prototyping"
                className="btn-secondary text-base px-8 py-3 border-white/20 text-white hover:bg-white/10"
              >
                Learn More
              </Link>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/95 backdrop-blur-sm p-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[90vh] w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setLightbox(null)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <img
                src={lightbox}
                alt="Gallery"
                className="w-full h-auto max-h-[85vh] object-contain rounded-2xl"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
