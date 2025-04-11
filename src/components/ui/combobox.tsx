import React, { useState, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from './command'; // Adjust import path

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[];
    label?: string;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onValueChange, items, label }) => {
    const [isopen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    const filteredItems = items.filter(item => item.toLowerCase().startsWith(query.toLowerCase()));

    useEffect(() => {
        setQuery(value);
    }, [value]);

    return (
        <Command onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(false); }}>
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            <CommandInput placeholder="Search ingredients..." value={query} onValueChange={(newQuery) => {
                setQuery(newQuery);
                setIsOpen(true);
            }} />
            {isopen && (
                <CommandList>
                    {filteredItems.length > 0 ? (
                        filteredItems.map(item => (
                            <CommandItem
                                key={item}
                                value={item}
                                onSelect={(newValue) => {
                                    onValueChange(newValue === value ? "" : newValue);
                                    setQuery(newValue);
                                    setIsOpen(false);
                                }}
                            >
                                {item}
                            </CommandItem>
                        ))
                    ) : (
                        <CommandItem disabled>No ingredients found.</CommandItem>
                    )}
                </CommandList>
            )}
        </Command>
    );
};

export default Combobox;
