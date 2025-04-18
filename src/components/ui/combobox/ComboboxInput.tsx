
import React from 'react';
import { CommandInput } from '../command';
import { Loader2 } from 'lucide-react';

interface ComboboxInputProps {
    query: string;
    handleInputChange: (value: string) => void;
    setIsOpen: (isOpen: boolean) => void;
    isLoading?: boolean;
}

const ComboboxInput: React.FC<ComboboxInputProps> = ({
    query,
    handleInputChange,
    setIsOpen,
    isLoading = false
}) => {
    return (
        <div className="flex items-center px-3">
            <CommandInput
                placeholder="Search ingredients..."
                value={query}
                onValueChange={handleInputChange}
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
    );
};

export default ComboboxInput;
