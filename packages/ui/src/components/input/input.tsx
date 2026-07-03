"use client";

import { useState } from "react";
import { EyeOnIcon, EyeOffIcon } from "../../icons";
import { Container } from "../container";
import { Text } from "../text";
import { InputProps } from "./input.types";

export function Input({
  label,
  required,
  hint,
  error,
  leftIcon,
  rightIcon,
  leftSlot,
  disabled,
  type,
  ...props
}: InputProps) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);

  const inputEl = (
    <input
      {...props}
      type={isPassword ? (showPassword ? "text" : "password") : type}
      disabled={disabled}
      className={[
        "w-full h-10 border-0 outline-none transition-colors bg-transparent font-sans",
        "px-4 text-xs placeholder:text-secondary",
        disabled
          ? "text-tertiary cursor-not-allowed pointer-events-none"
          : error
          ? "text-danger-text-icons"
          : "text-primary",
        leftIcon ? "pl-10" : "",
        (isPassword || rightIcon) ? "pr-10" : "",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    />
  );

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
          "flex items-center rounded-xl border transition-colors overflow-hidden",
          disabled
            ? "bg-muted border-transparent"
            : error
            ? "bg-surface border-danger-border focus-within:border-danger-border"
            : "bg-surface border-transparent focus-within:border-brand-border",
        ].join(" ")}
      >
        {leftSlot && (
          <>
            <Container className="shrink-0 h-10 flex items-center px-3 bg-muted">
              {leftSlot}
            </Container>
            <Container className="w-px h-6 bg-border shrink-0" />
          </>
        )}

        <Container className="relative flex items-center flex-1">
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

          {inputEl}

          {isPassword ? (
            <Container
              as="button"
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className={[
                "absolute right-3 size-5 shrink-0 flex items-center justify-center cursor-pointer",
                error ? "text-danger-text-icons" : "text-secondary",
              ].join(" ")}
            >
              {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
            </Container>
          ) : rightIcon && (
            <Container
              as="span"
              className={[
                "absolute right-3 size-5 shrink-0 flex items-center justify-center",
                error ? "text-danger-text-icons" : "text-secondary",
              ].join(" ")}
            >
              {rightIcon}
            </Container>
          )}
        </Container>
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
