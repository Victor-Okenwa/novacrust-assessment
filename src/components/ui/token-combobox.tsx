import type { ClassValue } from "class-variance-authority/types";
import { CheckIcon, ChevronDown } from "lucide-react";
import * as React from "react";
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
  withoutSearch?: boolean;
  className?: ClassValue;
  containerClassName?: ClassValue;
  searchPlaceholder?: string;
};

export function TokenCombobox({
  value,
  onChange,
  options,
  placeholder = "Select token",
  withoutSearch = false,
  className = "",
  containerClassName = "",
  searchPlaceholder = "Search token...",
}: TokenComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild className={cn(className)}>
        <Button
          className="justify-between rounded-full text-primary"
          role="combobox"
          variant="secondary"
        >
          {(() => {
            const current = value;
            const token = options.find(
              (t) => t.value.toLowerCase() === current.toLowerCase()
            );
            if (!token) {
              return (
                <span className="text-primary text-sm">{placeholder}</span>
              );
            }
            return (
              <div className="flex flex-1 flex-row items-center gap-1 [&>svg]:size-5">
                {token.icon}
                <span className="font-medium text-sm">{token.value}</span>
              </div>
            );
          })()}
          <ChevronDown className="ml-1 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("w-fit p-0", containerClassName)}>
        <Command>
          {!withoutSearch && <CommandInput placeholder={searchPlaceholder} />}
          <CommandList>
            {!withoutSearch && <CommandEmpty>No token found.</CommandEmpty>}
            <CommandGroup>
              {options
                .filter(
                  (token) => token.value.toLowerCase() !== value.toLowerCase()
                )
                .map((token) => (
                  <CommandItem
                    key={token.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue);
                      setOpen(false);
                    }}
                    value={token.value}
                  >
                    <div className="flex flex-1 items-center gap-2">
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
