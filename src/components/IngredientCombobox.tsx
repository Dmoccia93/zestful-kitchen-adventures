import React, { useState, useEffect, useCallback } from 'react';
import Combobox from './ui/combobox';
import ErrorBoundary from './ErrorBoundary';

interface IngredientComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    triggerSearch?: boolean; // New prop to trigger search externally
    onSearch?: (query: string) => void; // New prop to pass search trigger up
    isLoading?: boolean; // You might still want to show loading state elsewhere
    suggestions?: string[]; // Pass down suggestions if fetched externally
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({
    value,
    onValueChange,
    label,
    triggerSearch,
    onSearch,
    isLoading = false,
    suggestions = [],
}) => {
    // No longer managing matchingIngredients internally
    // const [matchingIngredients, setMatchingIngredients] = useState<string[]>([]);
    // const [isLoading, setIsLoading] = useState(false);

    // Remove the debouncedSearch function

    // Remove the useEffect hook that listens for value changes

    const handleValueChange = (newValue: string) => {
        try {
            const safeValue = typeof newValue === 'string' ? newValue : '';
            onValueChange(safeValue);
            // If you want to trigger search on Enter from this input
            // and pass the trigger up:
            // if (triggerSearch && newValue.length >= 2) {
            //     onSearch?.(newValue);
            // }
        } catch (error) {
            console.error("Error in handleValueChange:", error);
            onValueChange('');
        }
    };

    const safeValue = typeof value === 'string' ? value : '';
    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

    return (
        <ErrorBoundary>
            <Combobox
                value={safeValue}
                onValueChange={handleValueChange}
                items={safeSuggestions} // Use the suggestions passed down
                label={label || ""}
                isValid={true}
                isLoading={isLoading} // You might control this from the parent
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;