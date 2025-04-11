import React from 'react';
import Combobox from './ui/combobox'; // Adjust import path if necessary
import { findMatchingIngredients, allIngredients } from '../utils/ingredients'; // Adjust import path

interface IngredientComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({ value, onValueChange, label }) => {
    return (
        <Combobox
            value={value}
            onValueChange={onValueChange}
            items={findMatchingIngredients(value)}
            label={label}
        />
    );
};

export default IngredientCombobox;
