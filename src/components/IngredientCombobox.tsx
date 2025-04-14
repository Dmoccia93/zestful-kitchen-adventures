
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
        // We ensure this always returns an array
        const ingredients = findMatchingIngredients(value);
        setMatchingIngredients(ingredients || []);
    }, [value]);

    return (
        <Combobox
            value={value}
            onValueChange={onValueChange}
            items={matchingIngredients}
            label={label}
            isValid={value === '' || isValidIngredient(value)}
        />
    );
};

export default IngredientCombobox;
