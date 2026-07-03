import { ReactNode } from "react";

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  leftIcon?: ReactNode;
}
