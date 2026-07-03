"use client";

import { ButtonProps } from "./button.types";

const variantStyles = {
  primary: [
    "bg-brand-bg-bold text-inverted",
    "hover:bg-brand-hover",
    "active:bg-brand-pressed",
    "disabled:bg-brand-bg-light disabled:text-secondary disabled:opacity-100",
  ].join(" "),
  secondary: [
    "bg-brand-secondary-bg-bold text-inverted",
    "hover:bg-brand-secondary-hover",
    "active:bg-brand-secondary-pressed",
    "disabled:bg-brand-secondary-bg-light disabled:text-secondary disabled:opacity-100",
  ].join(" "),
  tertiary: [
    "bg-transparent text-brand-tertiary-text-icons",
    "hover:bg-transparent hover:opacity-50",
    "active:bg-transparent active:opacity-100",
  ].join(" "),
  neutral: [
    "bg-muted text-primary",
    "hover:bg-transparent",
    "active:bg-background",
  ].join(" "),
  transparent: [
    "bg-transparent text-primary",
    "hover:bg-transparent hover:opacity-50",
    "active:bg-transparent active:opacity-100",
  ].join(" "),
  green: [
    "bg-success-bg-bold text-inverted",
    "hover:bg-success-hover hover:text-inverted",
    "active:bg-success-pressed active:text-inverted",
  ].join(" "),
  warning: [
    "bg-warning-bg-bold text-inverted",
    "hover:bg-warning-hover hover:text-inverted",
    "active:bg-warning-pressed active:text-inverted",
  ].join(" "),
  danger: [
    "bg-danger-bg-bold text-inverted",
    "hover:bg-danger-hover hover:text-inverted",
    "active:bg-danger-pressed active:text-inverted",
  ].join(" "),
};

const sizeStyles = {
  regular: " h-10 px-3 text-sm rounded-xl font-semibold min-w-10",
  medium: " px-4 h-8 text-base rounded-lg min-w-10",
  small: "px-3 h-7 text-xs font-medium rounded-lg min-w-10",
};

export function Button({
  variant = "primary",
  size = "regular",
  loading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={[
        "inline-flex  items-center  justify-center gap-2  font-medium transition-colors cursor-pointer",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-border",
        "disabled:opacity-50 disabled:cursor-not-allowed  disabled:pointer-events-none",
        variantStyles[variant],
        sizeStyles[size],
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {loading ? (
        <span className="size-5 animate-spin rounded-full border-2 border-current border-t-transparent shrink-0" />
      ) : (
        leftIcon && (
          <span className="size-5 shrink-0 flex items-center justify-center">
            {leftIcon}
          </span>
        )
      )}
      {children}
      {!loading && rightIcon && (
        <span className="size-5 shrink-0 flex items-center justify-center">
          {rightIcon}
        </span>
      )}
    </button>
  );
}
