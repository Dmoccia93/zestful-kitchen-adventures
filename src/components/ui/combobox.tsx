import React, { useState, useEffect, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from './command'; // Adjust if needed

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[] | undefined; // Allow undefined
    label?: string;
    isValid?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onValueChange, items, label, isValid = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value || "");

    // Safely handle potentially undefined items
    const safeItems = Array.isArray(items) ? items : [];
    
    // Use useCallback to memoize the filter function
    const filterItems = useCallback((itemsToFilter: string[], searchQuery: string) => {
        return itemsToFilter.filter(item => {
            if (!item || typeof item !== 'string') return false;
            if (!searchQuery) return true;
            return item.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, []);

    const filteredItems = filterItems(safeItems, query);

    // Update query when value changes (and handle undefined)
    useEffect(() => {
        setQuery(String(value || "")); // Ensure query is always a string
    }, [value]);

    const handleSelect = useCallback((selectedItem: string | undefined) => {
        if (!selectedItem) {
            setQuery("");
            setIsOpen(false);
            onValueChange(""); // Or handle this more gracefully based on your needs
            return;
        }

        const safeSelectedItem = String(selectedItem); // Ensure string

        setQuery(safeSelectedItem);
        onValueChange(safeSelectedItem);
        setIsOpen(false);
    }, [onValueChange]); // Add onValueChange as a dependency

    console.log("🔍 Combobox debug", {
        items: safeItems,
        value,
        filteredItems,
        query,
        itemsLength: safeItems.length,
        filteredLength: filteredItems.length,
    });

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className={`relative ${!isValid ? 'ring-2 ring-destructive rounded-md' : ''}`}>
                <Command
                    className="rounded-lg border border-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') setIsOpen(false);
                    }}
                >
                    <CommandInput
                        placeholder="Search ingredients..."
                        value={query}
                        onValueChange={(newQuery) => {
                            if (newQuery === undefined || newQuery === null) {
                                newQuery = "";
                            }
                            setQuery(newQuery);
                            onValueChange(newQuery);
                            setIsOpen(true);
                        }}
                    />
                    {isOpen && filteredItems.length > 0 && (
                        <CommandList>
                            {filteredItems.slice(0, 10).map((item, index) => (
                                <CommandItem
                                    key={`${item}-${index}`}
                                    value={item}
                                    onSelect={handleSelect} // Use handleSelect
                                >
                                    {item}
                                </CommandItem>
                            ))}
                        </CommandList>
                    )}
                </Command>
            </div>
        </div>
    );
};

export default Combobox;