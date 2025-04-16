
import { useState, useEffect, useCallback, useRef } from 'react';

interface UseComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[] | undefined;
}

export function useCombobox({ value, onValueChange, items }: UseComboboxProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [internalItems, setInternalItems] = useState<string[]>([]);
    const commandRef = useRef<HTMLDivElement>(null);

    // Ensure values are never undefined
    const safeValue = typeof value === 'string' ? value : '';

    // Update internal items when props change - with additional safety checks
    useEffect(() => {
        // Defensive check - ensure items is an array before setting state
        if (items === undefined || items === null) {
            console.log('Items is null/undefined, setting empty array');
            setInternalItems([]);
        } else if (!Array.isArray(items)) {
            console.warn('Items is not an array:', items);
            setInternalItems([]);
        } else {
            // Filter out any non-string values that might have slipped through
            const safeItems = items.filter(item => typeof item === 'string');
            console.log('Setting internal items:', safeItems);
            setInternalItems(safeItems);
        }
    }, [items]);

    // Update query when value changes from parent
    useEffect(() => {
        setQuery(safeValue);
    }, [safeValue]);

    // Use useCallback to memoize the filter function
    const filterItems = useCallback((itemsToFilter: string[], searchQuery: string) => {
        console.log('Filtering items:', {
            itemsToFilterType: typeof itemsToFilter,
            isArray: Array.isArray(itemsToFilter),
            searchQueryType: typeof searchQuery,
            itemsLength: itemsToFilter?.length || 0
        });
        
        // Guarantee itemsToFilter is an array
        if (!Array.isArray(itemsToFilter)) {
            console.warn('filterItems received non-array items:', itemsToFilter);
            return [];
        }
        
        // Additional safety - filter out non-string items
        const safeItemsToFilter = itemsToFilter.filter(item => typeof item === 'string');
        
        if (!searchQuery) {
            return safeItemsToFilter.slice(0, 100);
        }
        
        if (searchQuery.length === 1) {
            return safeItemsToFilter.filter(item => item.toLowerCase().startsWith(searchQuery.toLowerCase()));
        }
        
        return safeItemsToFilter.filter(item => item.toLowerCase().includes(searchQuery.toLowerCase()));
    }, []);

    // Calculate filtered items safely
    const getFilteredItems = useCallback(() => {
        try {
            if (!Array.isArray(internalItems)) {
                console.warn('internalItems is not an array in getFilteredItems');
                return [];
            }
            return filterItems(internalItems, query);
        } catch (error) {
            console.error('Error filtering items:', error);
            return [];
        }
    }, [filterItems, internalItems, query]);

    const filteredItems = getFilteredItems();

    // Safe selection handler that prevents the undefined issue
    const handleSelect = useCallback((selectedItem: string | undefined | null) => {
        console.log('handleSelect called with:', selectedItem);
        
        // Handle when selectedItem is undefined or null
        if (selectedItem === undefined || selectedItem === null) {
            console.log('handleSelect: selectedItem is undefined/null, using empty string');
            onValueChange("");
            setIsOpen(false);
            return;
        }

        // Ensure selectedItem is always a string
        const safeSelectedItem = String(selectedItem);
        console.log('handleSelect: setting value to', safeSelectedItem);
        setQuery(safeSelectedItem);
        onValueChange(safeSelectedItem);
        setIsOpen(false);
    }, [onValueChange]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        console.log('handleKeyDown:', e.key);
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            console.log('Enter pressed, current query:', query);
            if (query) {
                onValueChange(query);
            }
            setIsOpen(false);
        }
    };

    const handleInputChange = (newQuery: string) => {
        console.log('handleInputChange:', newQuery);
        // Ensure newQuery is never undefined
        const safeNewQuery = typeof newQuery === 'string' ? newQuery : '';
        setQuery(safeNewQuery);
        onValueChange(safeNewQuery);
        setIsOpen(true);
    };

    return {
        isOpen,
        setIsOpen,
        query,
        filteredItems,
        commandRef,
        handleSelect,
        handleKeyDown,
        handleInputChange
    };
}
