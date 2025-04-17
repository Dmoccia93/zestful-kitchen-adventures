
import React, { useRef } from 'react';
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
    const listRef = useRef<HTMLDivElement>(null);

    // Add extensive logging to track component lifecycle
    console.log("Combobox rendering with props:", {
        value,
        itemsLength: items?.length || 0,
        itemsType: typeof items,
        isArray: Array.isArray(items),
        label,
        isValid,
        isLoading,
        listRefDefined: !!listRef.current
    });

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

    // Log state from useCombobox
    console.log("useCombobox state:", {
        isOpen,
        query,
        filteredItemsLength: filteredItems?.length || 0,
        filteredItemsType: typeof filteredItems,
        filteredItemsIsArray: Array.isArray(filteredItems)
    });

    // Ensure values are never undefined
    const safeLabel = typeof label === 'string' ? label : '';

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
                        filteredItems={filteredItems || []} // Guarantee we always pass an array
                        handleSelect={handleSelect}
                        listRef={listRef}
                    />
                </Command>
            </div>
        </div>
    );
};

export default Combobox;
