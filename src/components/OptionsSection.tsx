
import { Calendar, Search } from 'lucide-react';
import OptionCard from './OptionCard';

const OptionsSection = () => {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-b from-background to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-foreground">
          Choose Your Culinary Adventure
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          <OptionCard 
            title="Find a recipe with what's in your fridge"
            description="Input your available ingredients and discover delicious recipes you can make right now. No more wasted food or last-minute grocery runs."
            imageSrc="/lovable-uploads/f3bb28d9-013f-4518-a209-17cc761cf7d3.png" 
            colorClass="bg-recipe-mint"
            buttonText="Find Recipes"
            icon={<Search className="w-5 h-5" />}
          />
          
          <OptionCard 
            title="Get weekly recipes tailored to your goals"
            description="Receive personalized weekly meal plans based on your dietary preferences, health goals, and cooking skill level. Plan ahead and eat better."
            imageSrc="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            colorClass="bg-recipe-cream"
            buttonText="Get Meal Plan"
            icon={<Calendar className="w-5 h-5" />}
          />
        </div>
      </div>
    </section>
  );
};

export default OptionsSection;
