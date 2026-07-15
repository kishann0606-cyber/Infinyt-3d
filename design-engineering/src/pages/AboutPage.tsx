import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Award, Target, Heart, Zap, Shield, Star, CheckCircle } from 'lucide-react';

const stats = [
  { value: '2014', label: 'Founded' },
  { value: '500+', label: 'Happy Clients' },
  { value: '50,000+', label: 'Parts Delivered' },
  { value: '15+', label: 'Years Experience' },
];

const values = [
  { icon: Award, title: 'Quality First', description: 'Every print, every design, every service meets our rigorous standards before it reaches you.' },
  { icon: Zap, title: 'Innovation', description: 'We invest continuously in the latest 3D printing technology and techniques.' },
  { icon: Heart, title: 'Customer Focus', description: 'Your success is our success. We work closely with every client to deliver tailored solutions.' },
  { icon: Shield, title: 'Integrity', description: 'Transparent pricing, honest timelines, and reliable communication — always.' },
];

const milestones = [
  { year: '2014', title: 'Founded in Goa', description: 'Infinyt3D was established with a vision to bring professional 3D printing services to Goa.' },
  { year: '2016', title: 'First Industrial Clients', description: 'Expanded services to automotive and medical device manufacturers across India.' },
  { year: '2019', title: 'Creality Partnership', description: 'Became an authorized exclusive Creality distributor for Goa.' },
  { year: '2021', title: 'Expanded Services', description: 'Launched full-service CAD design, reverse engineering, and 3D scanning capabilities.' },
  { year: '2023', title: '500+ Clients Milestone', description: 'Reached 500+ satisfied clients and 50,000+ parts delivered across industries.' },
  { year: '2024', title: 'New Brand Partnerships', description: 'Added Bambu Lab, Elegoo, Phrozen, Anycubic, and Flashforge to our portfolio.' },
];

const certifications = [
  'Authorized Creality Distributor — Goa',
  'Bambu Lab Official Partner',
  'Elegoo Authorized Reseller',
  'Phrozen Authorized Reseller',
];

const galleryImages = [
  { src: '/workshop/gallery/20241221_143410.jpg', label: 'Team Training' },
  { src: '/workshop/gallery/20250113_143939.jpg', label: 'Tech Demo' },
  { src: '/workshop/gallery/20241221_164131.jpg', label: 'Workshop' },
  { src: '/workshop/gallery/20241221_142158.jpg', label: 'Knowledge Session' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-navy-900 via-navy-800 to-navy-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: 'linear-gradient(rgba(99,114,243,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,114,243,0.1) 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }} />
        <div className="container-custom relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl">
            <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">About Us</span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold mb-6 leading-tight">
              Goa's Premier<br />
              <span className="text-accent-400">3D Printing</span> Company
            </h1>
            <p className="text-xl text-navy-300 leading-relaxed mb-6">
              Since 2014, Infinyt3D has been at the forefront of additive manufacturing in India —
              Goa's most trusted 3D printing partner for hobbyists to Fortune 500 companies.
            </p>
            <div className="flex items-center gap-2 text-navy-400">
              <MapPin className="w-5 h-5 text-accent-400" />
              <span>Verna Industrial Estate, Goa, India</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white dark:bg-navy-900 border-b border-navy-100 dark:border-navy-800">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-4xl font-bold text-accent-500 font-display">{stat.value}</p>
                <p className="text-navy-500 dark:text-navy-400 mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="section-padding bg-white dark:bg-navy-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="badge badge-accent mb-4">Our Story</span>
              <h2 className="section-heading mb-6">Built on Passion for Precision</h2>
              <div className="space-y-4 text-navy-600 dark:text-navy-300 leading-relaxed">
                <p>Infinyt3D was founded in 2014 with a simple but powerful mission: to make professional-grade 3D printing accessible to businesses and innovators in Goa and across India.</p>
                <p>What started as a small operation has grown into a comprehensive engineering solutions provider. Today, we operate a state-of-the-art facility in the Verna Industrial Estate, equipped with the latest FDM, SLA, and industrial 3D printing technologies.</p>
                <p>We are proud to be an <strong className="text-accent-500">Authorized Exclusive Creality Distributor</strong> for Goa, as well as an authorized reseller for Bambu Lab, Elegoo, Phrozen, Anycubic, and Flashforge.</p>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="grid grid-cols-2 gap-4">
                {galleryImages.map((img, index) => (
                  <div key={img.src} className={`relative overflow-hidden rounded-2xl ${index === 0 ? 'row-span-2' : ''}`}>
                    <img src={img.src} alt={img.label} className="w-full h-full object-cover min-h-[140px]"
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=400'; }} />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-900/80 to-transparent p-3">
                      <span className="text-white text-xs font-medium">{img.label}</span>
                    </div>
                  </div>
                ))}
              </div>
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -bottom-6 -right-6 bg-accent-500 text-white rounded-2xl p-4 shadow-lg">
                <div className="text-2xl font-bold">15+</div>
                <div className="text-xs">Years Experience</div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-navy-50 dark:bg-navy-950">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white dark:bg-navy-800 rounded-2xl p-8 border border-navy-100 dark:border-navy-700">
              <div className="w-12 h-12 rounded-xl bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-accent-500" />
              </div>
              <h3 className="text-2xl font-bold text-navy-900 dark:text-white mb-4">Our Mission</h3>
              <p className="text-navy-600 dark:text-navy-300 leading-relaxed">To democratize advanced manufacturing by providing world-class 3D printing, design engineering, and prototyping services that empower businesses of all sizes to innovate faster and more affordably.</p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-navy-900 to-navy-800 rounded-2xl p-8 text-white">
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center mb-6">
                <Star className="w-6 h-6 text-accent-400" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-navy-300 leading-relaxed">To be India's most trusted engineering solutions partner — known for precision, reliability, and innovation. We envision a future where every Indian manufacturer has access to the power of additive manufacturing.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-white dark:bg-navy-900">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge badge-accent mb-4">Our Values</span>
            <h2 className="section-heading">What Drives Us</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                className="group p-6 rounded-2xl bg-navy-50 dark:bg-navy-800 hover:bg-accent-50 dark:hover:bg-navy-700 transition-all duration-300 border border-navy-100 dark:border-navy-700">
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-navy-900 flex items-center justify-center mb-4 group-hover:bg-accent-500 transition-colors duration-300">
                  <value.icon className="w-6 h-6 text-accent-500 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 dark:text-white mb-2">{value.title}</h3>
                <p className="text-sm text-navy-500 dark:text-navy-400 leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="section-padding bg-gradient-to-b from-navy-900 to-navy-950 text-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">Our Journey</span>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-white">A Decade of Innovation</h2>
          </motion.div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-accent-500/20 md:-translate-x-px" />
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div key={milestone.year} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }}
                  className={`relative flex items-start gap-6 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} md:gap-12`}>
                  <div className={`flex-1 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <div className="bg-navy-800/50 border border-navy-700 rounded-2xl p-5 inline-block text-left">
                      <span className="text-accent-400 font-bold text-lg">{milestone.year}</span>
                      <h3 className="text-white font-semibold mt-1 mb-1">{milestone.title}</h3>
                      <p className="text-navy-400 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 rounded-full bg-accent-500 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="section-padding bg-white dark:bg-navy-900">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <span className="badge badge-accent mb-4">Certifications</span>
            <h2 className="section-heading">Authorized Partnerships</h2>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4">
            {certifications.map((cert, i) => (
              <motion.div key={cert} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 px-6 py-3 bg-navy-50 dark:bg-navy-800 rounded-full border border-navy-200 dark:border-navy-700">
                <Award className="w-4 h-4 text-accent-500" />
                <span className="font-medium text-navy-700 dark:text-navy-200 text-sm">{cert}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-accent-500 to-accent-600 text-white">
        <div className="container-custom text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-bold mb-4">Ready to Work With Us?</h2>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto text-lg">Let's bring your ideas to life. Get in touch for a free consultation.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-accent-600 rounded-xl font-semibold hover:bg-navy-50 transition-colors">
                Get a Free Quote <ArrowRight className="w-5 h-5" />
              </Link>
              <Link to="/services" className="inline-flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white rounded-xl font-semibold hover:bg-white/20 transition-colors">
                Our Services
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
