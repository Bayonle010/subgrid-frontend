import { ElementType } from "react";
import { ContainerProps } from "./container.types";

export function Container<T extends ElementType = "div">({
  as,
  children,
  ...props
}: ContainerProps<T>) {
  const Tag = as ?? "div";
  return <Tag {...props}>{children}</Tag>;
}
