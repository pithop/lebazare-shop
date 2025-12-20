import Link from 'next/link';
import Image from 'next/image';
import { getStaticProducts } from '@/lib/products';
import HeroCreative from '@/components/HeroCreative';
import AboutSection from '@/components/AboutSection';
import ValuesSection from '@/components/ValuesSection';
import CTASection from '@/components/CTASection';

export default async function Home() {
  // Fetch trending/featured products for the carousel and other sections
  // Fetching 5 products: 3 for Hero, 1 for About, 1 for CTA
  const products = await getStaticProducts(5);

  const heroProducts = products.slice(0, 3);
  const aboutProduct = products[3];
  const ctaProduct = products[4];

  return (
    <>
      <HeroCreative products={heroProducts} />
      <AboutSection product={aboutProduct} />
      <ValuesSection />
      <CTASection product={ctaProduct} />
    </>
  );
}
