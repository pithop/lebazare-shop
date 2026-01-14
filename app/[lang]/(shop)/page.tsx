import Link from 'next/link';
import Image from 'next/image';
import { getStaticProducts } from '@/lib/products';
import HeroCreative from '@/components/HeroCreative';
import AboutSection from '@/components/AboutSection';
import ValuesSection from '@/components/ValuesSection';
import CTASection from '@/components/CTASection';
import ReviewsShowcase from '@/components/ReviewsShowcase';
import { getTopReviews, getAverageRating, getTotalReviewCount } from '@/lib/reviews';
import { StoreSchema } from '@/components/seo/StoreSchema';

export const revalidate = 0; // Force dynamic rendering to ensure fresh data

export async function generateMetadata({ params }: { params: { lang: string } }) {
  return {
    alternates: {
      canonical: `/${params.lang}`,
    },
  };
}

export default async function Home() {
  // Fetch trending/featured products for the carousel and other sections
  // Fetching 5 products: 3 for Hero, 1 for About, 1 for CTA
  const products = await getStaticProducts(5);

  const heroProducts = products.slice(0, 3);
  const aboutProduct = products[3];
  const ctaProduct = products[4];

  // Fetch reviews for showcase
  const reviews = await getTopReviews(12);
  const averageRating = await getAverageRating();
  const totalCount = await getTotalReviewCount();

  return (
    <>
      <StoreSchema
        storeName="LeBazare"
        url="https://www.lebazare.fr"
        logoUrl="https://www.lebazare.fr/icon.png"
        description="Artisanat marocain authentique et décoration bohème chic."
        aggregateRating={{
          ratingValue: averageRating,
          reviewCount: totalCount
        }}
      />
      <HeroCreative products={heroProducts} />
      <AboutSection product={aboutProduct} />
      <ValuesSection />
      <ReviewsShowcase
        reviews={reviews}
        averageRating={averageRating}
        totalCount={totalCount}
      />
      <CTASection product={ctaProduct} />
    </>
  );
}

