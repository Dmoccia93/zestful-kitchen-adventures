
import { Check } from 'lucide-react';

const benefits = [
  {
    title: "Save Time & Money",
    description: "Stop wasting ingredients and get recipes based on what you already have."
  },
  {
    title: "Eat Healthier, Effortlessly",
    description: "Nutritious recipes that taste amazing, without the endless decision fatigue."
  },
  {
    title: "Reduce Food Waste",
    description: "Use what's in your fridge before it spoils with perfectly matched recipes."
  },
  {
    title: "Discover New Favorites",
    description: "Expand your culinary horizons with exciting new recipes tailored to your taste."
  }
];

const BenefitsSection = () => {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-recipe-sage text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
          Why Choose Zestful Kitchen?
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index} 
              className="flex flex-col items-start p-6 bg-white/10 backdrop-blur-sm rounded-xl animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-white text-recipe-sage p-2 rounded-full mb-4">
                <Check className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">{benefit.title}</h3>
              <p className="text-white/90">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
