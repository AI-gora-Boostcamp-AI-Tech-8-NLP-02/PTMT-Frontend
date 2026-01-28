import { Footer, Header } from "@/components/layout";
import FeatureSection from "./components/FeatureSection";
import HeroSection from "./components/HeroSection";
import StepSection from "./components/StepSection";

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='grow'>
        <HeroSection />
        <StepSection />
        <FeatureSection />
      </main>
      <Footer />
    </div>
  );
}
