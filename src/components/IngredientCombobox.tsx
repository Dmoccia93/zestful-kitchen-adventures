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

    // Debounced search function
    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query || query.length < 2) {
                setMatchingIngredients([]);
                return;
            }

            setIsLoading(true);
            try {
                const ingredients = await searchIngredients(query);
                console.log("API Response:", ingredients); // Log the raw response
                if (Array.isArray(ingredients)) {
                    console.log("Ingredients before mapping:", ingredients); // Log before mapping
                    const ingredientNames = ingredients.map((ingredient: Ingredient) => ingredient.name);
                    console.log("ingredientNames before setState:", ingredientNames); // Log before setState
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
        []
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

    let itemsToPass = [];
    if (Array.isArray(matchingIngredients)) {
        itemsToPass = [...matchingIngredients]; // Defensive copy
    } else {
        console.error("matchingIngredients is not an array!", matchingIngredients);
        itemsToPass = []; // Pass an empty array to prevent errors
    }

    console.log("IngredientCombobox - Data being passed to Combobox:", itemsToPass);

    return (
        <ErrorBoundary>
            <Combobox
                value={value || ""}
                onValueChange={handleValueChange}
                items={itemsToPass} // Use the safe array
                label={label}
                isValid={true}
                isLoading={isLoading}
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;