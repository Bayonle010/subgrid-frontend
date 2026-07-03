import { CountryCode } from "../country-selector/countries";

export interface PhoneInputProps {
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  defaultCountry?: CountryCode;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
