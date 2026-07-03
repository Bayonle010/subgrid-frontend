export interface OtpInputProps {
  length?: number;
  value?: string;
  onChange?: (value: string) => void;
  label?: string;
  required?: boolean;
  hint?: string;
  error?: string;
  disabled?: boolean;
}
