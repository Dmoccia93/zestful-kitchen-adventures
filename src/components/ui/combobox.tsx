
import React, { useState, useEffect } from 'react';
import { Command, CommandInput, CommandList, CommandItem } from './command';

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[];
    label?: string;
    isValid?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ value, onValueChange, items, label, isValid = true }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState(value);
    
    // Ensure items is always an array, even if it's undefined
    const safeItems = Array.isArray(items) ? items : [];
    const filteredItems = safeItems.filter(item =>
        item.toLowerCase().startsWith(query.toLowerCase())
      );
    useEffect(() => {
        setQuery(value);
    }, [value]);
    console.log("🔍 Combobox debug", { items, value, filteredItems, query });
    return (
        <div className="w-full">
            {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
            <div className={`relative ${!isValid ? 'ring-2 ring-destructive rounded-md' : ''}`}>
                <Command 
                    className="rounded-lg border border-input"
                    onKeyDown={(e) => { if (e.key === 'Enter') setIsOpen(false); }}
                >
                    <CommandInput 
                        placeholder="Search ingredients..." 
                        value={query} 
                        onValueChange={(newQuery) => {
                            setQuery(newQuery);
                            onValueChange(newQuery);
                            setIsOpen(true);
                        }} 
                    />
                    {isOpen && filteredItems.length > 0 && (
                        <CommandList>
                            {filteredItems.slice(0, 10).map(item => (
                                <CommandItem
                                key={item}
                                value={item}
                                onSelect={(newValue) => {
                                  if (!newValue) return; // ⛑️ Safeguard against undefined
                                  onValueChange(newValue === value ? "" : newValue);
                                  setQuery(newValue);
                                  setIsOpen(false);
                                }}
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
