
import React, { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { IngredientsInput } from '../components/recipe/IngredientsInput';
import { RecipesContainer } from '../components/recipe/RecipesContainer';

const WEBHOOK_URL = 'http://localhost:5678/webhook/generate-recipes';

const FindRecipe: React.FC = () => {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
  const [rawResponse, setRawResponse] = useState<string>('');
  const [recipe1Content, setRecipe1Content] = useState<any>({});
  const [recipe2Content, setRecipe2Content] = useState<any>({});
  const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

  useEffect(() => {
    if (rawResponse) {
      try {
        const responseData = JSON.parse(rawResponse);
        setRecipe1Content(responseData.recipe1 || {});
        setRecipe2Content(responseData.recipe2 || {});
      } catch (error) {
        console.error("Error parsing JSON response:", error);
        setRecipe1Content({});
        setRecipe2Content({});
      }
    }
  }, [rawResponse]);

  const handleIngredientChange = (index: number, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const handleGenerateRecipes = async () => {
    setIsGeneratingRecipes(true);
    const validIngredients = ingredients.filter(ing => ing.trim() !== '');

    if (validIngredients.length === 0) {
      toast({
        title: "Error",
        description: "Please enter at least one ingredient",
        variant: "destructive",
      });
      setIsGeneratingRecipes(false);
      return;
    }

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients: validIngredients
        }),
      });

      if (response.ok) {
        const responseText = await response.text();
        setRawResponse(responseText);
        toast({
          title: "Success",
          description: "Recipes generated successfully!",
        });
      } else {
        toast({
          title: "Error",
          description: `Failed to get recipes: ${response.status}`,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error calling webhook:", error);
      toast({
        title: "Error",
        description: "Failed to connect to webhook",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingRecipes(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find Recipes</h1>

      <IngredientsInput
        ingredients={ingredients}
        onIngredientChange={handleIngredientChange}
        onAddIngredient={() => setIngredients([...ingredients, ''])}
        onGenerateRecipes={handleGenerateRecipes}
        isGenerating={isGeneratingRecipes}
      />

      <RecipesContainer
        recipe1Content={recipe1Content}
        recipe2Content={recipe2Content}
        onRecipeSelect={setSelectedRecipe}
      />

      {selectedRecipe && (
        <div className="mt-8">
          {selectedRecipe === 'recipe1' && recipe1Content && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{recipe1Content.recipeName}</h2>
              {recipe1Content.image && (
                <img src={recipe1Content.image} alt="Recipe 1" className="w-full h-48 object-cover mb-4" />
              )}
              <p>{recipe1Content.instructions}</p>
              <Button onClick={() => setSelectedRecipe(null)} className="mt-2">
                Back to Recipes
              </Button>
            </div>
          )}

          {selectedRecipe === 'recipe2' && recipe2Content && (
            <div>
              <h2 className="text-2xl font-bold mb-4">{recipe2Content.recipeName}</h2>
              {recipe2Content.image && (
                <img src={recipe2Content.image} alt="Recipe 2" className="w-full h-48 object-cover mb-4" />
              )}
              <p>{recipe2Content.instructions}</p>
              <Button onClick={() => setSelectedRecipe(null)} className="mt-2">
                Back to Recipes
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FindRecipe;
