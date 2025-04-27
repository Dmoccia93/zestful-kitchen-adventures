import React, { useState } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import { findRecipesByIngredients, searchIngredients } from '../services/spoonacularService';
import { Textarea } from "@/components/ui/textarea";

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

const WEBHOOK_URL = 'http://localhost:5678/webhook-test/generate-recipes';

const FindRecipe: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [recipeResults, setRecipeResults] = useState<Recipe[]>([]);
    const [suggestionResults, setSuggestionResults] = useState<string[]>([]);
    const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
    const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
    const [rawResponse, setRawResponse] = useState<string>('');

    const handleIngredientChange = (index: number, value: string) => {
        const newIngredients = [...ingredients];
        newIngredients[index] = value;
        setIngredients(newIngredients);
    };

    const addIngredientField = () => {
        setIngredients([...ingredients, '']);
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
            console.log("Sending ingredients to n8n webhook:", validIngredients);

            const response = await fetch(WEBHOOK_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                mode: "no-cors", // Keep this if you are encountering CORS issues
                body: JSON.stringify({
                    ingredients: validIngredients
                }),
            });

            if (response.ok) {
                const responseText = await response.text(); // Get the response body as text
                setRawResponse(responseText);

                toast({
                    title: "Recipe generated",
                    description: "The recipe is displayed below",
                });
            } else {
                const errorText = await response.text();
                setRawResponse(`Error from n8n: ${response.status} - ${errorText}`);
                toast({
                    title: "Error",
                    description: `Failed to get recipe from n8n: ${response.status}`,
                    variant: "destructive",
                });
            }

            setRecipeResults([]);
            setIsGeneratingRecipes(false);

        } catch (error) {
            console.error("Error calling n8n webhook:", error);
            setRawResponse(JSON.stringify(error, null, 2));
            toast({
                title: "Error",
                description: "Failed to connect to n8n webhook. Please ensure your n8n workflow is running.",
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

                {rawResponse && (
                    <div className="mt-6">
                        <h2 className="text-xl font-semibold mb-2">n8n Response:</h2>
                        <Textarea
                            value={rawResponse}
                            readOnly
                            className="min-h-[200px] font-mono text-sm"
                        />
                    </div>
                )}
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