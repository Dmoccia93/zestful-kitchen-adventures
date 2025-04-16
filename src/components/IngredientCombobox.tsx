
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
                
                // Ensure ingredients is an array before mapping
                if (Array.isArray(ingredients) && ingredients.length > 0) {
                    const ingredientNames = ingredients
                        .filter((ingredient: Ingredient) => ingredient && ingredient.name)
                        .map((ingredient: Ingredient) => ingredient.name);
                    
                    setMatchingIngredients(ingredientNames);
                } else {
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

    // Ensure we never pass undefined or null to the Combobox component
    const safeValue = value || "";
    const safeIngredients = Array.isArray(matchingIngredients) ? matchingIngredients : [];

    return (
        <ErrorBoundary>
            <Combobox
                value={safeValue}
                onValueChange={handleValueChange}
                items={safeIngredients}
                label={label || ""}
                isValid={true}
                isLoading={isLoading}
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;
