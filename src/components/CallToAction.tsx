
import { Button } from './ui/button';

const CallToAction = () => {
  return (
    <section className="py-16 px-6 sm:px-8 lg:px-12 bg-gradient-to-r from-recipe-mint to-recipe-cream">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">
          Ready to Transform Your Meals?
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Join thousands of home cooks who have simplified meal planning and discovered delicious new recipes.
        </p>
        <Button className="bg-recipe-sage hover:bg-recipe-sage/90 text-white px-8 py-6 text-lg btn-hover">
          Get Started — It's Free
        </Button>
      </div>
    </section>
  );
};

export default CallToAction;
