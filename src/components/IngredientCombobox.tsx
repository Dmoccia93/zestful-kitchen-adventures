
import React, { useState, useEffect } from 'react';
import Combobox from './ui/combobox';
import { findMatchingIngredients, isValidIngredient } from '../utils/ingredients';
import ErrorBoundary from './ErrorBoundary'; // Import the ErrorBoundary component

interface IngredientComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({ value, onValueChange, label }) => {
    const [matchingIngredients, setMatchingIngredients] = useState<string[]>([]);
    
    // Update matching ingredients when value changes
    useEffect(() => {
        try {
            // We ensure this always returns an array
            const safeQuery = typeof value === "string" ? value : "";
            const ingredients = findMatchingIngredients(safeQuery);
            
            // Extra safety check to ensure we always set an array
            if (Array.isArray(ingredients)) {
                setMatchingIngredients(ingredients);
            } else {
                console.error("findMatchingIngredients did not return an array:", ingredients);
                setMatchingIngredients([]);
            }
        } catch (error) {
            console.error("Error in IngredientCombobox:", error);
            setMatchingIngredients([]);
        }
    }, [value]);

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
        <ErrorBoundary> {/* Wrap your component with ErrorBoundary */}
            <Combobox
                value={value || ""}
                onValueChange={handleValueChange}
                items={matchingIngredients}
                label={label}
                isValid={value === '' || isValidIngredient(value)}
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;
