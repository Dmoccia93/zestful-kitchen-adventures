import React, { useRef, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from './command';
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
    const listRef = useRef<React.ElementRef<typeof CommandList>>(null); // Ref for CommandList

    useEffect(() => {
        console.log("Combobox - useEffect - listRef.current (initial):", listRef.current);
    }, []);

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

    useEffect(() => {
        console.log("Combobox - useEffect - isOpen:", isOpen);
        console.log("Combobox - useEffect - query:", query);
        console.log("Combobox - useEffect - filteredItems:", filteredItems);
        console.log("Combobox - useEffect - listRef.current:", listRef.current);
    }, [isOpen, query, filteredItems]);

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
                        filteredItems={filteredItems}
                        handleSelect={handleSelect}
                        listRef={listRef} // Pass the ref to ComboboxList
                    />
                    {isOpen && listRef.current && ( // Check if listRef.current is defined
                        console.log("Combobox - CommandList is open and listRef.current is:", listRef.current)
                    )}
                </Command>
            </div>
        </div>
    );
};

export default Combobox;