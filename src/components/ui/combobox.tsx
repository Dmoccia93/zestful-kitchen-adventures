
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
    const [query, setQuery] = useState("");

    // Ensure values are never undefined
    const safeValue = value || "";
    const safeItems = Array.isArray(items) ? items : [];
    const safeLabel = label || "";

    // Update query when value changes from parent
    useEffect(() => {
        setQuery(safeValue);
    }, [safeValue]);

    // Use useCallback to memoize the filter function
    const filterItems = useCallback((itemsToFilter: string[], searchQuery: string) => {
        // Ensure itemsToFilter is an array before attempting to filter
        if (!Array.isArray(itemsToFilter)) {
            return [];
        }
        
        if (!searchQuery) {
            return itemsToFilter.slice(0, 100);
        }
        
        if (searchQuery.length === 1) {
            return itemsToFilter.filter(item => {
                if (!item || typeof item !== 'string') return false;
                return item.toLowerCase().startsWith(searchQuery.toLowerCase());
            });
        }
        
        return itemsToFilter.filter(item => {
            if (!item || typeof item !== 'string') return false;
            return item.toLowerCase().includes(searchQuery.toLowerCase());
        });
    }, []);

    const filteredItems = filterItems(safeItems, query);

    // Safe selection handler that prevents the undefined issue
    const handleSelect = useCallback((selectedItem: string | undefined | null) => {
        // Handle when selectedItem is undefined or null
        if (selectedItem === undefined || selectedItem === null) {
            onValueChange("");
            setIsOpen(false);
            return;
        }

        // Ensure selectedItem is always a string
        const safeSelectedItem = String(selectedItem);
        setQuery(safeSelectedItem);
        onValueChange(safeSelectedItem);
        setIsOpen(false);
    }, [onValueChange]);

    // Handle Enter key press safely
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            if (query) {
                onValueChange(query);
            }
            setIsOpen(false);
        }
    };

    return (
        <div className="w-full">
            {safeLabel && <label className="block text-sm font-medium text-gray-700 mb-1">{safeLabel}</label>}
            <div className={`relative ${!isValid ? 'ring-2 ring-destructive rounded-md' : ''}`}>
                <Command
                    className="rounded-lg border border-input"
                    onKeyDown={handleKeyDown}
                >
                    <div className="flex items-center px-3">
                        <CommandInput
                            placeholder="Search ingredients..."
                            value={query}
                            onValueChange={(newQuery) => {
                                // Ensure newQuery is never undefined
                                const safeNewQuery = newQuery ?? "";
                                setQuery(safeNewQuery);
                                onValueChange(safeNewQuery);
                                setIsOpen(true);
                            }}
                            onBlur={() => {
                                setTimeout(() => {
                                    setIsOpen(false);
                                }, 200);
                            }}
                            onFocus={() => {
                                setIsOpen(true);
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
                                <>
                                    {Array.isArray(filteredItems) && filteredItems.slice(0, 10).map((item, index) => (
                                        <CommandItem
                                            key={`${item}-${index}`}
                                            value={item || ""}
                                            onSelect={handleSelect}
                                        >
                                            {item}
                                        </CommandItem>
                                    ))}
                                </>
                            )}
                        </CommandList>
                    )}
                </Command>
            </div>
        </div>
    );
};

export default Combobox;
