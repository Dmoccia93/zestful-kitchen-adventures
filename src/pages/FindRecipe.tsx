import React, { useState, useEffect } from 'react';
import IngredientCombobox from '../components/IngredientCombobox';
import { Button } from '@/components/ui/button';
import { toast } from "@/hooks/use-toast";
import RecipeBanner from '../components/RecipeBanner';
import { PieChart as RechartsChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
    const [recipe1Data, setRecipe1Data] = useState<any>({});
    const [recipe2Data, setRecipe2Data] = useState<any>({});
    const [selectedRecipe, setSelectedRecipe] = useState<string | null>(null);

    useEffect(() => {
        if (rawResponse) {
            try {
                const responseData = JSON.parse(rawResponse);
                setRecipe1Data(responseData.recipe1 || {});
                setRecipe2Data(responseData.recipe2 || {});
            } catch (error) {
                console.error("Error parsing JSON response:", error);
                setRecipe1Data({});
                setRecipe2Data({});
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

    const renderMacrosPieChart = (macrosString: string) => {
        if (!macrosString) return null;

        try {
            const [carbs, protein, fat] = macrosString.split('-').map(Number);

            const data = [
                { name: 'Carbs', value: carbs },
                { name: 'Protein', value: protein },
                { name: 'Fat', value: fat }
            ];

            const COLORS = ['#FFC44B', '#38BDF8', '#F472B6']; // Yellow, Blue, Pink - adjust as needed

            return (
                <div className="w-24 h-24 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <RechartsChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={20}
                                outerRadius={40}
                                paddingAngle={1}
                                dataKey="value"
                            >
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                        </RechartsChart>
                    </ResponsiveContainer>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-gray-700">
                        Macros
                    </div>
                </div>
            );
        } catch (error) {
            console.error("Error rendering macros pie chart:", error);
            return null;
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

                {recipe1Data.recipeName && recipe2Data.recipeName && (
                    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div style={{ backgroundColor: '#f0fdf4' }}>
                            <div className="bg-green-500 text-white p-2 text-center">Recipe 1: Do something great with what you have</div>
                            <RecipeBanner
                                title={recipe1Data.recipeName}
                                subtitle={`Cooking Time: ${recipe1Data.totalTime}`}
                                cookTime={parseInt(recipe1Data.totalTime)}
                                tags={[recipe1Data.nutritionTag]}
                                image={recipe1Data.image}
                                onClick={() => setSelectedRecipe('recipe1')}
                            />
                        </div>

                        <div style={{ backgroundColor: '#fef3c7' }}>
                            <div className="bg-yellow-500 text-white p-2 text-center">Recipe 2: Add a little touch for something special</div>
                            <div className="relative">
                                <RecipeBanner
                                    title={recipe2Data.recipeName}
                                    subtitle={`Cooking Time: ${recipe2Data.totalTime}`}
                                    cookTime={parseInt(recipe2Data.totalTime)}
                                    calories={parseInt(recipe2Data.totalKcals)}
                                    image={recipe2Data.image}
                                    tags={[`${recipe2Data.totalKcals} kcal`]}
                                    onClick={() => setSelectedRecipe('recipe2')}
                                />
                                {recipe2Data.macros && (
                                    <div className="absolute bottom-4 right-4">
                                        {renderMacrosPieChart(recipe2Data.macros)}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

{selectedRecipe && (
                    <div className="mt-8">
                        {selectedRecipe === 'recipe1' && recipe1Data && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">{recipe1Data?.recipeName}</h2>
                                {recipe1Data?.image && <img src={recipe1Data.image} alt="Recipe 1" className="w-full h-48 object-cover mb-4" />}
                                <p>{recipe1Data?.instructions}</p>
                                <Button onClick={() => setSelectedRecipe(null)} className="mt-2">Back to Recipes</Button>
                            </div>
                        )}

                        {selectedRecipe === 'recipe2' && recipe2Data && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">{recipe2Data?.recipeName}</h2>
                                {recipe2Data?.image && <img src={recipe2Data.image} alt="Recipe 2" className="w-full h-48 object-cover mb-4" />}
                                <p>{recipe2Data?.instructions}</p>
                                <Button onClick={() => setSelectedRecipe(null)} className="mt-2">Back to Recipes</Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindRecipe;