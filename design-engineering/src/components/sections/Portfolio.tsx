import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { portfolioProjects } from '../../data/products';

const projectStats = [
  { value: '200+', label: 'Projects Completed' },
  { value: '98%', label: 'Client Satisfaction' },
  { value: '24hrs', label: 'Avg Response Time' },
  { value: '50+', label: 'Industries Served' },
];

export function Portfolio() {
  return (
    <section className="section-padding bg-gradient-to-b from-white to-navy-50 dark:from-navy-900 dark:to-navy-950">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="badge badge-accent mb-4">Our Projects</span>
          <h2 className="section-heading">Recent Work</h2>
          <p className="section-subheading mx-auto">
            See how we've helped businesses across industries bring their ideas to life.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12"
        >
          {projectStats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
            >
              <p className="text-2xl md:text-3xl font-bold text-accent-500">{stat.value}</p>
              <p className="text-xs md:text-sm text-navy-500 dark:text-navy-400">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Projects - Horizontal Scroll on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {portfolioProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-500 hover:shadow-xl">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.6 }}
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900/90 via-navy-900/30 to-transparent" />

                  {/* Overlay Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-accent-500 text-white font-medium">
                      {project.industry}
                    </span>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-xs text-white/80 bg-navy-900/50 px-2 py-1 rounded-full">
                    <Clock className="w-3 h-3" />
                    {project.duration}
                  </div>

                  {/* Bottom Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-lg font-semibold text-white mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm text-white/70">{project.client}</p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-navy-500 dark:text-navy-400 mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Results */}
                  {project.results.length > 0 && (
                    <div className="space-y-2">
                      {project.results.slice(0, 2).map((result) => (
                        <div key={result} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-xs text-navy-600 dark:text-navy-300">{result}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div className="inline-flex flex-col sm:flex-row gap-4 items-center">
            <Link
              to="/contact"
              className="btn-accent"
            >
              <Briefcase className="w-4 h-4" />
              Start Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
