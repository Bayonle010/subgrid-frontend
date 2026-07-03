import { Country } from "./countries";

export type { Country };

export interface CountrySelectorProps {
  value?: Country;
  onChange?: (country: Country) => void;
  disabled?: boolean;
}
