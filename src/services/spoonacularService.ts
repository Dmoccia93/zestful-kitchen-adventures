
import { toast } from "@/hooks/use-toast";

const API_KEY = "e228c36f226941a586718069ecdae81b";
const BASE_URL = "https://api.spoonacular.com";

/**
 * Search for ingredients by query string
 */
export const searchIngredients = async (query: string): Promise<any[]> => {
  if (!query || query.trim().length < 2) return [];
  
  try {
    const response = await fetch(
      `${BASE_URL}/food/ingredients/search?apiKey=${API_KEY}&query=${encodeURIComponent(query)}&number=10&metaInformation=true`
    );
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      image: item.image ? `https://spoonacular.com/cdn/ingredients_100x100/${item.image}` : null
    }));
  } catch (error) {
    console.error("Error searching ingredients:", error);
    toast({
      title: "Error",
      description: "Failed to fetch ingredients. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Find recipes by ingredients
 */
export const findRecipesByIngredients = async (ingredients: string[]): Promise<any[]> => {
  if (!ingredients.length) return [];
  
  try {
    const ingredientsParam = ingredients
      .filter(ingredient => ingredient.trim().length > 0)
      .map(ingredient => encodeURIComponent(ingredient))
      .join(',');
    
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?apiKey=${API_KEY}&ingredients=${ingredientsParam}&number=5&ranking=1&ignorePantry=false`
    );
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error finding recipes:", error);
    toast({
      title: "Error",
      description: "Failed to find recipes. Please try again.",
      variant: "destructive",
    });
    return [];
  }
}

/**
 * Get detailed recipe information
 */
export const getRecipeInformation = async (recipeId: number): Promise<any> => {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${recipeId}/information?apiKey=${API_KEY}&includeNutrition=false`
    );
    
    if (!response.ok) {
      throw new Error(`API returned status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error getting recipe information:", error);
    toast({
      title: "Error",
      description: "Failed to load recipe details. Please try again.",
      variant: "destructive",
    });
    return null;
  }
}
