
import { Calendar, Search } from 'lucide-react';
import OptionCard from './OptionCard';

const OptionsSection = () => {
  return (
    <section className="py-0 px-6 sm:px-8 lg:px-12 bg-background">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground">
          Choose Your Culinary Adventure
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <OptionCard 
            title="Find a recipe with what's in your fridge"
            description="Input your available ingredients and discover delicious recipes you can make right now. No more wasted food or last-minute grocery runs."
            imageSrc="/lovable-uploads/1e3a1eeb-ae11-448c-996d-24d07bc318c0.png" 
            colorClass="bg-recipe-mint"
            buttonText="Find Recipes"
            icon={<Search className="w-5 h-5" />}
            imagePosition="top"
          />
          
          <OptionCard 
            title="Get weekly recipes tailored to your goals"
            description="Receive personalized weekly meal plans based on your dietary preferences, health goals, and cooking skill level. Plan ahead and eat better."
            imageSrc="https://images.unsplash.com/photo-1543352634-99a5d50ae78e"
            colorClass="bg-recipe-cream"
            buttonText="Get Meal Plan"
            icon={<Calendar className="w-5 h-5" />}
            imagePosition="top"
          />
        </div>
      </div>
    </section>
  );
};

export default OptionsSection;
