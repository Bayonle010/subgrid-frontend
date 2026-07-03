"use client";

import { useState } from "react";
import { Container } from "../container";
import { Text } from "../text";
import { RadioProps } from "./radio.types";

export function Radio({
  label,
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
  ...props
}: RadioProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    if (!isControlled) {
      setInternalChecked(true);
    }
    onChange?.(true);
  };

  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={[
        "flex-1 flex items-center gap-3 bg-surface rounded-2xl px-4 py-3 transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border",
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      <Container
        className={[
          "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
          checked
            ? "border-brand-tertiary-bg-bold"
            : "border-border",
        ].join(" ")}
      >
        {checked && (
          <Container className="w-2.5 h-2.5 rounded-full bg-brand-tertiary-bg-bold" />
        )}
      </Container>
      <Text variant="bodySmall" className="text-primary">
        {label}
      </Text>
    </button>
  );
}
