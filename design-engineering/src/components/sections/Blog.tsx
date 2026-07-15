import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, User } from 'lucide-react';
import { blogPosts } from '../../data/products';
import { formatDate } from '../../lib/utils';

export function BlogPreview() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="section-padding">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
        >
          <div>
            <span className="badge badge-accent mb-4">Latest Insights</span>
            <h2 className="section-heading">From Our Blog</h2>
            <p className="section-subheading">
              Expert insights, tutorials, and industry news from our engineering team.
            </p>
          </div>
          <Link to="/blog" className="btn-secondary self-start md:self-auto whitespace-nowrap flex items-center gap-2">
            View All Posts
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="h-full flex flex-col rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-500 hover:shadow-card-hover overflow-hidden">
                {/* Image */}
                <div className="relative aspect-video overflow-hidden bg-navy-100 dark:bg-navy-700">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-600"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800';
                    }}
                  />
                  {post.featured && (
                    <div className="absolute top-3 left-3">
                      <span className="badge badge-accent">Featured</span>
                    </div>
                  )}
                  <div className="absolute top-3 right-3">
                    <span className="badge badge-primary text-xs">{post.category}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5 lg:p-6">
                  <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {post.readingTime} min read
                    </span>
                    <span>·</span>
                    <span>{formatDate(post.publishedAt)}</span>
                  </div>

                  <h3 className="font-bold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors mb-2 line-clamp-2 text-lg leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-sm text-navy-500 dark:text-navy-400 line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  {/* Author */}
                  <div className="flex items-center justify-between pt-4 border-t border-navy-100 dark:border-navy-700">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center overflow-hidden">
                        <img
                          src={post.author.avatar}
                          alt={post.author.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const t = e.target as HTMLImageElement;
                            t.style.display = 'none';
                            t.parentElement!.innerHTML = `<span class="text-xs font-bold text-accent-600">${post.author.name.charAt(0)}</span>`;
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium text-navy-700 dark:text-navy-300">{post.author.name}</span>
                    </div>
                    <Link
                      to="/blog"
                      className="text-xs font-medium text-accent-500 hover:text-accent-600 flex items-center gap-1 transition-colors"
                    >
                      Read more <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
