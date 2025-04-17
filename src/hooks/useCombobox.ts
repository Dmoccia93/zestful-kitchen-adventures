
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

    // Ensure value is never undefined
    const safeValue = typeof value === 'string' ? value : '';

    // Update internal items when props change with robust type checking
    useEffect(() => {
        console.log('useCombobox - items changed:', {
            itemsType: typeof items,
            isArray: Array.isArray(items),
            itemsLength: items?.length || 0,
            sampleItems: Array.isArray(items) ? items.slice(0, 3) : 'not an array'
        });

        // Defensive check for items
        if (!items) {
            console.log('Items is null/undefined, setting empty array');
            setInternalItems([]);
        } else if (!Array.isArray(items)) {
            console.warn('Items is not an array:', items);
            setInternalItems([]);
        } else {
            // Filter out non-string values and ensure all values are strings
            const safeItems = items
                .filter(item => item !== undefined && item !== null)
                .map(item => String(item));
            
            console.log('Setting internal items:', {
                safeItemsLength: safeItems.length,
                sampleSafeItems: safeItems.slice(0, 3)
            });
            
            setInternalItems(safeItems);
        }
    }, [items]);

    // Update query when value changes from parent
    useEffect(() => {
        setQuery(safeValue);
    }, [safeValue]);

    // Memoize the filter function to avoid unnecessary re-renders
    const filterItems = useCallback((itemsToFilter: string[], searchQuery: string) => {
        console.log('Filtering items:', {
            itemsToFilterLength: itemsToFilter?.length || 0,
            isArray: Array.isArray(itemsToFilter),
            searchQuery
        });
        
        // Guarantee itemsToFilter is an array
        if (!Array.isArray(itemsToFilter)) {
            console.warn('filterItems received non-array items:', itemsToFilter);
            return [];
        }
        
        // Additional safety - filter out invalid items and ensure all are strings
        const safeItemsToFilter = itemsToFilter
            .filter(item => item !== undefined && item !== null)
            .map(item => String(item));
        
        if (!searchQuery) {
            return safeItemsToFilter.slice(0, 100);
        }
        
        const lowerCaseQuery = searchQuery.toLowerCase();
        
        if (searchQuery.length === 1) {
            return safeItemsToFilter.filter(
                item => typeof item === 'string' && item.toLowerCase().startsWith(lowerCaseQuery)
            );
        }
        
        return safeItemsToFilter.filter(
            item => typeof item === 'string' && item.toLowerCase().includes(lowerCaseQuery)
        );
    }, []);

    // Calculate filtered items with robust error handling
    const getFilteredItems = useCallback(() => {
        try {
            if (!Array.isArray(internalItems)) {
                console.warn('internalItems is not an array in getFilteredItems');
                return [];
            }
            
            const result = filterItems(internalItems, query);
            console.log('Filtered items result:', {
                resultLength: result.length,
                resultIsArray: Array.isArray(result),
                sampleResults: result.slice(0, 3)
            });
            
            return result;
        } catch (error) {
            console.error('Error filtering items:', error);
            return [];
        }
    }, [filterItems, internalItems, query]);

    const filteredItems = getFilteredItems();

    // Safe selection handler that prevents undefined issues
    const handleSelect = useCallback((selectedItem: string) => {
        console.log('handleSelect called with:', selectedItem);
        
        // Validate selectedItem before using it
        if (selectedItem === undefined || selectedItem === null) {
            console.log('handleSelect: selectedItem is undefined/null, using empty string');
            onValueChange("");
        } else {
            // Ensure selectedItem is always a string
            const safeSelectedItem = String(selectedItem);
            console.log('handleSelect: setting value to', safeSelectedItem);
            setQuery(safeSelectedItem);
            onValueChange(safeSelectedItem);
        }
        
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
