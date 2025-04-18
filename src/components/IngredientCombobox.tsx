
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
                console.log('API response type:', typeof ingredients);
                console.log('API response isArray:', Array.isArray(ingredients));
                console.log('API response length:', ingredients?.length || 0);
                console.log('API sample items:', ingredients?.slice(0, 3));
                
                // Validate the API response strictly
                if (!ingredients) {
                    console.log('ingredients is null/undefined, setting empty array');
                    setMatchingIngredients([]);
                    return;
                }
                
                if (!Array.isArray(ingredients)) {
                    console.warn('API did not return an array:', ingredients);
                    setMatchingIngredients([]);
                    return;
                }
                
                // Extract and validate each ingredient name
                const ingredientNames = ingredients
                    .filter((ingredient): ingredient is Ingredient => 
                        ingredient && 
                        typeof ingredient === 'object' && 
                        'name' in ingredient && 
                        typeof ingredient.name === 'string'
                    )
                    .map((ingredient) => ingredient.name);
                
                console.log('Extracted ingredient names:', ingredientNames);
                
                // Final validation before setting state
                if (!Array.isArray(ingredientNames)) {
                    console.warn('ingredientNames is not an array:', ingredientNames);
                    setMatchingIngredients([]);
                } else {
                    setMatchingIngredients(ingredientNames);
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
        safeIngredients: safeIngredients.slice(0, 3)
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
