
import { Button } from './ui/button';

const Hero = () => {
  return (
    <section className="pt-16 pb-0 px-6 sm:px-8 lg:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-recipe-sage">
          Tired of eating  <span className="italic font-serif"> always the same stuff? </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mb-12">
            Get started today with an exciting recipe tailored to what you have in your fridge or get personalized
            weekly meal plans. No more meal-planning stress, just delicious
            cooking.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
