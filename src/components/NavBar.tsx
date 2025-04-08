
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from './ui/button';

const NavBar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="py-4 px-6 sm:px-8 lg:px-12 w-full bg-background/80 backdrop-blur-sm fixed top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <a href="/" className="flex items-center gap-2">
          <span className="text-recipe-sage font-bold text-2xl font-serif">Zestful</span>
          <span className="hidden sm:inline-block text-foreground font-medium">Kitchen</span>
        </a>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-6">
          <a href="#" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Recipes</a>
          <a href="#" className="font-medium text-muted-foreground hover:text-foreground transition-colors">Meal Plans</a>
          <a href="#" className="font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
          <Button className="bg-recipe-sage hover:bg-recipe-sage/90 btn-hover">Sign In</Button>
        </div>

        {/* Mobile menu button */}
        <Button 
          variant="outline" 
          size="icon" 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg rounded-b-lg p-4 animate-fade-in">
          <div className="flex flex-col gap-3">
            <a href="#" className="font-medium p-3 rounded-md hover:bg-muted transition-colors">Recipes</a>
            <a href="#" className="font-medium p-3 rounded-md hover:bg-muted transition-colors">Meal Plans</a>
            <a href="#" className="font-medium p-3 rounded-md hover:bg-muted transition-colors">About</a>
            <Button className="mt-2 bg-recipe-sage hover:bg-recipe-sage/90 btn-hover">Sign In</Button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
