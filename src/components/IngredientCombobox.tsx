
import React, { useState, useEffect } from 'react';
import Combobox from './ui/combobox';
import { findMatchingIngredients, isValidIngredient } from '../utils/ingredients';

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
            setMatchingIngredients(Array.isArray(ingredients) ? ingredients : []);
        } catch (error) {
            console.error("Error in IngredientCombobox:", error);
            setMatchingIngredients([]);
        }
    }, [value]);

    return (
        <Combobox
            value={value || ""}
            onValueChange={(newValue) => onValueChange(newValue || "")}
            items={matchingIngredients}
            label={label}
            isValid={value === '' || isValidIngredient(value)}
        />
    );
};

export default IngredientCombobox;
