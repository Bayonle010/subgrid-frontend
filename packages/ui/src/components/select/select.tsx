"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../icons";
import { Container } from "../container";
import { Text } from "../text";
import { SelectProps } from "./select.types";

export function Select({
  options,
  value,
  onChange,
  label,
  required,
  placeholder = "Select an option",
  hint,
  error,
  disabled,
  leftIcon,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(optionValue: string) {
    onChange?.(optionValue);
    setOpen(false);
  }

  return (
    <Container className="flex flex-col gap-1">
      {label && (
        <Container as="label" className="flex items-center gap-0.5 mb-1">
          <Text variant="bodySmall" className="text-primary">{label}</Text>
          {required && (
            <Text variant="bodySmall" className="text-danger-text-icons">*</Text>
          )}
        </Container>
      )}

      <Container className="relative" ref={ref}>
        <Container
          as="button"
          type="button"
          disabled={disabled}
          onClick={() => setOpen((prev) => !prev)}
          className={[
            "w-full h-10 rounded-2xl border outline-none px-4 text-xs font-sans transition-colors",
            "flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed",
            leftIcon ? "pl-10" : "",
            open
              ? "border-brand-border"
              : error
              ? "border-danger-border"
              : "border-transparent",
            disabled
              ? "bg-muted text-tertiary"
              : error
              ? "bg-surface text-danger-text-icons"
              : "bg-surface text-primary",
          ].filter(Boolean).join(" ")}
        >
          {leftIcon && (
            <Container
              as="span"
              className={[
                "absolute left-3 size-5 shrink-0 flex items-center justify-center",
                error ? "text-danger-text-icons" : "text-secondary",
              ].join(" ")}
            >
              {leftIcon}
            </Container>
          )}

          <span className={["flex-1 text-left truncate", !selected ? "text-secondary" : ""].join(" ")}>
            {selected ? selected.label : placeholder}
          </span>

          <ChevronDownIcon
            size={16}
            className={[
              "shrink-0 transition-transform",
              open ? "rotate-180" : "",
              error ? "text-danger-text-icons" : "text-secondary",
            ].join(" ")}
          />
        </Container>

        {open && (
          <Container className="absolute top-full left-0 right-0 mt-1 z-50 rounded-2xl bg-surface shadow-300 border border-border overflow-hidden">
            <Container className="overflow-y-auto max-h-52">
              {options.map((option) => (
                <Container
                  as="button"
                  type="button"
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={[
                    "w-full flex items-center px-4 py-2.5 text-left text-xs font-sans transition-colors hover:bg-muted",
                    value === option.value ? "bg-brand-bg-light text-brand-text-icons" : "text-primary",
                  ].join(" ")}
                >
                  {option.label}
                </Container>
              ))}
            </Container>
          </Container>
        )}
      </Container>

      {error && (
        <Text variant="bodySmall" className="text-danger-text-icons">{error}</Text>
      )}
      {!error && hint && (
        <Text variant="bodySmall" className="text-tertiary">{hint}</Text>
      )}
    </Container>
  );
}
