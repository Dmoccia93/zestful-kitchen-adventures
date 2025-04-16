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

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({ value, onValueChange, label }) => {
    const [matchingIngredients, setMatchingIngredients] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Mock API response
    const mockIngredients: Ingredient[] = [
        { id: 1, name: "Chicken Breast", image: null },
        { id: 2, name: "Ground Chicken", image: null },
        { id: 3, name: "Chicken Thigh", image: null },
        { id: 4, name: "Beef Steak", image: null },
        { id: 5, name: "Ground Beef", image: null },
        { id: 6, name: "Pasta", image: null },
        { id: 7, name: "Rice", image: null },
        { id: 8, name: "Tomato", image: null },
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
                let ingredients: Ingredient[] = [];
                if (useMockData) {
                    // Filter mock data based on query
                    ingredients = mockIngredients.filter(ingredient =>
                        ingredient.name.toLowerCase().includes(query.toLowerCase())
                    );
                    // Simulate API latency
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    ingredients = await searchIngredients(query);
                }

                if (Array.isArray(ingredients)) {
                    const ingredientNames = ingredients.map((ingredient: Ingredient) => ingredient.name);
                    setMatchingIngredients(ingredientNames);
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
