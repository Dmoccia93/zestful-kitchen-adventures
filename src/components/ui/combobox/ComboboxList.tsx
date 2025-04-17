
import React from 'react';
import { CommandList, CommandItem, CommandEmpty } from '../command';

interface ComboboxListProps {
    isOpen: boolean;
    isLoading: boolean;
    filteredItems: string[];
    handleSelect: (value: string) => void;
    listRef?: React.RefObject<HTMLDivElement>;
}

const ComboboxList: React.FC<ComboboxListProps> = ({
    isOpen,
    isLoading,
    filteredItems,
    handleSelect,
    listRef
}) => {
    // Don't render anything if the dropdown isn't open
    if (!isOpen) return null;

    // Add extensive safety checks before rendering
    const itemsAreValid = Array.isArray(filteredItems) && filteredItems.length > 0;
    
    console.log('ComboboxList rendering with:', {
        isOpen,
        isLoading,
        filteredItemsLength: filteredItems?.length || 0,
        filteredItemsType: typeof filteredItems,
        isValidArray: itemsAreValid,
        listRefExists: !!listRef
    });

    // Explicit check for valid items before rendering CommandItems
    if (itemsAreValid) {
        return (
            <CommandList ref={listRef}>
                {filteredItems.slice(0, 10).map((item, index) => {
                    // Ensure each item is a valid string
                    const safeItem = item?.toString() || '';
                    console.log(`Rendering item ${index}:`, safeItem);
                    
                    return (
                        <CommandItem
                            key={`${safeItem}-${index}`}
                            value={safeItem}
                            onSelect={() => handleSelect(safeItem)}
                        >
                            {safeItem}
                        </CommandItem>
                    );
                })}
            </CommandList>
        );
    }

    // Only show "No ingredients found" when not loading and there are no items
    if (!isLoading) {
        return (
            <CommandList ref={listRef}>
                <CommandEmpty>No ingredients found.</CommandEmpty>
            </CommandList>
        );
    }

    // Return null if we're loading
    return null;
};

export default ComboboxList;
