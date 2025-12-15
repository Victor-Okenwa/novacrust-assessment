import * as React from "react";

import { Input } from "./input";

type CurrencyInputProps = React.ComponentProps<"input">;

export function CurrencyInput({ className, onChange, ...props }: CurrencyInputProps) {
    return (
        <Input
            type="text"
            inputMode="decimal"
            {...props}
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
                const formatted = numeric.toLocaleString("en-US", {
                    minimumFractionDigits: 0,
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
            className={className}
        />
    );
}


