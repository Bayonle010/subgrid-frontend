"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Container, Input, Text } from "@subgrid/ui";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  CopyIcon,
  DangerIcon,
  DrawerOutIcon,
  EyeOnIcon,
  ThemeIcon,
  WarningIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useCreateWebhook, useDisableWebhook, useListWebhooks, useUpdateWebhook } from "../hooks/webhook.hooks";
import { Webhook, WebhookEvent, WEBHOOK_EVENT_GROUPS } from "../types/webhook.type";

// ── Modal shell ───────────────────────────────────────────────────────────────
const Modal = ({ onClose, children }: { onClose: () => void; children: React.ReactNode }) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return createPortal(
    <Container className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <Container className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <Container className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </Container>
    </Container>,
    document.body,
  );
};

// ── Add endpoint modal ────────────────────────────────────────────────────────
const AddEndpointModal = ({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (webhook: Webhook) => void;
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [urlError, setUrlError] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<Set<WebhookEvent>>(new Set());

  const { mutate, isPending } = useCreateWebhook((webhook) => {
    onCreated(webhook);
    onClose();
  });

  const validateUrl = (val: string) => {
    try {
      const u = new URL(val);
      if (u.protocol !== "https:") return "URL must use HTTPS.";
      return "";
    } catch {
      return "Please enter a valid URL.";
    }
  };

  const toggleEvent = (event: WebhookEvent, checked: boolean) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      checked ? next.add(event) : next.delete(event);
      return next;
    });
  };

  const toggleGroup = (events: WebhookEvent[]) => {
    const allSelected = events.every((e) => selectedEvents.has(e));
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      events.forEach((e) => (allSelected ? next.delete(e) : next.add(e)));
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUrl(url.trim());
    if (err) { setUrlError(err); return; }
    mutate({
      name: name.trim(),
      url: url.trim(),
      subscribedEvents: selectedEvents.size > 0 ? Array.from(selectedEvents) : undefined,
    });
  };

  const isValid = name.trim() && url.trim() && !urlError;

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border gap-4">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Add endpoint</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Register a URL to receive real-time event notifications.
          </Text>
        </Container>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0 mt-0.5"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <form onSubmit={handleSubmit}>
        <Container className="px-6 py-5 flex flex-col gap-5 max-h-[65vh] overflow-y-auto">
          <Input
            label="Endpoint name"
            placeholder="e.g. Production server, Slack alerts"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Container>
            <Input
              label="Endpoint URL"
              placeholder="https://your-server.com/webhooks/subgrid"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
              onBlur={() => { if (url.trim()) setUrlError(validateUrl(url.trim())); }}
              error={urlError}
              required
            />
            <Text variant="bodyXSmall" className="text-secondary mt-1.5">
              Must be an HTTPS URL reachable from the internet.
            </Text>
          </Container>

          {/* Events */}
          <Container>
            <Container className="flex items-center justify-between mb-2">
              <Container>
                <Text variant="bodySmall" className="text-primary font-medium">Events to listen to</Text>
                <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                  Leave all unselected to receive every event.
                </Text>
              </Container>
              {selectedEvents.size > 0 && (
                <Text variant="bodyXSmall" className="text-brand-text-icons font-medium shrink-0 ml-2">
                  {selectedEvents.size} selected
                </Text>
              )}
            </Container>

            {selectedEvents.size === 0 && (
              <Container className="flex items-start gap-2 mb-3 px-3 py-2.5 bg-brand-bg-light border border-brand-border rounded-xl">
                <DrawerOutIcon size={13} className="text-brand-text-icons shrink-0 mt-0.5" />
                <Text variant="bodyXSmall" className="text-secondary">
                  Subscribed to <span className="text-primary font-medium">all events</span>. Select specific events to narrow down.
                </Text>
              </Container>
            )}

            <Container className="flex flex-col gap-4">
              {WEBHOOK_EVENT_GROUPS.map((group) => {
                const groupEventValues = group.events.map((e) => e.value);
                const allChecked = groupEventValues.every((e) => selectedEvents.has(e));
                const someChecked = groupEventValues.some((e) => selectedEvents.has(e));
                return (
                  <Container key={group.label}>
                    <Container className="flex items-center justify-between mb-2">
                      <Text variant="bodyXSmall" className="text-secondary font-medium uppercase tracking-wider">
                        {group.label}
                      </Text>
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupEventValues)}
                        className="text-[11px] font-medium text-brand-text-icons hover:underline cursor-pointer"
                      >
                        {allChecked ? "Deselect all" : someChecked ? "Select all" : "Select all"}
                      </button>
                    </Container>
                    <Container className="flex flex-col gap-1.5">
                      {group.events.map((ev) => (
                        <EventCheckbox
                          key={ev.value}
                          value={ev.value}
                          label={ev.label}
                          description={ev.description}
                          checked={selectedEvents.has(ev.value)}
                          onChange={(checked) => toggleEvent(ev.value, checked)}
                        />
                      ))}
                    </Container>
                  </Container>
                );
              })}
            </Container>
          </Container>

          <Container className="flex items-start gap-2.5 px-3 py-3 bg-muted border border-border rounded-xl">
            <DrawerOutIcon size={14} className="text-secondary shrink-0 mt-0.5" />
            <Text variant="bodyXSmall" className="text-secondary">
              A <span className="font-mono text-primary font-medium">signing secret</span> will be generated after creation — copy it immediately, it won&apos;t be shown again.
            </Text>
          </Container>
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="neutral" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            leftIcon={<AddIcon size={16} />}
            disabled={!isValid || isPending}
            loading={isPending}
          >
            Add endpoint
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Event checkbox ────────────────────────────────────────────────────────────
const EventCheckbox = ({
  value,
  label,
  description,
  checked,
  onChange,
}: {
  value: WebhookEvent;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`w-full text-left flex items-start gap-3 px-3 py-2.5 rounded-xl border transition-all ${
      checked
        ? "border-[var(--brand-border)] bg-[var(--brand-bg-light)]"
        : "border-[var(--border)] hover:bg-[var(--muted)]"
    }`}
  >
    <Container
      className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
        checked
          ? "border-[var(--brand-text-icons)] bg-[var(--brand-text-icons)]"
          : "border-[var(--tertiary)]"
      }`}
    >
      {checked && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1 4L3 6L7 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </Container>
    <Container>
      <Text variant="bodyXSmall" className={`font-mono font-medium ${checked ? "text-brand-text-icons" : "text-primary"}`}>
        {label}
      </Text>
      <Text variant="bodyXSmall" className="text-secondary mt-0.5">{description}</Text>
    </Container>
  </button>
);

// ── Edit endpoint modal ───────────────────────────────────────────────────────
const EditEndpointModal = ({
  webhook,
  onClose,
}: {
  webhook: Webhook;
  onClose: () => void;
}) => {
  const [name, setName] = useState(webhook.name);
  const [url, setUrl] = useState(webhook.url);
  const [urlError, setUrlError] = useState("");
  const [selectedEvents, setSelectedEvents] = useState<Set<WebhookEvent>>(
    new Set(webhook.subscribedEvents),
  );

  const { mutate, isPending } = useUpdateWebhook(webhook.id, () => onClose());

  const validateUrl = (val: string) => {
    try {
      const u = new URL(val);
      if (u.protocol !== "https:") return "URL must use HTTPS.";
      return "";
    } catch {
      return "Please enter a valid URL.";
    }
  };

  const toggleEvent = (event: WebhookEvent, checked: boolean) => {
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      checked ? next.add(event) : next.delete(event);
      return next;
    });
  };

  const toggleGroup = (events: WebhookEvent[]) => {
    const allSelected = events.every((e) => selectedEvents.has(e));
    setSelectedEvents((prev) => {
      const next = new Set(prev);
      events.forEach((e) => (allSelected ? next.delete(e) : next.add(e)));
      return next;
    });
  };

  const hasChanges =
    name.trim() !== webhook.name ||
    url.trim() !== webhook.url ||
    JSON.stringify([...selectedEvents].sort()) !== JSON.stringify([...webhook.subscribedEvents].sort());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateUrl(url.trim());
    if (err) { setUrlError(err); return; }
    mutate({
      name: name.trim(),
      url: url.trim(),
      subscribedEvents: Array.from(selectedEvents),
    });
  };

  const isValid = name.trim() && url.trim() && !urlError && hasChanges;

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border gap-4">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Edit endpoint</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Update the URL, name, or subscribed events.
          </Text>
        </Container>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0 mt-0.5"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <form onSubmit={handleSubmit}>
        <Container className="px-6 py-5 flex flex-col gap-4 max-h-[65vh] overflow-y-auto">
          <Input
            label="Endpoint name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Endpoint URL"
            value={url}
            onChange={(e) => { setUrl(e.target.value); setUrlError(""); }}
            onBlur={() => { if (url.trim()) setUrlError(validateUrl(url.trim())); }}
            error={urlError}
            required
          />

          <Container>
            <Container className="flex items-center justify-between mb-3">
              <Text variant="bodySmall" className="text-primary font-medium">Subscribed events</Text>
              {selectedEvents.size > 0 && (
                <Text variant="bodyXSmall" className="text-brand-text-icons font-medium">
                  {selectedEvents.size} selected
                </Text>
              )}
            </Container>
            <Container className="flex flex-col gap-4">
              {WEBHOOK_EVENT_GROUPS.map((group) => {
                const groupEventValues = group.events.map((e) => e.value);
                const allChecked = groupEventValues.every((e) => selectedEvents.has(e));
                const someChecked = groupEventValues.some((e) => selectedEvents.has(e));
                return (
                  <Container key={group.label}>
                    <Container className="flex items-center justify-between mb-2">
                      <Text variant="bodyXSmall" className="text-secondary font-medium uppercase tracking-wider">
                        {group.label}
                      </Text>
                      <button
                        type="button"
                        onClick={() => toggleGroup(groupEventValues)}
                        className="text-[11px] font-medium text-brand-text-icons hover:underline cursor-pointer"
                      >
                        {allChecked ? "Deselect all" : someChecked ? "Select all" : "Select all"}
                      </button>
                    </Container>
                    <Container className="flex flex-col gap-1.5">
                      {group.events.map((ev) => (
                        <EventCheckbox
                          key={ev.value}
                          value={ev.value}
                          label={ev.label}
                          description={ev.description}
                          checked={selectedEvents.has(ev.value)}
                          onChange={(checked) => toggleEvent(ev.value, checked)}
                        />
                      ))}
                    </Container>
                  </Container>
                );
              })}
            </Container>
          </Container>
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="neutral" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" disabled={!isValid || isPending} loading={isPending}>
            Save changes
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Disable confirmation modal ────────────────────────────────────────────────
const DisableModal = ({
  webhook,
  onClose,
}: {
  webhook: Webhook;
  onClose: () => void;
}) => {
  const { mutate, isPending } = useDisableWebhook(webhook.id, () => onClose());

  return (
    <Modal onClose={onClose}>
      <Container className="px-6 pt-6 pb-4 flex items-start gap-3 border-b border-border">
        <Container className="w-9 h-9 rounded-xl bg-danger-bg-light flex items-center justify-center shrink-0">
          <DangerIcon size={18} className="text-danger-text-icons" />
        </Container>
        <Container className="flex-1">
          <Text variant="h5" className="text-primary font-semibold">Disable this endpoint?</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-1">
            SubGrid will stop delivering events to this URL. You can re-enable it later by editing the endpoint.
          </Text>
        </Container>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <Container className="px-6 py-5">
        <Container className="p-4 bg-muted rounded-xl border border-border">
          <Text variant="bodySmall" className="text-primary font-medium">{webhook.name}</Text>
          <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5 break-all">{webhook.url}</Text>
        </Container>
      </Container>

      <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
        <Button variant="neutral" onClick={onClose} disabled={isPending}>Keep active</Button>
        <Button variant="danger" onClick={() => mutate()} loading={isPending} disabled={isPending}>
          Yes, disable
        </Button>
      </Container>
    </Modal>
  );
};

// ── Webhook row ───────────────────────────────────────────────────────────────
const WebhookRow = ({
  webhook,
  onEdit,
  onDisable,
}: {
  webhook: Webhook;
  onEdit: (w: Webhook) => void;
  onDisable: (w: Webhook) => void;
}) => {
  const isActive = webhook.status === "ACTIVE";
  const displayUrl = webhook.url.replace(/^https?:\/\//, "");

  return (
    <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
      <Container className="flex items-start sm:items-center gap-4 min-w-0">
        <Container className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-brand-bg-light" : "bg-muted"}`}>
          <DrawerOutIcon size={16} className={isActive ? "text-brand-text-icons" : "text-secondary"} />
        </Container>

        <Container className="min-w-0">
          <Container className="flex items-center gap-2 flex-wrap">
            <Text variant="bodySmall" className="text-primary font-medium">{webhook.name}</Text>
            <Container
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-medium ${
                isActive
                  ? "bg-success-bg-light text-success-text-icons border-success-border"
                  : "bg-muted text-secondary border-border"
              }`}
            >
              <Container className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success-bg-bold" : "bg-secondary"}`} />
              {isActive ? "Active" : "Disabled"}
            </Container>
          </Container>

          <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5 truncate max-w-[320px]">
            {displayUrl}
          </Text>

          {webhook.subscribedEvents.length > 0 ? (
            <Container className="flex items-center gap-1.5 mt-1 flex-wrap">
              {webhook.subscribedEvents.slice(0, 3).map((ev) => (
                <Container
                  key={ev}
                  className="inline-flex items-center px-2 py-0.5 rounded-full bg-muted border border-border"
                >
                  <Text variant="bodyXSmall" className="text-secondary font-mono text-[10px]">{ev}</Text>
                </Container>
              ))}
              {webhook.subscribedEvents.length > 3 && (
                <Text variant="bodyXSmall" className="text-secondary text-[11px]">
                  +{webhook.subscribedEvents.length - 3} more
                </Text>
              )}
            </Container>
          ) : (
            <Text variant="bodyXSmall" className="text-secondary mt-1 italic">No events subscribed yet</Text>
          )}

          <Text variant="bodyXSmall" className="text-secondary mt-1">
            Added {new Date(webhook.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
          </Text>
        </Container>
      </Container>

      <Container className="flex items-center gap-2 shrink-0">
        <Button variant="secondary" size="small" leftIcon={<ThemeIcon size={13} />} onClick={() => onEdit(webhook)}>
          Edit
        </Button>
        <Button variant="danger" size="small" onClick={() => onDisable(webhook)}>
          Disable
        </Button>
      </Container>
    </Container>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <Container className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 animate-pulse">
    <Container className="w-9 h-9 rounded-xl bg-muted shrink-0" />
    <Container className="flex flex-col gap-2 flex-1">
      <Container className="h-3 w-40 bg-muted rounded-full" />
      <Container className="h-2.5 w-64 bg-muted rounded-full" />
      <Container className="flex gap-1.5">
        <Container className="h-2.5 w-24 bg-muted rounded-full" />
        <Container className="h-2.5 w-20 bg-muted rounded-full" />
      </Container>
    </Container>
  </Container>
);

// ── Main screen ───────────────────────────────────────────────────────────────
export const WebhooksScreen = () => {
  const { data: webhooks = [], isLoading } = useListWebhooks();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Webhook | null>(null);
  const [disableTarget, setDisableTarget] = useState<Webhook | null>(null);
  const [revealedWebhook, setRevealedWebhook] = useState<Webhook | null>(null);
  const [hasCopied, setHasCopied] = useState(false);

  const handleCreated = (webhook: Webhook) => {
    setRevealedWebhook(webhook);
    setHasCopied(false);
  };


  const handleCopySecret = () => {
    if (!revealedWebhook?.signingSecret) return;
    navigator.clipboard.writeText(revealedWebhook.signingSecret);
    setHasCopied(true);
  };

  const activeCount = webhooks.filter((w) => w.status === "ACTIVE").length;

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Webhooks</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5 max-w-lg">
            Register HTTPS endpoints to receive real-time notifications when events happen in your SubGrid account.
          </Text>
        </Container>
        <Button variant="primary" leftIcon={<AddIcon size={16} />} onClick={() => setShowAdd(true)}>
          Add endpoint
        </Button>
      </Container>

      {/* ── Signing secret reveal panel ─────────────────────── */}
      {revealedWebhook && (
        <Container className="bg-surface border-2 border-brand-tertiary-border rounded-2xl overflow-hidden">
          <Container className="bg-brand-tertiary-bg-light px-6 py-4 flex items-start gap-3 border-b border-brand-tertiary-border">
            <Container className="w-8 h-8 rounded-full bg-brand-tertiary-bg-bold flex items-center justify-center shrink-0 mt-0.5">
              <EyeOnIcon size={16} className="text-[#080A58]" />
            </Container>
            <Container>
              <Text variant="bodySmall" className="text-primary font-semibold">
                Copy your signing secret now — it won&apos;t be shown again.
              </Text>
              <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                Use it to verify that webhook payloads genuinely originate from SubGrid.
              </Text>
            </Container>
          </Container>

          <Container className="px-6 py-5 flex flex-col gap-5">
            <Container className="grid grid-cols-2 gap-4">
              <Container>
                <Text variant="bodyXSmall" className="text-secondary mb-1">Endpoint name</Text>
                <Text variant="bodySmall" className="text-primary font-medium">{revealedWebhook.name}</Text>
              </Container>
              <Container>
                <Text variant="bodyXSmall" className="text-secondary mb-1">Status</Text>
                <Container className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-success-bg-light border border-success-border">
                  <Container className="w-1.5 h-1.5 rounded-full bg-success-bg-bold" />
                  <Text variant="bodyXSmall" className="text-success-text-icons font-medium text-[11px]">Active</Text>
                </Container>
              </Container>
              <Container className="col-span-2">
                <Text variant="bodyXSmall" className="text-secondary mb-1">URL</Text>
                <Text variant="bodyXSmall" className="text-primary font-mono break-all">{revealedWebhook.url}</Text>
              </Container>
            </Container>

            <Container>
              <Text variant="bodyXSmall" className="text-secondary mb-2">Signing secret</Text>
              <Container className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
                <Text variant="bodyXSmall" className="text-primary font-mono flex-1 break-all select-all">
                  {revealedWebhook.signingSecret}
                </Text>
                <Button
                  variant={hasCopied ? "secondary" : "primary"}
                  size="small"
                  leftIcon={hasCopied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
                  onClick={handleCopySecret}
                >
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
              </Container>
            </Container>

            <Container className="flex items-start gap-3 p-4 bg-warning-bg-light border border-warning-border rounded-xl">
              <WarningIcon size={16} className="text-warning-text-icons shrink-0 mt-0.5" />
              <Text variant="bodyXSmall" className="text-secondary">
                Store this as{" "}
                <span className="font-mono text-primary bg-muted px-1.5 py-0.5 rounded">SUBGRID_WEBHOOK_SECRET</span>{" "}
                in your server environment. Never expose it in client-side code.
              </Text>
            </Container>

            <Button
              variant="primary"
              className="w-full sm:w-auto sm:self-end"
              onClick={() => setRevealedWebhook(null)}
            >
              Done — close this panel
            </Button>
          </Container>
        </Container>
      )}

      {/* ── Endpoints list ──────────────────────────────────── */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">Endpoints</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            {webhooks.length === 0
              ? "No endpoints registered"
              : `${activeCount} active · ${webhooks.length - activeCount} disabled`}
          </Text>
        </Container>

        {isLoading ? (
          <Container className="flex flex-col">
            {[1, 2, 3].map((i) => <SkeletonRow key={i} />)}
          </Container>
        ) : webhooks.length === 0 ? (
          <EmptyState
            icon={<DrawerOutIcon size={22} className="text-secondary" />}
            title="No endpoints yet"
            description="Add your first endpoint to start receiving real-time event notifications from SubGrid."
            action={{ label: "Add endpoint", onClick: () => setShowAdd(true) }}
          />
        ) : (
          webhooks.map((webhook) => (
            <WebhookRow
              key={webhook.id}
              webhook={webhook}
              onEdit={(w) => setEditTarget(w)}
              onDisable={(w) => setDisableTarget(w)}
            />
          ))
        )}
      </Container>

      {/* ── Modals ──────────────────────────────────────────── */}
      {showAdd && (
        <AddEndpointModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
      {editTarget && (
        <EditEndpointModal
          webhook={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}
      {disableTarget && (
        <DisableModal
          webhook={disableTarget}
          onClose={() => setDisableTarget(null)}
        />
      )}
    </Container>
  );
};
