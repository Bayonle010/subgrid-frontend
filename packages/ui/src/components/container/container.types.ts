import { ComponentPropsWithRef, ElementType } from "react";

export type ContainerProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentPropsWithRef<T>;
