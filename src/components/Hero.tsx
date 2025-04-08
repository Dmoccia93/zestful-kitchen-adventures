
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section className="pt-28 pb-6 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-recipe-sage">
            Healthy eating made <span className="italic text-foreground">delightfully</span> easy
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 animate-fade-in [animation-delay:200ms]">
            Discover exciting recipes tailored to what you have or get personalized weekly meal plans. 
            No more meal-planning stress, just delicious cooking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
