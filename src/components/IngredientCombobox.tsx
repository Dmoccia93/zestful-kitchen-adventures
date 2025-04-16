import React, { useState, useEffect, useCallback } from 'react';
import Combobox from './ui/combobox';
import { searchIngredients } from '../services/spoonacularService';
import ErrorBoundary from './ErrorBoundary';

interface IngredientComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
}

interface Ingredient {
    id: number;
    name: string;
    image: string | null;
}

interface Recipe {
    id: number;
    title: string;
    image: string;
    imageType: string;
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({ value, onValueChange, label }) => {
    const [matchingIngredients, setMatchingIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock API response (using the provided structure)
    const mockApiResponse: Recipe[] = [
        {
            "id": 716429,
            "title": "Pasta with Garlic, Scallions, Cauliflower & Breadcrumbs",
            "image": "https://spoonacular.com/recipeImages/716429-556x370.jpg",
            "imageType": "jpg"
        },
        {
            "id": 640940,
            "title": "Garlic Butter Shrimp and Asparagus",
            "image": "https://spoonacular.com/recipeImages/640940-556x370.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715497,
            "title": "Cauliflower Pizza Crust (Low Carb, Gluten-Free)",
            "image": "https://spoonacular.com/recipeImages/715497-556x370.jpg",
            "imageType": "jpg"
        },
        {
            "id": 782601,
            "title": "Red Kidney Bean Curry",
            "image": "https://spoonacular.com/recipeImages/782601-556x370.jpg",
            "imageType": "jpg"
        },
        {
            "id": 715547,
            "title": "Easy Creamy Broccoli Soup (Low Carb)",
            "image": "https://spoonacular.com/recipeImages/715547-556x370.jpg",
            "imageType": "jpg"
        }
    ];

    const useMockData = true; // Set to true to use mock data, false to use API

    // Debounced search function
    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query || query.length < 2) {
                setMatchingIngredients([]);
                return;
            }

            setIsLoading(true);
            try {
                let ingredients: Recipe[] = [];
                if (useMockData) {
                    // Filter mock data based on query (using title for simplicity)
                    ingredients = mockApiResponse.filter(recipe =>
                        recipe.title.toLowerCase().includes(query.toLowerCase())
                    );
                    // Simulate API latency
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    ingredients = await searchIngredients(query);
                }

                if (Array.isArray(ingredients)) {
                    // Extract the 'title' from the API response
                    const ingredientNames = ingredients.map(recipe => recipe.title);
                    setMatchingIngredients(ingredientNames);
                } else {
                    console.error("IngredientCombobox - Invalid response format:", ingredients);
                    setMatchingIngredients([]);
                }
            } catch (error) {
                console.error("IngredientCombobox - Error in ingredient search:", error);
                setMatchingIngredients([]);
            } finally {
                setIsLoading(false);
            }
        },
        [useMockData] // Add useMockData as a dependency
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
            // Ensure we pass a string to the parent component
            const safeValue = typeof newValue === 'string' ? newValue : '';
            onValueChange(safeValue);
        } catch (error) {
            console.error("Error in handleValueChange:", error);
        }
    };

    return (
        <ErrorBoundary>
            <Combobox
                value={value || ""}
                onValueChange={handleValueChange}
                items={matchingIngredients}
                label={label}
                isValid={true}
                isLoading={isLoading}
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;