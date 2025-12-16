import type * as React from "react";

import { Input } from "./input";

type CurrencyInputProps = React.ComponentProps<"input">;

export function CurrencyInput({
  className,
  onChange,
  ...props
}: CurrencyInputProps) {
  return (
    <Input
      inputMode="decimal"
      type="text"
      {...props}
      className={className}
      onChange={(e) => {
        const raw = e.target.value.replace(/,/g, "");
        if (raw === "") {
          onChange?.(e);
          return;
        }
        const numeric = Number(raw);
        if (Number.isNaN(numeric)) {
          return;
        }
        // Round to 2 decimal places before formatting
        const rounded = Math.round(numeric * 100) / 100;
        const formatted = rounded.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: formatted,
          },
          currentTarget: {
            ...e.currentTarget,
            value: formatted,
          },
        } as React.ChangeEvent<HTMLInputElement>;

        onChange?.(syntheticEvent);
      }}
    />
  );
}
