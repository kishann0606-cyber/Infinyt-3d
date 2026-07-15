import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, Grid3X3, List, ArrowRight, Loader2, GitCompare } from 'lucide-react';
import { getProducts, getCategories, type Product, type Category as SupabaseCategory } from '../lib/supabase';
import { ProductCard } from '../components/sections/ProductCard';
import { cn } from '../lib/utils';
import type { Product as LocalProduct, Category } from '../types';

function convertProduct(p: Product): LocalProduct {
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

function convertCategory(c: SupabaseCategory): Category {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    description: c.description || '',
    icon: c.icon || '',
    image: c.image_url || '',
    productCount: c.product_count || 0,
  };
}

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState<LocalProduct[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBrand, setSelectedBrand] = useState('all');

  // Read category from URL param — this is set by clicking category cards on the homepage
  const selectedCategory = searchParams.get('category') || 'all';

  const setSelectedCategory = (cat: string) => {
    if (cat === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', cat);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const brands = [...new Set(products.map(p => p.brand))].sort();

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories(),
        ]);
        setProducts(productsData.map(convertProduct));
        setCategories(categoriesData.map(convertCategory));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    return matchesSearch && matchesCategory && matchesBrand;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    return 0;
  });

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <h1 className="text-display-lg font-display font-bold text-navy-900 dark:text-white mb-4">
                Products
              </h1>
              <p className="text-lg text-navy-500 dark:text-navy-400 max-w-2xl">
                Discover our curated selection of professional 3D printers, scanners, and engineering materials.
              </p>
            </div>
            <Link
              to="/contact?type=compare"
              className="btn-secondary self-start whitespace-nowrap"
            >
              <GitCompare className="w-4 h-4" />
              Compare Products
            </Link>
          </div>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between mb-8 p-4 rounded-xl bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700"
        >
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-navy-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-navy-50 dark:bg-navy-900 rounded-lg border border-navy-100 dark:border-navy-700 focus:outline-none focus:ring-2 focus:ring-accent-500/30 focus:border-accent-500"
            />
          </div>

          {/* Category & Brand Filter */}
          <div className="flex flex-wrap gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 rounded-lg bg-navy-50 dark:bg-navy-900 border border-navy-100 dark:border-navy-700 text-sm focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="px-4 py-2 rounded-lg bg-navy-50 dark:bg-navy-900 border border-navy-100 dark:border-navy-700 text-sm focus:outline-none"
            >
              <option value="all">All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Sort & View */}
          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 rounded-lg bg-navy-50 dark:bg-navy-900 border border-navy-100 dark:border-navy-700 text-sm focus:outline-none"
            >
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
            <div className="flex rounded-lg overflow-hidden border border-navy-200 dark:border-navy-700">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'grid'
                    ? 'bg-navy-900 dark:bg-navy-600 text-white'
                    : 'bg-white dark:bg-navy-800 text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-700'
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 transition-colors',
                  viewMode === 'list'
                    ? 'bg-navy-900 dark:bg-navy-600 text-white'
                    : 'bg-white dark:bg-navy-800 text-navy-400 hover:bg-navy-50 dark:hover:bg-navy-700'
                )}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-navy-500 dark:text-navy-400">
            Showing <span className="font-medium text-navy-900 dark:text-white">{filteredProducts.length}</span> products
          </p>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className={cn(
            'grid gap-6',
            viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
          )}>
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-navy-500 dark:text-navy-400 mb-4">No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedBrand('all');
              }}
              className="btn-secondary"
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center p-8 lg:p-12 rounded-2xl bg-gradient-to-r from-navy-900 to-navy-800 text-white"
        >
          <h3 className="text-2xl font-bold mb-2">Can't find what you're looking for?</h3>
          <p className="text-navy-300 mb-6">Contact us for custom orders, special requests, or bulk pricing.</p>
          <Link to="/contact" className="btn-accent">
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
