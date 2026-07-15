import { Hero } from '../components/sections/Hero';
import { TrustedBrands } from '../components/sections/TrustedBrands';
import { Categories } from '../components/sections/Categories';
import { FeaturedProducts } from '../components/sections/ProductCard';
import { Services } from '../components/sections/Services';
import { MaterialsPreview } from '../components/sections/Materials';
import { Industries } from '../components/sections/Industries';
import { Portfolio } from '../components/sections/Portfolio';
import { WorkshopGallery } from '../components/sections/WorkshopGallery';
import { WhyChooseUs, Stats } from '../components/sections/WhyChooseUs';
import { Testimonials } from '../components/sections/Testimonials';
import { GoogleReviews } from '../components/sections/GoogleReviews';
import { BlogPreview } from '../components/sections/Blog';
import { FAQ } from '../components/sections/FAQ';
import { ContactSection } from '../components/sections/Contact';

export function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Services />
      <MaterialsPreview />
      <Industries />
      <Portfolio />
      <WorkshopGallery />
      <WhyChooseUs />
      <Stats />
      <TrustedBrands />
      <Testimonials />
      <GoogleReviews />
      <BlogPreview />
      <FAQ />
      <ContactSection />
    </>
  );
}
