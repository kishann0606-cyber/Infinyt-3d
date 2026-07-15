import { motion } from 'framer-motion';
import { Star, ExternalLink } from 'lucide-react';

const reviews = [
  {
    id: '1',
    image: '/images/feedback/feedbck1.png',
    author: 'beyond travel',
    role: 'Local Guide · 92 reviews · 37 photos',
    timeAgo: '6 months ago',
    rating: 5,
    text: 'This place is an innovative centre for opportunists. It is driven by a very positive gentleman called Ryan. He is very welcoming in his approach, listens to what you have to say. He works with a lot of schools and he know what he is doing.',
  },
  {
    id: '2',
    image: '/images/feedback/fdbck2.png',
    author: 'Ranjit Desai',
    role: 'Local Guide · 18 reviews · 2 photos',
    timeAgo: '11 months ago',
    rating: 5,
    text: 'The only genuine 3D printing service in South Goa. Good quality 3D products of desired size and durable nature. Appropriate for current technological advancements and will evolve better over time as technology improves globally.',
  },
  {
    id: '3',
    image: '/images/feedback/fdbck3.png',
    author: 'James Peter',
    role: 'Local Guide · 17 reviews · 3 photos',
    timeAgo: 'a year ago',
    rating: 5,
    text: 'I want to express my deep gratitude and appreciation to Infinyt3D Pvt. Ltd. for going above and beyond to help me restore an electronic wall clock that has immense sentimental value.',
  },
  {
    id: '4',
    image: '/images/feedback/fdbck4.png',
    author: 'Dipakk Polekar',
    role: 'Local Guide · 4 reviews · 122 photos',
    timeAgo: '4 years ago',
    rating: 5,
    text: 'While shooting in Goa, one of my camera accessory broke down accidentally! It was imported part so there was no chance that it will get available immediately. I was worried and while searching on Google, I found Infinyt 3D printing company.',
  },
];

export function GoogleReviews() {
  return (
    <section className="section-padding bg-navy-950 dark:bg-navy-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#4285F4]/10 border border-[#4285F4]/20 rounded-full px-5 py-2 mb-5">
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-sm font-medium text-white">Google Reviews</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2 mb-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            ))}
          </div>
          <p className="text-navy-300 text-lg">
            Rated <span className="text-white font-bold">5.0</span> on Google — Goa's most trusted 3D printing service
          </p>
        </motion.div>

        {/* Reviews Grid — screenshots as the card content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 hover:border-accent-500/40 transition-all duration-500 hover:shadow-[0_0_40px_rgba(220,38,38,0.15)] cursor-pointer">
                {/* Screenshot */}
                <div className="relative overflow-hidden">
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.4 }}
                    src={review.image}
                    alt={`Review by ${review.author}`}
                    className="w-full h-auto block"
                    loading="lazy"
                  />
                  {/* Overlay gradient at bottom */}
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                {/* Bottom strip */}
                <div className="bg-navy-900/90 px-5 py-3 flex items-center justify-between border-t border-white/5">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    ))}
                    <span className="text-white/60 text-xs ml-1">· {review.timeAgo}</span>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-white/30 group-hover:text-accent-400 transition-colors" />
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
          <p className="text-navy-400 text-sm mb-4">Join hundreds of satisfied customers across Goa and India</p>
          <a
            href="https://www.google.com/search?q=Infinyt+3D+Goa+reviews"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-[#4285F4] hover:text-white border border-[#4285F4]/30 hover:border-[#4285F4] rounded-full px-6 py-2.5 transition-all duration-300"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Read all reviews on Google
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
