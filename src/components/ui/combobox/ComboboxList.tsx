
import React from 'react';
import { CommandList, CommandItem, CommandEmpty } from '../command';

interface ComboboxListProps {
    isOpen: boolean;
    isLoading: boolean;
    filteredItems: string[];
    handleSelect: (value: string) => void;
}

const ComboboxList: React.FC<ComboboxListProps> = ({
    isOpen,
    isLoading,
    filteredItems,
    handleSelect
}) => {
    if (!isOpen) return null;

    if (Array.isArray(filteredItems) && filteredItems.length > 0) {
        return (
            <CommandList>
                {filteredItems.slice(0, 10).map((item, index) => (
                    <CommandItem
                        key={`${item}-${index}`}
                        value={item}
                        onSelect={handleSelect}
                    >
                        {item}
                    </CommandItem>
                ))}
            </CommandList>
        );
    }

    if (!isLoading) {
        return (
            <CommandList>
                <CommandEmpty>No ingredients found.</CommandEmpty>
            </CommandList>
        );
    }

    return null;
};

export default ComboboxList;
