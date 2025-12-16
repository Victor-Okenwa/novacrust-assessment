import type * as React from "react";

import { Input } from "./input";

type AccountNumberInputProps = React.ComponentProps<"input"> & {
  maxLength?: number;
};

export function AccountNumberInput({
  maxLength = 10,
  onChange,
  ...props
}: AccountNumberInputProps) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = event.target.value.replace(/\D/g, "");

    if (maxLength) {
      value = value.slice(0, maxLength);
    }

    if (onChange) {
      const syntheticEvent = {
        ...event,
        target: {
          ...event.target,
          value,
        },
        currentTarget: {
          ...event.currentTarget,
          value,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      onChange(syntheticEvent);
    }
  };

  return (
    <Input
      {...props}
      inputMode="numeric"
      maxLength={maxLength}
      onChange={handleChange}
      pattern="[0-9]*"
      type="text"
    />
  );
}
