import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { testimonials } from '../../data/products';

function AvatarWithFallback({ src, name, size = 14 }: { src: string; name: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const initials = name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['bg-accent-500', 'bg-blue-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500'];
  const color = colors[name.charCodeAt(0) % colors.length];

  if (failed) {
    return (
      <div className={`w-${size} h-${size} rounded-full ${color} flex items-center justify-center flex-shrink-0`}>
        <span className="text-white font-bold text-sm">{initials}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={name}
      className={`w-${size} h-${size} rounded-full object-cover flex-shrink-0`}
      onError={() => setFailed(true)}
    />
  );
}

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % testimonials.length);
  const prev = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="section-padding bg-gradient-to-b from-white to-navy-50 dark:from-navy-950 dark:to-navy-900">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="badge badge-accent mb-4">Client Stories</span>
          <h2 className="section-heading">Real Stories, Real Results</h2>
        </motion.div>

        {/* Testimonial Slider */}
        <div className="relative max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 rounded-2xl bg-accent-100 dark:bg-accent-500/10 flex items-center justify-center">
                  <Quote className="w-8 h-8 text-accent-500" />
                </div>
              </div>

              {/* Quote */}
              <blockquote className="text-2xl lg:text-3xl font-medium text-navy-900 dark:text-white leading-relaxed mb-8">
                "{testimonial.quote}"
              </blockquote>

              {/* Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? 'text-accent-500 fill-accent-500' : 'text-navy-200 dark:text-navy-700'}`}
                  />
                ))}
              </div>

              {/* Author */}
              <div className="flex items-center justify-center gap-4">
                <AvatarWithFallback src={testimonial.avatar} name={testimonial.author} size={14} />
                <div className="text-left">
                  <p className="font-semibold text-navy-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-navy-500 dark:text-navy-400">
                    {testimonial.position}, {testimonial.company}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prev}
              className="p-3 rounded-xl bg-white dark:bg-navy-800 shadow-soft hover:shadow-soft-lg border border-navy-100 dark:border-navy-700 transition-all"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-navy-600 dark:text-navy-300" />
            </motion.button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrent(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    index === current
                      ? 'w-8 bg-accent-500'
                      : 'bg-navy-200 dark:bg-navy-700 hover:bg-navy-300 dark:hover:bg-navy-600'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={next}
              className="p-3 rounded-xl bg-white dark:bg-navy-800 shadow-soft hover:shadow-soft-lg border border-navy-100 dark:border-navy-700 transition-all"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-navy-600 dark:text-navy-300" />
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
}
