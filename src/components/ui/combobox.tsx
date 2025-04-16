
import React from 'react';
import { Command } from './command';
import { useCombobox } from '@/hooks/useCombobox';
import ComboboxInput from './combobox/ComboboxInput';
import ComboboxList from './combobox/ComboboxList';

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[] | undefined;
    label?: string;
    isValid?: boolean;
    isLoading?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({
    value,
    onValueChange,
    items,
    label,
    isValid = true,
    isLoading = false
}) => {
    const {
        isOpen,
        setIsOpen,
        query,
        filteredItems,
        commandRef,
        handleSelect,
        handleKeyDown,
        handleInputChange
    } = useCombobox({ value, onValueChange, items });

    // Ensure values are never undefined
    const safeLabel = typeof label === 'string' ? label : '';

    console.log('Combobox rendering:', {
        isOpen,
        filteredItemsLength: filteredItems.length,
        query,
        filteredItems
    });

    return (
        <div className="w-full">
            {safeLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{safeLabel}</label>}
            <div className={`relative ${!isValid ? 'ring-2 ring-destructive rounded-md' : ''}`}>
                <Command
                    ref={commandRef}
                    className="rounded-lg border border-input"
                    onKeyDown={handleKeyDown}
                >
                    <ComboboxInput
                        query={query}
                        handleInputChange={handleInputChange}
                        setIsOpen={setIsOpen}
                        isLoading={isLoading}
                    />

                    <ComboboxList
                        isOpen={isOpen}
                        isLoading={isLoading}
                        filteredItems={filteredItems}
                        handleSelect={handleSelect}
                    />
                </Command>
            </div>
        </div>
    );
};

export default Combobox;
