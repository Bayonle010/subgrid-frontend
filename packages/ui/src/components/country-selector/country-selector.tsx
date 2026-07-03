"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../icons";
import { Container } from "../container";
import { Text } from "../text";
import { COUNTRIES, Country } from "./countries";
import { CountrySelectorProps } from "./country-selector.types";

export const DEFAULT_COUNTRY: Country = {
  code: "GB",
  name: "United Kingdom",
  dialCode: "+44",
  flag: "🇬🇧",
};

export function CountrySelector({
  value = DEFAULT_COUNTRY,
  onChange,
  disabled,
}: CountrySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleSelect(country: Country) {
    onChange?.(country);
    setOpen(false);
  }

  return (
    <Container className="relative" ref={ref}>
      <Container
        as="button"
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
      >
        <Text variant="bodySmall" className="leading-none">{value.flag}</Text>
        <Text variant="bodySmall" className="text-primary">{value.dialCode}</Text>
        <ChevronDownIcon
          size={16}
          className={["text-secondary transition-transform", open ? "rotate-180" : ""].join(" ")}
        />
      </Container>

      {open && (
        <Container className="absolute top-full left-0 mt-2 z-50 w-40 rounded-2xl bg-surface shadow-300 border border-border overflow-hidden">
          <Container className="overflow-y-auto max-h-52">
            {COUNTRIES.map((country) => (
              <Container
                as="button"
                type="button"
                key={country.code}
                onClick={() => handleSelect(country)}
                className={[
                  "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors",
                  "hover:bg-muted",
                  value.code === country.code ? "bg-brand-bg-light" : "",
                ].join(" ")}
              >
                <Text variant="bodySmall" className="leading-none shrink-0">{country.flag}</Text>
                <Text variant="bodySmall" className="text-primary shrink-0">{country.dialCode}</Text>
              </Container>
            ))}
          </Container>
        </Container>
      )}
    </Container>
  );
}
