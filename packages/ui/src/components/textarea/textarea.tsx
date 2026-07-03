"use client";

import { Container } from "../container";
import { Text } from "../text";
import { TextareaProps } from "./textarea.types";

export function Textarea({
  label,
  required,
  hint,
  error,
  disabled,
  className,
  ...props
}: TextareaProps) {
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

      <Container
        className={[
          "rounded-2xl border transition-colors",
          disabled
            ? "bg-muted border-transparent"
            : error
            ? "bg-surface border-danger-border focus-within:border-danger-border"
            : "bg-surface border-transparent focus-within:border-brand-border",
        ].join(" ")}
      >
        <textarea
          {...props}
          disabled={disabled}
          className={[
            "w-full min-h-24 border-0 outline-none bg-transparent font-sans resize-none",
            "px-4 py-3 text-xs placeholder:text-secondary transition-colors",
            disabled
              ? "text-tertiary cursor-not-allowed pointer-events-none"
              : error
              ? "text-danger-text-icons"
              : "text-primary",
            className,
          ].filter(Boolean).join(" ")}
        />
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
