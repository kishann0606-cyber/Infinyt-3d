import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Heart, Eye, GitCompare, Share2, MessageSquare, ArrowRight, BadgeCheck } from 'lucide-react';
import type { Product } from '../../types';
import { cn, formatPrice } from '../../lib/utils';
import { getFeaturedProducts, type Product as SupabaseProduct } from '../../lib/supabase';

function convertProduct(p: SupabaseProduct): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brand: p.brand,
    category: p.category || '',
    technology: p.technology || '',
    buildVolume: p.build_volume || '',
    layerResolution: p.layer_resolution || '',
    price: Number(p.price) || 0,
    image: p.image_url || '',
    images: p.images || [],
    badges: p.badges || [],
    specifications: p.specifications || {},
    features: p.features || [],
    description: p.description || '',
    shortDescription: p.short_description || '',
    downloads: p.downloads || [],
    warranty: p.warranty || '',
    relatedProducts: p.related_products || [],
    faqs: p.faqs || [],
    inStock: p.in_stock,
    featured: p.featured,
  };
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <div className="relative bg-white dark:bg-navy-800 rounded-2xl border border-navy-100 dark:border-navy-700 overflow-hidden hover:border-accent-500/30 transition-all duration-500 hover:shadow-card-hover">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-navy-50 dark:bg-navy-900">
          <Link to={`/products/${product.slug}`}>
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.6 }}
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </Link>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={cn(
                  'badge',
                  badge === 'New' ? 'badge-success' : badge === 'Best Seller' ? 'badge-accent' : 'badge-primary'
                )}
              >
                {badge}
              </span>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-white dark:bg-navy-800 shadow-soft hover:bg-accent-500 hover:text-white transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-white dark:bg-navy-800 shadow-soft hover:bg-accent-500 hover:text-white transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Stock Badge */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-navy-900/50 flex items-center justify-center">
              <span className="text-white font-medium">Out of Stock</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Brand & Technology */}
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-navy-500 dark:text-navy-400">{product.brand}</span>
            <span className="text-navy-300 dark:text-navy-600">|</span>
            <span className="text-xs text-navy-400 dark:text-navy-500">{product.technology}</span>
          </div>

          {/* Title */}
          <Link to={`/products/${product.slug}`}>
            <h3 className="text-lg font-semibold text-navy-900 dark:text-white hover:text-accent-500 transition-colors mb-2">
              {product.name}
            </h3>
          </Link>

          {/* Quick Specs */}
          <div className="flex flex-wrap gap-2 mb-4">
            {product.buildVolume && (
              <span className="text-xs px-2 py-1 rounded bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                {product.buildVolume}
              </span>
            )}
            {product.layerResolution && (
              <span className="text-xs px-2 py-1 rounded bg-navy-100 dark:bg-navy-700 text-navy-600 dark:text-navy-300">
                {product.layerResolution}
              </span>
            )}
          </div>

          {/* Price & CTA */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-2xl font-bold text-navy-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                <div className="flex items-center gap-1 text-xs text-navy-500 dark:text-navy-400 mt-0.5">
                  <BadgeCheck className="w-3 h-3 text-accent-500" />
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>
            </div>
            <Link
              to={`/contact?product=${encodeURIComponent(product.name)}&type=buy`}
              className="btn-accent w-full justify-center text-sm"
            >
              <MessageSquare className="w-4 h-4" />
              Write to Us / Buy
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const data = await getFeaturedProducts();
        setProducts(data.map(convertProduct));
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-navy-200 dark:bg-navy-700 rounded-2xl mb-4" />
                <div className="h-4 bg-navy-200 dark:bg-navy-700 rounded w-1/2 mb-2" />
                <div className="h-6 bg-navy-200 dark:bg-navy-700 rounded w-3/4 mb-4" />
                <div className="h-8 bg-navy-200 dark:bg-navy-700 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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
            <span className="badge badge-accent mb-4">Featured Products</span>
            <h2 className="section-heading">Best-in-Class Equipment</h2>
            <p className="section-subheading">
              Industry-leading 3D printers and scanners curated for professional workflows.
            </p>
          </div>
          <Link to="/products" className="btn-secondary self-start md:self-auto">
            View All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
