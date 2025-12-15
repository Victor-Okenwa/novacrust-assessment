import * as React from "react";
import { ChevronDown } from "lucide-react";

import { cn } from "~/lib/utils";
import { Button } from "./button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./command";
import { CheckIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type TokenOption = {
    value: string;
    label: string;
    icon?: React.ReactNode;
};

type TokenComboboxProps = {
    value: string;
    onChange: (value: string) => void;
    options: TokenOption[];
    placeholder?: string;
};

export function TokenCombobox({ value, onChange, options, placeholder = "Select token" }: TokenComboboxProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="secondary" role="combobox" className="justify-between rounded-full text-primary">
                    {(() => {
                        const current = value;
                        const token = options.find((t) => t.value.toLowerCase() === current.toLowerCase());
                        if (!token) {
                            return <span className="text-sm text-muted-foreground">{placeholder}</span>;
                        }
                        return (
                            <div className="flex flex-row items-center gap-1 flex-1 [&>svg]:size-5">
                                {token.icon}
                                <span className="text-sm font-medium">{token.value}</span>
                            </div>
                        );
                    })()}
                    <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0">
                <Command>
                    <CommandInput placeholder="Search token..." />
                    <CommandList>
                        <CommandEmpty>No token found.</CommandEmpty>
                        <CommandGroup>
                            {options
                                .filter((token) => token.value.toLowerCase() !== value.toLowerCase())
                                .map((token) => (
                                    <CommandItem
                                        key={token.value}
                                        value={token.value}
                                        onSelect={(currentValue) => {
                                            onChange(currentValue);
                                            setOpen(false);
                                        }}
                                    >
                                        <div className="flex items-center gap-2 flex-1">
                                            {token.icon}
                                            {token.label}
                                        </div>
                                        <CheckIcon
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                value === token.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}


