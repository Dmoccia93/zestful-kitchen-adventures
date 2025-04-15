
import { useState } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircle, Search, Loader2 } from "lucide-react";
import IngredientCombobox from "@/components/IngredientCombobox";
import { findRecipesByIngredients, getRecipeInformation } from "@/services/spoonacularService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

interface Recipe {
    id: number;
    title: string;
    image: string;
    usedIngredientCount: number;
    missedIngredientCount: number;
    likes: number;
}

interface RecipeDetail extends Recipe {
    instructions: string;
    readyInMinutes: number;
    servings: number;
}

const FindRecipe = () => {
    const [inputMethod, setInputMethod] = useState("manual");
    const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([
        { name: "", quantity: "" }
    ]);
    const [isSearching, setIsSearching] = useState(false);
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<RecipeDetail | null>(null);

    const handleAddIngredient = () => {
        setIngredients([...ingredients, { name: "", quantity: "" }]);
    };

    const handleIngredientChange = (index: number, field: "name" | "quantity", value: string) => {
        const updatedIngredients = [...ingredients];
        updatedIngredients[index][field] = value;
        setIngredients(updatedIngredients);
    };

    const handleGenerateRecipe = async () => {
        const validIngredients = ingredients
            .filter(item => item.name.trim().length > 0)
            .map(item => item.name);
            
        if (validIngredients.length === 0) {
            toast({
                title: "No ingredients",
                description: "Please add at least one ingredient to search for recipes.",
                variant: "destructive",
            });
            return;
        }
        
        setIsSearching(true);
        setSelectedRecipe(null);
        
        try {
            const foundRecipes = await findRecipesByIngredients(validIngredients);
            setRecipes(foundRecipes);
            
            if (foundRecipes.length === 0) {
                toast({
                    title: "No recipes found",
                    description: "Try adding different ingredients or less specific ones.",
                });
            }
        } catch (error) {
            console.error("Error generating recipes:", error);
            toast({
                title: "Error",
                description: "Failed to generate recipes. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsSearching(false);
        }
    };
    
    const handleViewRecipeDetails = async (recipeId: number) => {
        try {
            const details = await getRecipeInformation(recipeId);
            setSelectedRecipe(details);
        } catch (error) {
            console.error("Error fetching recipe details:", error);
            toast({
                title: "Error",
                description: "Failed to load recipe details. Please try again.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <NavBar />
            <main className="flex-grow py-12 px-6 sm:px-8 lg:px-12 bg-background">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center text-foreground mt-12">
                        Add ingredients you have to get a fab recipe
                    </h1>

                    <div className="mb-8">
                        <Select value={inputMethod} onValueChange={setInputMethod}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select input method" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="manual">Input ingredients manually</SelectItem>
                                <SelectItem value="image" disabled>
                                    Share a pic of your fridge - coming soon
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-4 mb-8">
                        {ingredients.map((ingredient, index) => (
                            <div key={index} className="flex gap-4">
                                <div className="flex-grow">
                                    <IngredientCombobox
                                        value={ingredient.name}
                                        onValueChange={(value) => handleIngredientChange(index, "name", value)}
                                    />
                                </div>
                                <Input
                                    className="w-1/3"
                                    placeholder="Quantity"
                                    value={ingredient.quantity}
                                    onChange={(e) => handleIngredientChange(index, "quantity", e.target.value)}
                                />
                            </div>
                        ))}
                        <Button
                            variant="outline"
                            onClick={handleAddIngredient}
                            className="w-full flex items-center justify-center gap-2"
                        >
                            <PlusCircle className="w-5 h-5" />
                            Add another ingredient
                        </Button>
                    </div>

                    <Button
                        className="w-full py-6 text-lg"
                        onClick={handleGenerateRecipe}
                        disabled={isSearching}
                    >
                        {isSearching ? (
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        ) : (
                            <Search className="w-5 h-5 mr-2" />
                        )}
                        {isSearching ? "Searching..." : "Generate Recipe"}
                    </Button>
                    
                    {/* Recipe Results */}
                    {recipes.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold mb-6">Recipe Results</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {recipes.map((recipe) => (
                                    <Card key={recipe.id} className="overflow-hidden">
                                        {recipe.image && (
                                            <img 
                                                src={recipe.image} 
                                                alt={recipe.title}
                                                className="w-full h-48 object-cover"
                                            />
                                        )}
                                        <CardHeader>
                                            <CardTitle>{recipe.title}</CardTitle>
                                            <CardDescription>
                                                Uses {recipe.usedIngredientCount} of your ingredients
                                                {recipe.missedIngredientCount > 0 && 
                                                    ` (missing ${recipe.missedIngredientCount})`}
                                            </CardDescription>
                                        </CardHeader>
                                        <CardFooter>
                                            <Button 
                                                onClick={() => handleViewRecipeDetails(recipe.id)}
                                                variant="secondary"
                                            >
                                                View Recipe
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Selected Recipe Details */}
                    {selectedRecipe && (
                        <div className="mt-12">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{selectedRecipe.title}</CardTitle>
                                    <CardDescription>
                                        Ready in {selectedRecipe.readyInMinutes} minutes • Serves {selectedRecipe.servings}
                                    </CardDescription>
                                </CardHeader>
                                {selectedRecipe.image && (
                                    <div className="px-6">
                                        <img 
                                            src={selectedRecipe.image} 
                                            alt={selectedRecipe.title}
                                            className="w-full max-h-80 object-cover rounded-md"
                                        />
                                    </div>
                                )}
                                <CardContent className="mt-4">
                                    <h3 className="font-bold text-lg mb-2">Instructions</h3>
                                    <div 
                                        dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }} 
                                        className="prose max-w-none"
                                    />
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default FindRecipe;
