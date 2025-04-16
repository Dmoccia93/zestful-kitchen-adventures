import React, { useState, useEffect, useCallback } from 'react';
import Combobox from './ui/combobox';
import { searchIngredients } from '../services/spoonacularService';
import ErrorBoundary from './ErrorBoundary';

interface IngredientComboboxProps {
    onRecipesGenerated: (recipes: MockRecipe[]) => void; // Callback to pass recipes
}

interface Ingredient {
    id: number;
    name: string;
    image: string | null;
}

interface MockRecipe {
    id: number;
    title: string;
    ingredients: string[]; // Array of ingredient names
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({ onRecipesGenerated }) => {
    const [matchingIngredients, setMatchingIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<string>("");

    // Mock recipes data
    const mockRecipes: MockRecipe[] = [
        { id: 1, title: "Chicken Salad", ingredients: ["chicken", "mayo", "celery"] },
        { id: 2, title: "Chicken Soup", ingredients: ["chicken", "carrots", "noodles"] },
        { id: 3, title: "Beef Stew", ingredients: ["beef", "potatoes", "carrots"] },
        { id: 4, title: "Pasta Carbonara", ingredients: ["pasta", "eggs", "bacon"] },
        { id: 5, title: "Tomato Soup", ingredients: ["tomato", "bread"] },
        { id: 6, title: "Beef Tacos", ingredients: ["beef", "tomato", "onion"] },
    ];

    const useMockData = true; // Set to true to use mock data

    // Debounced search function
    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query || query.length < 2) {
                setMatchingIngredients([]);
                return;
            }

            setIsLoading(true);
            try {
                let ingredients: string[] = []; // Change to string[]
                if (useMockData) {
                    // Filter mock recipes based on query
                    ingredients = mockRecipes
                        .filter(recipe => recipe.ingredients.some(ing => ing.toLowerCase().includes(query.toLowerCase())))
                        .map(recipe => recipe.title); // Extract titles
                    // Simulate API latency
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    // This part would need adaptation to work with your actual API response
                    // Example: ingredients = (await searchIngredients(query)).map(item => item.name);
                    ingredients = []; // Placeholder, replace with API call
                }

                if (Array.isArray(ingredients)) {
                    setMatchingIngredients(ingredients);
                } else {
                    console.error("Invalid response format:", ingredients);
                    setMatchingIngredients([]);
                }
            } catch (error) {
                console.error("Error in ingredient search:", error);
                setMatchingIngredients([]);
            } finally {
                setIsLoading(false);
            }
        },
        [useMockData]
    );

    // Update matching ingredients when value changes
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const safeQuery = typeof value === "string" ? value : "";
            if (safeQuery.length >= 2) {
                debouncedSearch(safeQuery);
            } else {
                setMatchingIngredients([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value, debouncedSearch]);

    // Safely handle value changes
    const handleValueChange = (newValue: string) => {
        try {
            const safeValue = typeof newValue === 'string' ? newValue : '';
            onValueChange(safeValue);
        } catch (error) {
            console.error("Error in handleValueChange:", error);
        }
    };

    const handleGenerateRecipes = () => {
        const recipes = mockRecipes.filter(recipe =>
            recipe.ingredients.some(ing => ing.toLowerCase().includes(selectedIngredient.toLowerCase()))
        );
        onRecipesGenerated(recipes); // Pass filtered recipes to parent
    };

    return (
        <ErrorBoundary>
            <Combobox
                value={value || ""}
                onValueChange={handleValueChange}
                items={matchingIngredients}
                label="Search for ingredients"
                isValid={true}
                isLoading={isLoading}
            />
            <button onClick={handleGenerateRecipes}>Generate Recipes</button>
        </ErrorBoundary>
    );
};

export default IngredientCombobox;