import { ReactNode } from "react";

export interface NavItemType {
  title: string;
  link: string;
  icon: ReactNode;
  slug: string;
  inActiveIcon: ReactNode;
}
