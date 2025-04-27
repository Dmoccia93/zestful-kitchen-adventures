
import React, { useState, useEffect, useCallback } from 'react';
import Combobox from './ui/combobox';
import ErrorBoundary from './ErrorBoundary';

interface IngredientComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    label?: string;
    triggerSearch?: boolean;
    onSearch?: (query: string) => void;
    isLoading?: boolean;
    suggestions?: string[];
    onKeyDown?: (event: React.KeyboardEvent) => void;
}

const IngredientCombobox: React.FC<IngredientComboboxProps> = ({
    value,
    onValueChange,
    label,
    triggerSearch,
    onSearch,
    isLoading = false,
    suggestions = [],
    onKeyDown,
}) => {
    const handleValueChange = (newValue: string) => {
        try {
            const safeValue = typeof newValue === 'string' ? newValue : '';
            onValueChange(safeValue);
        } catch (error) {
            console.error("Error in handleValueChange:", error);
            onValueChange('');
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (onKeyDown) {
            onKeyDown(event);
        }
    };

    const safeValue = typeof value === 'string' ? value : '';
    const safeSuggestions = Array.isArray(suggestions) ? suggestions : [];

    return (
        <ErrorBoundary>
            <Combobox
                value={safeValue}
                onValueChange={handleValueChange}
                items={safeSuggestions}
                label={label || ""}
                isValid={true}
                isLoading={isLoading}
                onKeyDown={handleKeyDown}
            />
        </ErrorBoundary>
    );
};

export default IngredientCombobox;
