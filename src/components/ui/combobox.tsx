
import React, { useState, useEffect, useCallback } from 'react';
import { Command, CommandInput, CommandList, CommandItem, CommandEmpty } from './command';
import { Loader2 } from 'lucide-react';

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[] | undefined; // Allow undefined
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
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value || "");

    // Safely handle potentially undefined items
    const safeItems = Array.isArray(items) ? items : [];

    // Use useCallback to memoize the filter function
    const filterItems = useCallback((itemsToFilter: string[], searchQuery: string) => {
        // Ensure itemsToFilter is an array before attempting to filter
        const safeItemsToFilter = Array.isArray(itemsToFilter) ? itemsToFilter : [];
        
        if (!searchQuery) {
            return safeItemsToFilter.slice(0, 100);
        }
        
        if (searchQuery.length === 1) {
            return safeItemsToFilter.filter(item => {
                if (!item || typeof item !== 'string') return false;
                return item.toLowerCase().startsWith(searchQuery.toLowerCase());
            });
        }
        
        return safeItemsToFilter.filter(item => {
            if (!item || typeof item !== 'string') return false;
            return item.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, []);

    const filteredItems = filterItems(safeItems, query);

    // Update query when value changes (and handle undefined)
    useEffect(() => {
        setQuery(String(value || "")); // Ensure query is always a string
    }, [value]);

    // Safe selection handler that prevents the undefined issue
    const handleSelect = useCallback((selectedItem: string | undefined | null) => {
        if (selectedItem === undefined || selectedItem === null) {
            setQuery(""); // Clear query
            onValueChange(""); // Pass empty string
            setIsOpen(false);
            return;
        }

        const safeSelectedItem = String(selectedItem);
        setQuery(safeSelectedItem);
        onValueChange(safeSelectedItem);
        setIsOpen(false);
    }, [onValueChange]);

    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className={`relative ${!isValid ? 'ring-2 ring-destructive rounded-md' : ''}`}>
                <Command
                    className="rounded-lg border border-input"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault(); // Prevent default to avoid form submission
                            setIsOpen(false);
                        }
                    }}
                >
                    <div className="flex items-center px-3">
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
                                onValueChange(query);
                            }}
                            className="flex-1"
                        />
                        {isLoading && (
                            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                        )}
                    </div>

                    {isOpen && (
                        <CommandList>
                            {filteredItems.length === 0 && !isLoading ? (
                                <CommandEmpty>No ingredients found.</CommandEmpty>
                            ) : (
                                filteredItems.slice(0, 10).map((item, index) => (
                                    <CommandItem
                                        key={`${item}-${index}`}
                                        value={item}
                                        onSelect={handleSelect}
                                    >
                                        {item}
                                    </CommandItem>
                                ))
                            )}
                        </CommandList>
                    )}
                </Command>
            </div>
        </div>
    );
};

export default Combobox;
