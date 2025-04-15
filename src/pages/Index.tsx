
import BenefitsSection from '@/components/BenefitsSection';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import NavBar from '@/components/NavBar';
import OptionsSection from '@/components/OptionsSection';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main>
        <Hero />
        <OptionsSection />
        <BenefitsSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
