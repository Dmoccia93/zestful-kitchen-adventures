
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

    // Debounced search function with improved error handling
    const debouncedSearch = useCallback(
        async (query: string) => {
            if (!query || typeof query !== 'string' || query.length < 2) {
                setMatchingIngredients([]);
                return;
            }

            setIsLoading(true);
            try {
                const ingredients = await searchIngredients(query);
                console.log('API response:', ingredients);
                
                // More strict validation of the returned data
                if (Array.isArray(ingredients) && ingredients.length > 0) {
                    const ingredientNames = ingredients
                        .filter((ingredient: Ingredient) => 
                            ingredient && 
                            typeof ingredient === 'object' && 
                            'name' in ingredient && 
                            typeof ingredient.name === 'string'
                        )
                        .map((ingredient: Ingredient) => ingredient.name);
                    
                    console.log('Transformed ingredient names:', ingredientNames);
                    
                    // Ensure we always set a valid array
                    setMatchingIngredients(Array.isArray(ingredientNames) ? ingredientNames : []);
                } else {
                    console.log('No ingredients found or invalid response, setting empty array');
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
            // Validate value before searching
            if (typeof value === "string" && value.length >= 2) {
                debouncedSearch(value);
            } else {
                setMatchingIngredients([]);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [value, debouncedSearch]);

    // Safely handle value changes
    const handleValueChange = (newValue: string) => {
        try {
            // Ensure we pass a valid string to the parent component
            const safeValue = typeof newValue === 'string' ? newValue : '';
            console.log('IngredientCombobox handleValueChange:', safeValue);
            onValueChange(safeValue);
        } catch (error) {
            console.error("Error in handleValueChange:", error);
            // Fallback to empty string on error
            onValueChange('');
        }
    };

    // Ensure we never pass undefined or null to the Combobox component
    const safeValue = typeof value === 'string' ? value : '';
    
    // Explicitly guarantee matchingIngredients is an array before passing it
    const safeIngredients = Array.isArray(matchingIngredients) ? matchingIngredients : [];
    
    console.log('IngredientCombobox rendering with:', {
        safeValue,
        matchingIngredientsType: typeof matchingIngredients,
        isArray: Array.isArray(matchingIngredients),
        safeIngredientsLength: safeIngredients.length,
        safeIngredients
    });

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
