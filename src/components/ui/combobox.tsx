import React from 'react';
import { Command } from './command';
import { useCombobox } from '@/hooks/useCombobox';
import ComboboxInput from './combobox/ComboboxInput';
import ComboboxList from './combobox/ComboboxList';

interface ComboboxProps {
    value: string;
    onValueChange: (value: string) => void;
    items: string[] | undefined;
    label?: string;
    isValid?: boolean;
    isLoading?: boolean;
}

const Combobox: React.FC<ComboboxProps> = ({ value, items }) => {
    const safeItems = Array.isArray(items) ? items : [];

    return (
        <Command>
            <CommandList>
                {safeItems.map((item) => (
                    <CommandItem key={item} value={item} onSelect={console.log}>
                        {item}
                    </CommandItem>
                ))}
            </CommandList>
        </Command>
    );
};

export default Combobox;