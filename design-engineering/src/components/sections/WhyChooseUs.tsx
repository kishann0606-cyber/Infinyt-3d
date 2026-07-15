import { useRef, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { stats } from '../../data/products';

export function Stats() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-navy-900 via-navy-800 to-navy-900 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 grid-bg opacity-30" />

      <div className="container-custom relative">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} />
              <p className="text-navy-300 mt-2 text-sm lg:text-base">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function AnimatedCounter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
  const suffix = value.replace(/[0-9.,]/g, '');

  return (
    <span ref={ref} className="text-4xl lg:text-5xl font-bold text-white tabular-nums">
      {isInView ? (
        <Counter from={0} to={numericValue} suffix={suffix} />
      ) : (
        `0${suffix}`
      )}
    </span>
  );
}

function Counter({ from, to, suffix }: { from: number; to: number; suffix: string }) {
  const [count, setCount] = useState(from);

  useEffect(() => {
    const duration = 2000;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(from + (to - from) * eased);
      setCount(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [from, to]);

  return <>{count.toLocaleString()}{suffix}</>;
}

import { useState } from 'react';

export function WhyChooseUs() {
  const features = [
    {
      title: 'Expert Engineering Team',
      description: 'Our team of certified engineers brings decades of combined experience in advanced manufacturing technologies.',
      stat: '15 years combined',
    },
    {
      title: 'Quality Guaranteed',
      description: 'Every part undergoes rigorous quality inspection to ensure it meets your exact specifications.',
      stat: '99.8% satisfaction',
    },
    {
      title: 'Fast Turnaround',
      description: 'Rapid prototyping services with turnaround times as fast as 24 hours for urgent projects.',
      stat: '24-48hr rush available',
    },
    {
      title: 'Full Service',
      description: 'From design to delivery, we handle every step of the manufacturing process in-house.',
      stat: 'End-to-end service',
    },
  ];

  return (
    <section className="section-padding">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="badge badge-accent mb-4">Why Choose Us</span>
            <h2 className="section-heading">Engineered for Excellence</h2>
            <p className="section-subheading mb-8">
              We combine cutting-edge technology with decades of engineering expertise to deliver solutions that exceed expectations.
            </p>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-500/10 flex items-center justify-center">
                    <span className="text-accent-500 font-bold text-lg">0{index + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy-900 dark:text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400">{feature.description}</p>
                    <span className="text-xs text-accent-500 font-medium">{feature.stat}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right - Image/Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/8566530/pexels-photo-8566530.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Engineering excellence"
                className="w-full aspect-square object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 to-transparent" />

              {/* Floating Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/90 dark:bg-navy-800/90 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-accent-500 flex items-center justify-center text-white font-bold text-sm">
                    ISO
                  </div>
                  <div>
                    <p className="font-semibold text-navy-900 dark:text-white">Quality Certified</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">ISO 9001:2015, AS9100D</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
