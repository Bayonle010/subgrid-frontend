import { ComponentPropsWithoutRef, ElementType } from "react";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "bodyLarge"
  | "bodyRegular"
  | "bodySmall"
  | "bodyXSmall"
  | "button"
  | "buttonXS";

export type TextTone =
  | "primary"
  | "secondary"
  | "tertiary"
  | "inverted"
  | "brand"
  | "brand-secondary"
  | "brand-tertiary"
  | "danger"
  | "danger-bold"
  | "success"
  | "warning"
  | "info";

export type TextProps<T extends ElementType> = {
  variant?: TextVariant;
  tone?: TextTone;
  as?: T;
} & ComponentPropsWithoutRef<T>;
