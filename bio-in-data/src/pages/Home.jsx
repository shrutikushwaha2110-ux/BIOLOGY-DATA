import Hero from "../components/Hero";
import CategorySection from "../components/CategorySection";
import FeaturedSection from "../components/FeaturedSection";
import SubscribeSection from "../components/SubscribeSection";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <FeaturedSection />
      <SubscribeSection />
      <Footer />
    </>
  );
}
