"use client";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Button,
  Checkbox,
  Container,
  Input,
  Text,
} from "@subgrid/ui";
import {
  AddIcon,
  CopyIcon,
  DangerIcon,
  WarningIcon,
  LegalIcon,
  EyeOnIcon,
  CloseIcon,
  CheckIcon,
} from "@subgrid/ui/icons";
import { useApiKeysScreen } from "../hooks/useApiKeys";
import { ApiKey, ApiKeyMode } from "../types/api-key.type";
import { EmptyState } from "@/shared/ui/empty-state";

const MODE_BADGE: Record<ApiKeyMode, { label: string; className: string }> = {
  LIVE: { label: "Live", className: "bg-success-bg-light text-success-text-icons border-success-border" },
  TEST: { label: "Test", className: "bg-warning-bg-light text-warning-text-icons border-warning-border" },
};

// ── Modal shell ──────────────────────────────────────────────────────────────
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
      <Container
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <Container className="relative w-full max-w-lg bg-surface border border-border rounded-2xl shadow-xl overflow-hidden">
        {children}
      </Container>
    </Container>,
    document.body,
  );
};

// ── Mode option card ──────────────────────────────────────────────────────────
const ModeCard = ({
  value,
  selected,
  onSelect,
}: {
  value: ApiKeyMode;
  selected: boolean;
  onSelect: () => void;
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
      selected
        ? "border-[var(--brand-border)] bg-[var(--brand-bg-light)]"
        : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--muted)]"
    }`}
  >
    <Container
      className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
        selected
          ? "border-[var(--brand-text-icons)] bg-[var(--brand-text-icons)]"
          : "border-[var(--tertiary)]"
      }`}
    >
      {selected && <Container className="w-1.5 h-1.5 rounded-full bg-white" />}
    </Container>
    <Container>
      <Text variant="bodySmall" className={`font-medium ${selected ? "text-brand-text-icons" : "text-primary"}`}>
        {value === "LIVE" ? "Live" : "Test"}
      </Text>
      <Text variant="bodyXSmall" className="text-secondary mt-0.5">
        {value === "LIVE"
          ? "Real transactions. Charges actual payment methods."
          : "Sandbox mode. No real charges are made."}
      </Text>
    </Container>
  </button>
);

// ── Key row ───────────────────────────────────────────────────────────────────
const KeyRow = ({ apiKey, onRevoke }: { apiKey: ApiKey; onRevoke: (id: string) => void }) => {
  const badge = MODE_BADGE[apiKey.mode];
  const isActive = apiKey.status === "ACTIVE";

  return (
    <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
      <Container className="flex items-start sm:items-center gap-4">
        <Container className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isActive ? "bg-brand-bg-light" : "bg-muted"}`}>
          <LegalIcon size={16} className={isActive ? "text-brand-text-icons" : "text-secondary"} />
        </Container>
        <Container>
          <Container className="flex items-center gap-2 flex-wrap">
            <Text variant="bodySmall" className="text-primary font-medium">{apiKey.name}</Text>
            <Container className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${badge.className}`}>
              {badge.label}
            </Container>
            {!isActive && (
              <Container className="inline-flex items-center px-2 py-0.5 rounded-full border border-danger-border bg-danger-bg-light text-[11px] text-danger-text-icons">
                Revoked
              </Container>
            )}
          </Container>
          <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">
            {apiKey.secretPreview}
          </Text>
          <Container className="flex items-center gap-2 mt-1">
            <Text variant="bodyXSmall" className="text-secondary">
              Client ID:
            </Text>
            <Text variant="bodyXSmall" className="text-primary font-mono">
              {apiKey.clientId}
            </Text>
          </Container>
          <Container className="flex items-center gap-2 mt-1">
            <Text variant="bodyXSmall" className="text-secondary">
              Created {new Date(apiKey.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </Text>
            <span className="text-secondary text-xs">·</span>
            <Text variant="bodyXSmall" className="text-secondary">
              {apiKey.lastUsedAt
                ? `Last used ${new Date(apiKey.lastUsedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                : "Never used"}
            </Text>
          </Container>
        </Container>
      </Container>
      {isActive && (
        <Button variant="danger" size="small" onClick={() => onRevoke(apiKey.id)}>
          Revoke
        </Button>
      )}
    </Container>
  );
};

// ── Main screen ───────────────────────────────────────────────────────────────
export const ApiKeysScreen = () => {
  const {
    flowState,
    apiKeys,
    isLoading,
    name,
    mode,
    setMode,
    errors,
    isCreating,
    revealedSecret,
    revealedKey,
    hasCopied,
    setHasCopied,
    revokeTargetId,
    setRevokeTargetId,
    isRevoking,
    handleNameChange,
    handleStartCreate,
    handleCancelCreate,
    handleSubmitCreate,
    handleCopySecret,
    handleDismissRevealed,
    handleRevokeConfirm,
  } = useApiKeysScreen();

  const revokeTarget = apiKeys.find((k) => k.id === revokeTargetId);

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">

      {/* ── Header ────────────────────────────────────────── */}
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">API Keys</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5 max-w-lg">
            Authenticate your server-side requests to the SubGrid API. Keep your
            secret keys private — never expose them in client-side code.
          </Text>
        </Container>
        <Button variant="primary" leftIcon={<AddIcon size={16} />} onClick={handleStartCreate}>
          Create new key
        </Button>
      </Container>

      {/* ── Revealed secret panel ─────────────────────────── */}
      {flowState === "revealed" && revealedKey && (
        <Container className="bg-surface border-2 border-brand-tertiary-border rounded-2xl overflow-hidden">
          <Container className="bg-brand-tertiary-bg-light px-6 py-4 flex items-start gap-3 border-b border-brand-tertiary-border">
            <Container className="w-8 h-8 rounded-full bg-brand-tertiary-bg-bold flex items-center justify-center shrink-0 mt-0.5">
              <EyeOnIcon size={16} className="text-[#080A58]" />
            </Container>
            <Container>
              <Text variant="bodySmall" className="text-primary font-semibold">
                Copy your secret key now — it won&apos;t be shown again.
              </Text>
              <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                Store it somewhere safe like a password manager or environment variable.
              </Text>
            </Container>
          </Container>

          <Container className="px-6 py-5 flex flex-col gap-5">
            <Container className="grid grid-cols-2 gap-4">
              <Container>
                <Text variant="bodyXSmall" className="text-secondary mb-1">Key name</Text>
                <Text variant="bodySmall" className="text-primary font-medium">{revealedKey.name}</Text>
              </Container>
              <Container>
                <Text variant="bodyXSmall" className="text-secondary mb-1">Mode</Text>
                <Container className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${MODE_BADGE[revealedKey.mode].className}`}>
                  {MODE_BADGE[revealedKey.mode].label}
                </Container>
              </Container>
              <Container className="col-span-2">
                <Text variant="bodyXSmall" className="text-secondary mb-1">Client ID</Text>
                <Text variant="bodyXSmall" className="text-primary font-mono">{revealedKey.clientId}</Text>
              </Container>
            </Container>

            <Container>
              <Text variant="bodyXSmall" className="text-secondary mb-2">Secret key</Text>
              <Container className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
                <Text variant="bodyXSmall" className="text-primary font-mono flex-1 break-all select-all">
                  {revealedSecret}
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
                Add this to your server as{" "}
                <span className="font-mono text-primary bg-muted px-1.5 py-0.5 rounded">SUBGRID_SECRET_KEY</span>.
                Never commit it to version control.
              </Text>
            </Container>

            <Container className="flex items-center gap-3 pt-1 border-t border-border">
              <Checkbox checked={hasCopied} onChange={(val) => setHasCopied(val)} />
              <Text variant="bodyXSmall" className="text-secondary">
                I have copied and stored this key securely.
              </Text>
            </Container>

            <Button
              variant="primary"
              className="w-full sm:w-auto sm:self-end"
              disabled={!hasCopied}
              onClick={handleDismissRevealed}
            >
              Done — close this panel
            </Button>
          </Container>
        </Container>
      )}

      {/* ── Keys list ─────────────────────────────────────── */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">Your API keys</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            {apiKeys.filter((k) => k.status === "ACTIVE").length} active ·{" "}
            {apiKeys.filter((k) => k.status === "REVOKED").length} revoked
          </Text>
        </Container>

        {isLoading ? (
          <Container className="flex flex-col">
            {[1, 2, 3].map((i) => (
              <Container key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 animate-pulse">
                <Container className="w-9 h-9 rounded-xl bg-muted shrink-0" />
                <Container className="flex flex-col gap-2 flex-1">
                  <Container className="h-3 w-40 bg-muted rounded-full" />
                  <Container className="h-2.5 w-56 bg-muted rounded-full" />
                </Container>
              </Container>
            ))}
          </Container>
        ) : apiKeys.length === 0 ? (
          <EmptyState
            icon={<LegalIcon size={22} className="text-secondary" />}
            title="No API keys yet"
            description="Create your first API key to start authenticating requests to the SubGrid API from your server."
            action={{ label: "Create new key", onClick: handleStartCreate }}
          />
        ) : (
          apiKeys.map((key) => (
            <KeyRow key={key.id} apiKey={key} onRevoke={(id) => setRevokeTargetId(id)} />
          ))
        )}
      </Container>

      {/* ── Create modal ──────────────────────────────────── */}
      {flowState === "create" && (
        <Modal onClose={handleCancelCreate}>
          <Container className="px-6 pt-6 pb-2 flex items-start justify-between gap-4 border-b border-border">
            <Container>
              <Text variant="h5" className="text-primary font-semibold">Create a new API key</Text>
              <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                Choose a mode and give your key a name.
              </Text>
            </Container>
            <button
              type="button"
              onClick={handleCancelCreate}
              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0 mt-0.5"
            >
              <CloseIcon size={14} className="text-secondary" />
            </button>
          </Container>

          <Container className="px-6 py-5 flex flex-col gap-5">
            <Input
              label="Key name"
              required
              placeholder="e.g. Production server, Mobile app"
              value={name}
              onChange={handleNameChange}
              error={errors.name}
              hint="A label to help you identify this key later."
            />

            <Container>
              <Text variant="bodyXSmall" className="text-primary font-medium mb-2">Mode</Text>
              <Container className="flex flex-col gap-2">
                {(["LIVE", "TEST"] as ApiKeyMode[]).map((m) => (
                  <ModeCard key={m} value={m} selected={mode === m} onSelect={() => setMode(m)} />
                ))}
              </Container>
            </Container>

            <Container className="flex items-start gap-2.5 p-3 bg-brand-bg-light border border-brand-border rounded-xl">
              <LegalIcon size={14} className="text-brand-text-icons shrink-0 mt-0.5" />
              <Text variant="bodyXSmall" className="text-secondary">
                Your key will be prefixed with{" "}
                <span className="font-mono text-primary font-medium">
                  {mode === "LIVE" ? "sk_live_" : "sk_test_"}
                </span>{" "}
                and shown <span className="text-primary font-medium">only once</span> after creation.
              </Text>
            </Container>
          </Container>

          <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="neutral" onClick={handleCancelCreate} disabled={isCreating}>
              Cancel
            </Button>
            <Button
              variant="primary"
              leftIcon={<AddIcon size={16} />}
              onClick={handleSubmitCreate}
              loading={isCreating}
              disabled={isCreating}
            >
              Generate key
            </Button>
          </Container>
        </Modal>
      )}

      {/* ── Revoke confirmation modal ─────────────────────── */}
      {revokeTargetId && (
        <Modal onClose={() => setRevokeTargetId(null)}>
          <Container className="px-6 pt-6 pb-2 flex items-start justify-between gap-4 border-b border-border">
            <Container className="flex items-start gap-3">
              <Container className="w-9 h-9 rounded-xl bg-danger-bg-light flex items-center justify-center shrink-0">
                <DangerIcon size={18} className="text-danger-text-icons" />
              </Container>
              <Container>
                <Text variant="h5" className="text-primary font-semibold">Revoke this key?</Text>
                <Text variant="bodyXSmall" className="text-secondary mt-1">
                  This is permanent. Any app using this key will immediately lose API access.
                </Text>
              </Container>
            </Container>
            <button
              type="button"
              onClick={() => setRevokeTargetId(null)}
              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors shrink-0 mt-0.5"
            >
              <CloseIcon size={14} className="text-secondary" />
            </button>
          </Container>

          {revokeTarget && (
            <Container className="px-6 py-5">
              <Container className="p-4 bg-muted rounded-xl border border-border">
                <Text variant="bodyXSmall" className="text-primary font-medium">{revokeTarget.name}</Text>
                <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">{revokeTarget.secretPreview}</Text>
              </Container>
            </Container>
          )}

          <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
            <Button variant="neutral" onClick={() => setRevokeTargetId(null)} disabled={isRevoking}>
              Keep key
            </Button>
            <Button
              variant="danger"
              onClick={handleRevokeConfirm}
              loading={isRevoking}
              disabled={isRevoking}
            >
              Yes, revoke key
            </Button>
          </Container>
        </Modal>
      )}
    </Container>
  );
};
