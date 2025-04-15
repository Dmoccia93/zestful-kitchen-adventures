
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRecipeInformation } from '@/services/spoonacularService';
import NavBar from '@/components/NavBar';
import Footer from '@/components/Footer';
import { Loader2, Clock, Users, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/hooks/use-toast';

interface Ingredient {
  id: number;
  name: string;
  amount: number;
  unit: string;
  image: string;
}

interface RecipeDetail {
  id: number;
  title: string;
  image: string;
  readyInMinutes: number;
  servings: number;
  summary: string;
  instructions: string;
  extendedIngredients: Ingredient[];
  sourceUrl: string;
}

const RecipeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<RecipeDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        const recipeId = parseInt(id);
        if (isNaN(recipeId)) {
          throw new Error('Invalid recipe ID');
        }
        
        const recipeData = await getRecipeInformation(recipeId);
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error fetching recipe details:', error);
        toast({
          title: 'Error',
          description: 'Failed to load recipe details. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto" />
            <p className="mt-4 text-lg text-muted-foreground">Loading recipe...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Recipe not found</h1>
            <Button onClick={() => navigate('/find-recipe')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipe Search
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow py-12 px-6 sm:px-8 lg:px-12 bg-background">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/find-recipe')}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Recipe Search
          </Button>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold">{recipe.title}</CardTitle>
              <CardDescription className="flex items-center gap-4 text-base">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" /> 
                  {recipe.readyInMinutes} minutes
                </span>
                <span className="flex items-center">
                  <Users className="mr-1 h-4 w-4" /> 
                  {recipe.servings} servings
                </span>
              </CardDescription>
            </CardHeader>
            
            {recipe.image && (
              <div className="px-6">
                <img
                  src={recipe.image}
                  alt={recipe.title}
                  className="w-full max-h-96 object-cover rounded-md"
                />
              </div>
            )}
            
            <CardContent className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                  <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                  <ul className="space-y-2">
                    {recipe.extendedIngredients?.map((ingredient) => (
                      <li key={ingredient.id} className="flex items-start gap-2">
                        <span className="text-sm">•</span>
                        <span>
                          {ingredient.amount} {ingredient.unit} {ingredient.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold mb-4">Instructions</h3>
                  <div 
                    dangerouslySetInnerHTML={{ __html: recipe.instructions }} 
                    className="prose max-w-none"
                  />
                  
                  {recipe.sourceUrl && (
                    <>
                      <Separator className="my-6" />
                      <p className="text-sm text-muted-foreground">
                        Recipe source: <a href={recipe.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{new URL(recipe.sourceUrl).hostname}</a>
                      </p>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetail;
