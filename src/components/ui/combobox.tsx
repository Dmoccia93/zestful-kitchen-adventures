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
        return (Array.isArray(itemsToFilter) ? itemsToFilter : []).filter(item => { // Safe filtering
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

    // Safe selection handler that prevents the undefined issue
    const handleSelect = useCallback((selectedItem: string | undefined | null) => { // Allow null
        if (selectedItem === undefined || selectedItem === null) {
            console.warn("handleSelect received undefined/null item", selectedItem); // Use warn instead of log
            setQuery(""); // Clear query
            onValueChange(""); // Pass empty string
            setIsOpen(false);
            return;
        }

        const safeSelectedItem = String(selectedItem);
        console.log("handleSelect - safeSelectedItem:", safeSelectedItem); // Log the string value
        setQuery(safeSelectedItem);
        console.log("handleSelect - Before onValueChange. safeSelectedItem:", safeSelectedItem, "value:", value); // Log before onValueChange
        onValueChange(safeSelectedItem);
        console.log("handleSelect - After onValueChange. safeSelectedItem:", safeSelectedItem, "value:", value); // Log after onValueChange
        setIsOpen(false);
    }, [onValueChange, value]); // Add value as a dependency

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
                            const safeNewQuery = String(newQuery || ""); // Ensure newQuery is a string
                            setQuery(safeNewQuery);
                            onValueChange(safeNewQuery); // Update parent
                            setIsOpen(true);
                        }}
                        onBlur={() => {
                            // On blur, update the parent value with the current query
                            if (onValueChange) {
                                onValueChange(query);
                            }
                        }}
                    />
                    {isOpen && filteredItems && filteredItems.length > 0 && (
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
                    )}
                </Command>
            </div>
        </div>
    );
};

export default Combobox;