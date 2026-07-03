"use client";

import { useState } from "react";
import { TickIcon } from "../../icons";
import { CheckboxProps } from "./checkbox.types";

export function Checkbox({
  checked: controlledChecked,
  defaultChecked = false,
  onChange,
  disabled = false,
  className,
  ...props
}: CheckboxProps) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;

  const handleClick = () => {
    if (disabled) return;
    if (!isControlled) {
      setInternalChecked((prev) => !prev);
    }
    onChange?.(!checked);
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={handleClick}
      className={[
        "inline-flex items-center justify-center w-5 h-5 rounded-md border transition-colors shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border",
        checked
          ? "bg-brand-tertiary-bg-bold border-brand-tertiary-border"
          : "bg-surface border-border",
        disabled
          ? "opacity-50 cursor-not-allowed pointer-events-none"
          : "cursor-pointer",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {checked && <TickIcon className="text-inverted" />}
    </button>
  );
}
