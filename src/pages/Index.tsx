
import BenefitsSection from '@/components/BenefitsSection';
import CallToAction from '@/components/CallToAction';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import OptionsSection from '@/components/OptionsSection';
import TestimonialSection from '@/components/TestimonialSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main>
        <Hero />
        <OptionsSection />
        <BenefitsSection />
        <TestimonialSection />
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
