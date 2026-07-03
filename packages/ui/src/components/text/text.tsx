import { ElementType } from "react";
import { Container } from "../container";
import { TextProps, TextTone, TextVariant } from "./text.types";

const defaultElement: Record<TextVariant, ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  bodyLarge: "p",
  bodyRegular: "p",
  bodySmall: "p",
  bodyXSmall: "p",
  button: "span",
  buttonXS: "span",
};

const toneStyles: Record<TextTone, string> = {
  primary: "text-primary",
  secondary: "text-secondary",
  tertiary: "text-tertiary",
  inverted: "text-inverted",
  brand: "text-brand-text-icons",
  "brand-secondary": "text-brand-secondary-text-icons",
  "brand-tertiary": "text-brand-tertiary-text-icons",
  danger: "text-danger-text-icons",
  "danger-bold": "text-danger-bg-bold",
  success: "text-success-text-icons",
  warning: "text-warning-text-icons",
  info: "text-info-text-icons",
};

const variantStyles: Record<TextVariant, string> = {
  h1: "font-semibold text-[32px] leading-[40px] md:text-[36px] md:leading-[40px] lg:text-[48px] lg:leading-[56px]",
  h2: "font-semibold text-[24px] leading-[32px] md:text-[28px] md:leading-[32px] lg:text-[32px] lg:leading-[40px]",
  h3: "font-semibold text-[20px] leading-[24px] md:text-[22px] md:leading-[24px] lg:text-[24px] lg:leading-[32px]",
  h4: "font-semibold text-[16px] leading-[20px] md:text-[18px] md:leading-[24px] lg:text-[18px] lg:leading-[24px]",
  h5: "font-semibold text-[14px] leading-[20px] md:text-[16px] md:leading-[24px] lg:text-[16px] lg:leading-[20px]",
  bodyLarge:
    "font-normal text-[18px] leading-[32px] lg:text-[20px] lg:leading-[32px]",
  bodyRegular: "font-normal text-[16px] leading-[24px]",
  bodySmall: "font-normal text-[14px] leading-[20px]",
  bodyXSmall: "font-normal text-[12px] leading-[20px]",
  button: "font-semibold text-[14px] leading-[20px]",
  buttonXS:
    "font-medium text-[14px] leading-[20px] md:text-[12px] md:leading-[20px]",
};

export function Text<T extends ElementType = "p">({
  variant = "bodyRegular",
  tone,
  as,
  children,
  className,
  ...props
}: TextProps<T>) {
  const Tag = as ?? defaultElement[variant];

  return (
    <Container
      as={Tag}
      {...props}
      className={[variantStyles[variant], tone ? toneStyles[tone] : undefined, className].filter(Boolean).join(" ")}
    >
      {children}
    </Container>
  );
}
