"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDownIcon } from "../../icons";
import { Container } from "../container";
import { Text } from "../text";
import { CountryCode, COUNTRIES } from "../country-selector/countries";
import { PhoneInputProps } from "./phone-input.types";

interface CountrySelectProps {
  value: CountryCode;
  onChange: (country: CountryCode) => void;
  disabled?: boolean;
  error?: boolean;
  inputClassName?: string;
}

function CountrySelect({
  value,
  onChange,
  disabled,
  error,
  inputClassName,
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected =
    COUNTRIES.find((c) => c.code === value) ??
    COUNTRIES.find((c) => c.code === "GB")!;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <Container className="relative shrink-0" ref={ref}>
      <Container
        as="button"
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className={[
          "h-10 flex items-center gap-1.5 px-3 rounded-l-xl rounded-r-sm border cursor-pointer disabled:cursor-not-allowed",
          inputClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span className="text-xs leading-none">{selected.flag}</span>
        <span
          className={[
            "text-xs font-sans",
            error ? "text-danger-text-icons" : "text-primary",
          ].join(" ")}
        >
          {selected.dialCode}
        </span>
        <ChevronDownIcon
          size={16}
          className={[
            "transition-transform",
            open ? "rotate-180" : "",
            error ? "text-danger-text-icons" : "text-secondary",
          ].join(" ")}
        />
      </Container>

      {open && (
        <Container className="absolute top-full left-0 mt-2 z-50 w-40 rounded-xl bg-surface shadow-300 border border-border overflow-hidden">
          <Container className="overflow-y-auto max-h-52">
            {COUNTRIES.map((country) => (
              <Container
                as="button"
                type="button"
                key={country.code}
                onClick={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
                className={[
                  "w-full flex items-center gap-2 px-3 py-2 text-left transition-colors hover:bg-muted",
                  selected.code === country.code ? "bg-brand-bg-light" : "",
                ].join(" ")}
              >
                <span className="text-xs leading-none shrink-0">
                  {country.flag}
                </span>
                <span className="text-xs font-sans text-primary shrink-0">
                  {country.dialCode}
                </span>
              </Container>
            ))}
          </Container>
        </Container>
      )}
    </Container>
  );
}

export function PhoneInput({
  label,
  required,
  hint,
  error,
  disabled,
  placeholder,
  defaultCountry = "GB",
  value,
  onChange,
}: PhoneInputProps) {
  const [country, setCountry] = useState<CountryCode>(defaultCountry);
  const [inputValue, setInputValue] = useState("");

  function handleCountryChange(selected: CountryCode) {
    setCountry(selected);
    const countryData = COUNTRIES.find((c) => c.code === selected);
    const newFull = countryData
      ? `${countryData.dialCode}${inputValue}`
      : inputValue;
    onChange?.(newFull);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setInputValue(raw);
    const countryData = COUNTRIES.find((c) => c.code === country);
    const full = countryData ? `${countryData.dialCode}${raw}` : raw;
    onChange?.(full);
  }

  return (
    <Container className="flex flex-col gap-1">
      {label && (
        <Container as="label" className="flex items-center gap-0.5 mb-1">
          <Text variant="bodySmall" className="text-primary">
            {label}
          </Text>
          {required && (
            <Text variant="bodySmall" className="text-danger-text-icons">
              *
            </Text>
          )}
        </Container>
      )}

      <Container className="flex items-center gap-1">
        <CountrySelect
          value={country}
          onChange={handleCountryChange}
          disabled={disabled}
          error={!!error}
          inputClassName={
            disabled
              ? "bg-muted border-transparent text-tertiary"
              : error
                ? "bg-surface border-danger-border"
                : "bg-surface border-transparent"
          }
        />

        <input
          type="tel"
          value={inputValue}
          onChange={handleInputChange}
          disabled={disabled}
          placeholder={placeholder ?? "Enter phone number"}
          className={[
            "flex-1 h-10 rounded-r-2xl rounded-l-sm border outline-none px-4 text-xs transition-colors font-sans",
            "placeholder:text-secondary",
            disabled
              ? "bg-muted border-transparent text-tertiary cursor-not-allowed"
              : error
                ? "bg-surface border-danger-border text-danger-text-icons focus:border-danger-border"
                : "bg-surface border-transparent text-primary focus:border-brand-border",
          ].join(" ")}
        />
      </Container>

      {error && (
        <Text variant="bodySmall" className="text-danger-text-icons">
          {error}
        </Text>
      )}
      {!error && hint && (
        <Text variant="bodySmall" className="text-tertiary">
          {hint}
        </Text>
      )}
    </Container>
  );
}
