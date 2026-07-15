import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronDown, Play, Zap, Layers, Settings, PenTool } from 'lucide-react';
import { useMousePosition } from '../../hooks/useAnimations';
import { cn } from '../../lib/utils';

const capabilities = [
  '3D Printing',
  'Design Engineering',
  'Rapid Prototyping',
  'Reverse Engineering',
  'Product Design',
  'Industrial Manufacturing',
];

const features = [
  { icon: Zap, label: 'Rapid Delivery' },
  { icon: Layers, label: 'Endless Materials' },
  { icon: Settings, label: 'Precision Engineering' },
  { icon: PenTool, label: 'Expert Design' },
];

export function Hero() {
  const [currentCapability, setCurrentCapability] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const mousePosition = useMousePosition();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setCurrentCapability((prev) => (prev + 1) % capabilities.length);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Blueprint Grid */}
        <motion.div
          style={{ y }}
          className="absolute inset-0 blueprint-bg opacity-30 dark:opacity-20"
        />

        {/* Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              x: mousePosition.x * 0.02,
              y: mousePosition.y * 0.02,
            }}
            transition={{ type: 'spring', damping: 50 }}
            className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-accent-500/20 via-accent-400/10 to-transparent blur-3xl"
          />
          <motion.div
            animate={{
              x: mousePosition.x * -0.02,
              y: mousePosition.y * -0.02,
            }}
            transition={{ type: 'spring', damping: 50 }}
            className="absolute -bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-navy-500/20 via-navy-400/10 to-transparent blur-3xl"
          />
        </div>

        {/* Mouse-following Glow */}
        <motion.div
          className="absolute w-96 h-96 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.15) 0%, transparent 70%)',
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />

        {/* Floating Geometric Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 right-[15%] w-20 h-20 border border-accent-500/20 rounded-xl rotate-12"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="absolute bottom-1/3 left-[10%] w-16 h-16 border border-navy-500/20 rounded-full"
          />
          <motion.div
            animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            className="absolute top-1/3 left-[20%] w-12 h-12 bg-accent-500/5 rounded-lg rotate-45"
          />
          <motion.div
            animate={{ y: [0, 25, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="absolute bottom-1/4 right-[25%] w-24 h-24 border border-accent-500/10 rounded-2xl -rotate-12"
          />
        </div>

        {/* 3D Printer Animation */}
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:block"
        >
          <div className="relative w-96 h-96">
            {/* Printer Frame */}
            <div className="absolute inset-0 border-2 border-navy-200 dark:border-navy-700 rounded-3xl opacity-20" />
            {/* Print Bed */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-2 bg-accent-500/30 rounded"
            />
            {/* Print Head */}
            <motion.div
              animate={{ x: [-80, 80, -80] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-20 left-1/2 -translate-x-1/2 w-12 h-12 bg-navy-400/20 rounded-lg"
            >
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-4 bg-accent-500 rounded" />
            </motion.div>
            {/* Printed Object */}
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: [0, 60, 60, 80, 80] }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
              className="absolute bottom-22 left-1/2 -translate-x-1/2 w-16 bg-gradient-to-t from-accent-500/40 to-accent-400/20 rounded"
            />
          </div>
        </motion.div>
      </div>

      {/* Content */}
      <motion.div style={{ opacity }} className="container-custom relative z-10">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-navy-100 dark:bg-navy-800/50 border border-navy-200 dark:border-navy-700 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-500" />
            </span>
            <span className="text-sm font-medium text-navy-600 dark:text-navy-300">
              Now offering enterprise solutions
            </span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6"
          >
            <span className="block text-4xl sm:text-5xl lg:text-display-lg font-display font-bold text-navy-900 dark:text-white mb-3 tracking-tight">
              Engineering the Future with
            </span>
            <span className="block text-4xl sm:text-5xl lg:text-display-lg font-display font-bold mb-4">
              <span className="gradient-text-accent">Premium 3D Printing</span>
            </span>
          </motion.h1>

          {/* Rotating Capability Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="h-14 flex items-center mb-8"
          >
            <div className="relative">
              {capabilities.map((capability, index) => (
                <motion.div
                  key={capability}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: currentCapability === index ? 1 : 0,
                    y: currentCapability === index ? 0 : 20,
                  }}
                  transition={{ duration: 0.5 }}
                  className={cn(
                    'absolute left-0',
                    currentCapability === index ? 'relative' : 'absolute'
                  )}
                >
                  <span className="text-xl sm:text-2xl font-semibold text-navy-600 dark:text-navy-300">
                    {capability}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg text-navy-500 dark:text-navy-400 max-w-2xl mb-10 leading-relaxed"
          >
            Transform your ideas into reality with our cutting-edge 3D printing solutions, expert engineering services, and premium materials. From prototyping to production, we deliver excellence.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <Link to="/products" className="btn-accent group">
              Explore Products
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/services" className="btn-secondary group">
              <Play className="w-4 h-4" />
              Our Services
            </Link>
          </motion.div>

          {/* Feature Tags */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-navy-800 shadow-soft"
              >
                <feature.icon className="w-4 h-4 text-accent-500" />
                <span className="text-sm font-medium text-navy-700 dark:text-navy-200">{feature.label}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        style={{ opacity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-xs font-medium text-navy-400 tracking-wider uppercase">Scroll</span>
          <ChevronDown className="w-5 h-5 text-navy-400" />
        </motion.div>
      </motion.div>
    </section>
  );
}
