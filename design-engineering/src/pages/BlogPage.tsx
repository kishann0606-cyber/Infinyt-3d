import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, User, X, Tag, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '../data/products';
import { formatDate } from '../lib/utils';

const fullContent: Record<string, string> = {
  'future-additive-manufacturing-aerospace': `
Additive manufacturing — more commonly known as 3D printing — has been quietly revolutionizing the aerospace industry for over a decade. But in recent years, the pace of change has accelerated dramatically.

## Lighter Components, Stronger Structures

Traditional subtractive manufacturing methods often waste 80–90% of raw material when machining aerospace-grade metals like titanium. Additive manufacturing flips this equation — building components layer by layer means near-zero waste and allows for complex internal geometries that are impossible to machine.

Engineers can now design lattice structures — intricate internal networks that provide structural strength at a fraction of the weight. GE Aviation's famous LEAP engine fuel nozzle, for instance, is 25% lighter and 5x more durable than its machined predecessor — and it's made by 3D printing.

## Reducing Lead Times from Months to Days

In aerospace, tooling and fixture lead times are notoriously long. Custom jigs, fixtures, inspection gauges — these once took months to manufacture. With 3D printing, aerospace OEMs and MRO facilities can produce the same tools in days.

At Infinyt3D, we regularly help our aerospace clients produce replacement jigs and tooling aids on-demand, dramatically reducing downtime in their manufacturing lines.

## What's Next?

The future points toward in-space manufacturing, bio-inspired designs, and multi-material printing. As software and materials science advance together, the boundary between what can be imagined and what can be manufactured continues to shrink.

For manufacturers and engineers, the message is clear: additive manufacturing is no longer a prototyping technology. It's a production technology — and aerospace is leading the way.
  `,
  'choosing-right-material-3d-printing': `
One of the most common questions we hear at Infinyt3D is: "What material should I use for my project?" The answer depends on several key factors — mechanical requirements, operating environment, aesthetics, and budget. Here's our comprehensive guide.

## PLA — The Starting Point

Polylactic Acid (PLA) is the most popular FDM filament for good reason. It's easy to print, biodegradable, dimensionally stable, and comes in hundreds of colors. It's ideal for display models, educational parts, and prototypes that won't experience stress or heat.

**Best for:** Concept models, display parts, gifts, low-stress prototypes.
**Avoid for:** Outdoor use, high temperatures (above 60°C), functional mechanical parts.

## PETG — The Versatile Workhorse

PETG combines the printability of PLA with improved mechanical strength and chemical resistance. It's slightly flexible, impact resistant, and can handle temperatures up to 80°C. It's our go-to recommendation for functional parts that need some toughness.

**Best for:** Mechanical housings, brackets, food-safe containers, outdoor parts.
**Avoid for:** Ultra-precise fits (slight hygroscopic tendency causes minor dimensional changes).

## ABS — The Engineering Classic

Acrylonitrile Butadiene Styrene (ABS) has been the engineering plastic of choice for decades. It's strong, heat resistant (up to 105°C), and can be post-processed with acetone for an ultra-smooth finish. However, it requires careful printing conditions — enclosed printer, heated bed, no drafts.

**Best for:** Automotive parts, electrical enclosures, high-temp environments.
**Avoid for:** Open-frame printers, beginner users.

## Nylon — High Performance Engineering

Nylon (PA6, PA12) offers exceptional strength-to-weight ratio, excellent wear resistance, and low friction. It's the material of choice for gears, bearings, and industrial components. Its one drawback is hygroscopicity — it must be dried before printing and stored carefully.

**Best for:** Gears, bearings, snap-fits, structural parts.
**Avoid for:** Budget builds — it requires a quality printer with a heated enclosure.

## TPU — When You Need Flex

Thermoplastic Polyurethane (TPU) is the rubber of 3D printing. It's highly flexible, abrasion resistant, and can be stretched significantly without breaking. Used for phone cases, gaskets, flexible joints, and wearables.

**Best for:** Phone cases, gaskets, flexible hinges, tires.
**Avoid for:** Hard structural parts.

## Our Recommendation

At Infinyt3D, we always start with a conversation about your end-use requirements before recommending a material. Contact our team for a free material consultation.
  `,
  'reverse-engineering-scan-to-cad': `
Reverse engineering — the process of taking a physical object and recreating it as a digital CAD model — is one of the most powerful services we offer at Infinyt3D. Here's a step-by-step walkthrough of our process.

## Step 1: Understanding the Goal

Before any scanning begins, we need to understand what you need the digital model for. Is it for:
- Reproducing a discontinued part?
- Modifying an existing design?
- Quality inspection against a nominal model?
- Creating interchangeable spares?

The end goal determines the approach, tolerances required, and deliverables.

## Step 2: 3D Scanning

We use professional structured-light and laser line scanning systems to capture the object's geometry. For most parts, we achieve accuracy in the range of 0.02–0.05mm.

The scan generates a dense point cloud — millions of data points representing the object's surface. For complex or large parts, we capture multiple scans and align them into a single unified dataset.

## Step 3: Mesh Processing

The raw point cloud is converted into a polygon mesh (STL/OBJ format). This involves:
- Noise reduction and outlier removal
- Hole filling for areas occluded during scanning
- Surface smoothing
- Feature alignment

At this stage, the mesh is an accurate digital replica of the physical object — but it's not yet a CAD model.

## Step 4: CAD Reconstruction

Here's where the real engineering happens. Using the mesh as a reference, we create a parametric CAD model in your preferred format (STEP, IGES, SolidWorks, Fusion 360, etc.).

For prismatic parts (with flat faces, cylinders, holes), we extract dimensions and reconstruct using standard CAD features. For organic or freeform shapes, we use surface modeling or direct mesh-to-NURBS conversion.

## Step 5: Validation

Before delivery, we compare the CAD model to the original scan using deviation analysis. Any areas with error beyond tolerance are refined. We deliver the model with a full inspection report showing deviation maps.

## Ready to Get Started?

If you have a part that needs to be digitized, contact our team with photos and dimensions. We'll give you a quote within 24 hours.
  `,
};

export function BlogPage() {
  const [selectedPost, setSelectedPost] = useState<typeof blogPosts[0] | null>(null);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <section className="py-12 lg:py-16 bg-gradient-to-br from-navy-900 to-navy-800 text-white">
        <div className="container-custom">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Link to="/" className="inline-flex items-center gap-2 text-navy-400 hover:text-accent-400 transition-colors mb-6 text-sm">
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <span className="badge bg-accent-500/20 text-accent-400 border border-accent-500/30 mb-4">Blog & Insights</span>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-white mb-4">
              Engineering Insights & News
            </h1>
            <p className="text-navy-300 text-lg max-w-2xl">
              Expert knowledge, tutorials, and industry trends from our engineering team.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group cursor-pointer"
                onClick={() => setSelectedPost(post)}
              >
                <div className="h-full flex flex-col rounded-2xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 hover:border-accent-500/30 transition-all duration-500 hover:shadow-xl overflow-hidden">
                  <div className="relative aspect-video overflow-hidden bg-navy-100 dark:bg-navy-700">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800';
                      }}
                    />
                    <div className="absolute top-3 right-3">
                      <span className="badge badge-primary text-xs">{post.category}</span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-1 p-5 lg:p-6">
                    <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400 mb-3">
                      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readingTime} min read</span>
                      <span>·</span>
                      <span>{formatDate(post.publishedAt)}</span>
                    </div>

                    <h3 className="font-bold text-navy-900 dark:text-white group-hover:text-accent-500 transition-colors mb-2 line-clamp-2 text-lg leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-sm text-navy-500 dark:text-navy-400 line-clamp-3 mb-4 flex-1">
                      {post.excerpt}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-xs px-2 py-1 bg-navy-100 dark:bg-navy-700 text-navy-500 dark:text-navy-400 rounded-full">
                          <Tag className="w-2.5 h-2.5" />{tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-navy-100 dark:border-navy-700">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-accent-100 dark:bg-accent-500/20 flex items-center justify-center">
                          <span className="text-xs font-bold text-accent-600">{post.author.name.charAt(0)}</span>
                        </div>
                        <span className="text-xs font-medium text-navy-700 dark:text-navy-300">{post.author.name}</span>
                      </div>
                      <button className="text-xs font-medium text-accent-500 hover:text-accent-600 transition-colors">
                        Read more →
                      </button>
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Post Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto"
            onClick={() => setSelectedPost(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-navy-800 rounded-2xl w-full max-w-3xl my-8 overflow-hidden shadow-2xl"
            >
              {/* Hero Image */}
              <div className="relative aspect-video">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg?auto=compress&cs=tinysrgb&w=800';
                  }}
                />
                <button
                  onClick={() => setSelectedPost(null)}
                  className="absolute top-4 right-4 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                  <span className="badge bg-accent-500 text-white text-xs mb-2">{selectedPost.category}</span>
                  <h1 className="text-2xl font-bold text-white">{selectedPost.title}</h1>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-navy-500 dark:text-navy-400 mb-6 pb-6 border-b border-navy-100 dark:border-navy-700">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedPost.author.name} · {selectedPost.author.role}
                  </span>
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(selectedPost.publishedAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {selectedPost.readingTime} min read
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedPost.tags.map((tag) => (
                    <span key={tag} className="text-xs px-3 py-1 bg-accent-100 dark:bg-accent-500/20 text-accent-600 dark:text-accent-400 rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Article Content */}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  {(fullContent[selectedPost.slug] || selectedPost.excerpt).split('\n').map((para, i) => {
                    if (para.startsWith('## ')) {
                      return <h2 key={i} className="text-xl font-bold text-navy-900 dark:text-white mt-6 mb-3">{para.replace('## ', '')}</h2>;
                    }
                    if (para.startsWith('**') && para.endsWith('**')) {
                      return <p key={i} className="font-semibold text-navy-800 dark:text-navy-200 mt-4 mb-1">{para.replace(/\*\*/g, '')}</p>;
                    }
                    if (para.trim() === '') return null;
                    return <p key={i} className="text-navy-600 dark:text-navy-300 leading-relaxed mb-4">{para}</p>;
                  })}
                </div>

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-navy-100 dark:border-navy-700">
                  <div className="bg-gradient-to-r from-accent-50 to-navy-50 dark:from-accent-500/10 dark:to-navy-900 rounded-xl p-5">
                    <p className="font-semibold text-navy-900 dark:text-white mb-2">Ready to start your project?</p>
                    <p className="text-sm text-navy-600 dark:text-navy-400 mb-4">Get expert guidance and a free consultation from our engineering team.</p>
                    <Link
                      to="/contact"
                      onClick={() => setSelectedPost(null)}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent-500 hover:bg-accent-600 text-white rounded-lg font-medium transition-colors text-sm"
                    >
                      Get a Free Quote
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
