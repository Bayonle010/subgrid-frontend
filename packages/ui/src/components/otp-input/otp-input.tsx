"use client";

import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react";
import { Container } from "../container";
import { Text } from "../text";
import { OtpInputProps } from "./otp-input.types";

export function OtpInput({
  length = 6,
  value,
  onChange,
  label,
  required,
  hint,
  error,
  disabled,
}: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [internalValue, setInternalValue] = useState(value ?? "");

  const controlled = value !== undefined;
  const currentValue = controlled ? value : internalValue;
  const digits = Array.from({ length }, (_, i) => currentValue[i] ?? "");

  function commit(next: string[]) {
    const str = next.join("");
    if (!controlled) setInternalValue(str);
    onChange?.(str);
  }

  function focusAt(index: number) {
    inputRefs.current[index]?.focus();
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>, index: number) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) return;

    const digit = raw[raw.length - 1];
    const next = digits.map((d, i) => (i === index ? digit : d));
    commit(next);

    if (index < length - 1) focusAt(index + 1);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>, index: number) {
    if (e.key === "Backspace") {
      e.preventDefault();
      if (digits[index]) {
        const next = digits.map((d, i) => (i === index ? "" : d));
        commit(next);
      } else if (index > 0) {
        const next = digits.map((d, i) => (i === index - 1 ? "" : d));
        commit(next);
        focusAt(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusAt(index - 1);
    } else if (e.key === "ArrowRight" && index < length - 1) {
      focusAt(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    const next = Array.from({ length }, (_, i) => pasted[i] ?? digits[i] ?? "");
    commit(next);

    const focusIndex = Math.min(pasted.length, length - 1);
    focusAt(focusIndex);
  }

  const cellBase = [
    "w-14 h-14 border outline-none rounded-2xl transition-colors",
    "font-sans font-semibold text-xl leading-6 text-center",
  ].join(" ");

  const cellState = disabled
    ? "bg-muted border-transparent text-tertiary cursor-not-allowed"
    : error
    ? "bg-surface border-danger-border text-primary"
    : "bg-surface border-transparent text-primary focus:border-brand-border";

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

      <Container className="flex items-center gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => { inputRefs.current[index] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={2}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            onFocus={(e) => e.target.select()}
            className={[cellBase, cellState].join(" ")}
          />
        ))}
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
