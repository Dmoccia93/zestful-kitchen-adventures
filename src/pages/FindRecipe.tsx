
import React, { useState, useEffect } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from "@/hooks/use-toast";
import { findRecipesByIngredients, searchIngredients } from '../services/spoonacularService';

interface Recipe {
  id: number;
  title: string;
  image: string;
  usedIngredientCount: number;
  missedIngredientCount: number;
  missedIngredients: any[];
  usedIngredients: any[];
  unusedIngredients: any[];
}

const FindRecipe: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
    const [suggestionResults, setSuggestionResults] = useState<string[]>([]);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
    const [webhookUrl, setWebhookUrl] = useState<string>('');

    // Load webhook URL from localStorage on component mount
    useEffect(() => {
        const savedWebhookUrl = localStorage.getItem('n8nWebhookUrl');
        if (savedWebhookUrl) {
            setWebhookUrl(savedWebhookUrl);
        }
    }, []);

    // Save webhook URL to localStorage when it changes
    useEffect(() => {
        if (webhookUrl) {
            localStorage.setItem('n8nWebhookUrl', webhookUrl);
        }
    }, [webhookUrl]);

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, '']);
    };

    const fetchSuggestions = async (query: string) => {
        if (query.length >= 2) {
            setIsSearchingSuggestions(true);
            const suggestions = await searchIngredients(query);
            setSuggestionResults(suggestions.map(s => s.name));
            setIsSearchingSuggestions(false);
        } else {
            setSuggestionResults([]);
        }
    };

    const handleGenerateRecipes = async () => {
        setIsGeneratingRecipes(true);
        const validIngredients = ingredients.filter(ing => ing.trim() !== '');

        if (!webhookUrl) {
            toast({
                title: "Error",
                description: "Please enter your n8n webhook URL",
                variant: "destructive",
            });
            setIsGeneratingRecipes(false);
            return;
        }

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
            console.log("Sending ingredients to n8n webhook:", validIngredients);
            
            const response = await fetch(webhookUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "no-cors", // Add this to handle CORS
                body: JSON.stringify({
                    ingredients: validIngredients
                }),
            });

            // Since we're using no-cors mode, we won't get a proper response back
            // We'll show a toast to let the user know the request was sent
            toast({
                title: "Request sent to n8n",
                description: "Check your n8n workflow for results",
            });

            // For demo purposes, you might want to add a timeout and then show some mock data
            // In a real implementation, your n8n workflow would need to send data back to your app
            // through another endpoint or webhook
            
            // Clear existing recipes while we wait for n8n to process
            setRecipeResults([]);
            
            // Simulating a response after 2 seconds (remove in production)
            setTimeout(() => {
                const mockRecipes = validIngredients.map((ing, index) => ({
                    id: index + 1,
                    title: `${ing} Recipe ${index + 1}`,
                    image: `https://spoonacular.com/recipeImages/recipe-${index + 1}.jpg`,
                    usedIngredientCount: 1,
                    missedIngredientCount: 2,
                    missedIngredients: [],
                    usedIngredients: [{name: ing}],
                    unusedIngredients: []
                }));
                setRecipeResults(mockRecipes);
                setIsGeneratingRecipes(false);
            }, 2000);

        } catch (error) {
            console.error("Error calling n8n webhook:", error);
            toast({
                title: "Error",
                description: "Failed to connect to your n8n webhook. Please check the URL and try again.",
                variant: "destructive",
            });
            setIsGeneratingRecipes(false);
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleGenerateRecipes();
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Find Recipes</h1>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">n8n Webhook URL</label>
                <Input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="Enter your n8n webhook URL"
                    className="mb-4"
                />
            </div>
            
            <div className="space-y-4 mb-6">
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <IngredientCombobox
                            value={ingredient}
                            onValueChange={(value) => handleIngredientChange(index, value)}
                            label={`Ingredient ${index + 1}`}
                            suggestions={suggestionResults}
                            isLoading={isSearchingSuggestions}
                        />
                    </div>
                ))}
                
                <div className="flex flex-wrap gap-4 mt-4">
                    <Button 
                        onClick={addIngredientField} 
                        variant="outline"
                    >
                        Add another ingredient
                    </Button>
                    
                    <Button 
                        onClick={handleGenerateRecipes} 
                        disabled={isGeneratingRecipes}
                    >
                        {isGeneratingRecipes ? 'Generating...' : 'Generate Recipe'}
                    </Button>
                </div>
            </div>
            
            {recipeResults.length > 0 && (
                <div>
                    <h2 className="text-2xl font-bold mb-4">Recipe Results</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recipeResults.map(recipe => (
                            <div key={recipe.id} className="border rounded-lg overflow-hidden shadow-md">
                                {recipe.image && (
                                    <img 
                                        src={recipe.image} 
                                        alt={recipe.title} 
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                        }}
                                    />
                                )}
                                <div className="p-4">
                                    <h3 className="font-bold text-lg mb-2">{recipe.title}</h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        Used ingredients: {recipe.usedIngredientCount}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Missing ingredients: {recipe.missedIngredientCount}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FindRecipe;
