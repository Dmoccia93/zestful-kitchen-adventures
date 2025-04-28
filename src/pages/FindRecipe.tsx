import React, { useState, useEffect } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import RecipeBanner from '../components/RecipeBanner';

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

const WEBHOOK_URL = 'http://localhost:5678/webhook/generate-recipes';

const FindRecipe: React.FC = () => {
    const [ingredients, setIngredients] = useState<string[]>(['']);
    const [isGeneratingRecipes, setIsGeneratingRecipes] = useState(false);
    const [rawResponse, setRawResponse] = useState<string>('');
    const [recipe1Content, setRecipe1Content] = useState<string>('');
    const [recipe2Content, setRecipe2Content] = useState<string>('');

    useEffect(() => {
        // Parse the raw response when it changes
        if (rawResponse) {
            try {
                const responseData = JSON.parse(rawResponse);
                setRecipe1Content(responseData.recipe1 || '');
                setRecipe2Content(responseData.recipe2 || '');
            } catch (error) {
                console.error("Error parsing JSON response:", error);
                setRecipe1Content('');
                setRecipe2Content('');
            }
        }
    }, [rawResponse]);

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

            <div className="space-y-4 mb-6">
                {ingredients.map((ingredient, index) => (
                    <div key={index}>
                        <IngredientCombobox
                            value={ingredient}
                            onValueChange={(value) => handleIngredientChange(index, value)}
                            label={`Ingredient ${index + 1}`}
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

                {recipe1Content && recipe2Content && (
                    <div className="mt-8 space-y-6">
                        <RecipeBanner
                            title="Recipe 1"
                            subtitle={recipe1Content}
                            cookTime={30}
                            prepTime={20}
                            calories={650}
                            tags={["Vegetarian", "Easy to make"]}
                            onClick={() => {
                                toast({
                                    title: "Recipe 1 Selected",
                                    description: "Opening recipe details...",
                                });
                            }}
                        />
                        
                        <RecipeBanner
                            title="Recipe 2"
                            subtitle={recipe2Content}
                            cookTime={35}
                            prepTime={25}
                            calories={750}
                            tags={["Quick", "Family-friendly"]}
                            onClick={() => {
                                toast({
                                    title: "Recipe 2 Selected",
                                    description: "Opening recipe details...",
                                });
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindRecipe;