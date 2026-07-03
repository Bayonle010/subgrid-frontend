"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  SuccessIcon,
  WarningIcon,
  DangerIcon,
  InfoIcon,
  YesInternetIcon,
  NoInternetIcon,
} from "@subgrid/ui/icons";
import { Button, Container, Text } from "@subgrid/ui";
import type { ToastItem, ToastPlacement } from "./toast.types";

const VARIANT_CONFIG = {
  success: {
    icon: SuccessIcon,
    iconBg: "bg-success-bg-light",
    iconColor: "text-success-text-icons",
    glowStart: "rgba(0, 125, 62, 1)",
    glowEnd: "rgba(0, 125, 62, 0)",
    border: "",
  },
  warning: {
    icon: WarningIcon,
    iconBg: "bg-warning-bg-light",
    iconColor: "text-warning-text-icons",
    glowStart: "rgba(182, 91, 0, 1)",
    glowEnd: "rgba(182, 91, 0, 0)",
    border: "border border-warning-border",
  },
  error: {
    icon: DangerIcon,
    iconBg: "bg-danger-bg-light",
    iconColor: "text-danger-text-icons",
    glowStart: "rgba(239, 18, 18, 1)",
    glowEnd: "rgba(239, 18, 18, 0)",
    border: "",
  },
  info: {
    icon: InfoIcon,
    iconBg: "bg-info-bg-light",
    iconColor: "text-info-text-icons",
    glowStart: "rgba(14, 165, 233, 1)",
    glowEnd: "rgba(14, 165, 233, 0)",
    border: "",
  },
  "network-on": {
    icon: YesInternetIcon,
    iconBg: "bg-success-bg-light",
    iconColor: "text-success-text-icons",
    glowStart: "rgba(0, 125, 62, 1)",
    glowEnd: "rgba(0, 125, 62, 0)",
    border: "",
  },
  "network-off": {
    icon: NoInternetIcon,
    iconBg: "bg-warning-bg-light",
    iconColor: "text-warning-text-icons",
    glowStart: "rgba(182, 91, 0, 1)",
    glowEnd: "rgba(182, 91, 0, 0)",
    border: "",
  },
} as const;

function getEntryAnimation(placement: ToastPlacement) {
  if (placement.includes("right")) return { x: 60, opacity: 0 };
  if (placement.includes("left")) return { x: -60, opacity: 0 };
  if (placement.startsWith("top")) return { y: -20, opacity: 0 };
  return { y: 20, opacity: 0 };
}

interface ToastProps {
  toast: ToastItem;
  placement: ToastPlacement;
  onRemove: (id: string) => void;
}

export function Toast({ toast, placement, onRemove }: ToastProps) {
  const config = VARIANT_CONFIG[toast.variant];
  const Icon = config.icon;
  const initial = getEntryAnimation(placement);

  useEffect(() => {
    if (toast.duration === Infinity) return;
    const timer = setTimeout(() => onRemove(toast.id), toast.duration ?? 4000);
    return () => clearTimeout(timer);
  }, [toast.id, toast.duration, onRemove]);

  const handleAction = () => {
    toast.action?.onClick?.();
    onRemove(toast.id);
  };

  return (
    <motion.div
      layout
      initial={initial}
      animate={{ x: 0, y: 0, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 320, damping: 28 }}
      className={`flex items-center gap-3 w-89.5 bg-surface rounded-2xl shadow-200 px-4 py-3 overflow-hidden ${config.border}`}
    >
      <Container className="relative shrink-0 overflow-hidden rounded-xl">
        {/* Radial glow blob — clipped to the icon square bounds */}
        <Container
          as="span"
          aria-hidden
          className="absolute pointer-events-none"
          style={{
            width: 91,
            height: 91,
            top: -34,
            left: -33,
            opacity: 0.15,
            background: `radial-gradient(circle, ${config.glowStart} 0%, ${config.glowEnd} 100%)`,
          }}
        />
        <Container className={`relative rounded-xl p-2.5 ${config.iconBg}`}>
          <Icon size={20} className={config.iconColor} />
        </Container>
      </Container>

      <Container className="flex-1 min-w-0">
        <Text variant="buttonXS" className="text-primary">
          {toast.title}
        </Text>
        {toast.description && (
          <Text variant="bodyXSmall" className="text-secondary">
            {toast.description}
          </Text>
        )}
      </Container>

      <Button variant="neutral" size="small" onClick={handleAction}>
        {toast.action?.label ?? "Cancel"}
      </Button>
    </motion.div>
  );
}
