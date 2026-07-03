"use client";
import {
  Button,
  Checkbox,
  Container,
  Input,
  Radio,
  Select,
  Text,
} from "@subgrid/ui";
import {
  AddIcon,
  CopyIcon,
  DangerIcon,
  SuccessIcon,
  WarningIcon,
  LegalIcon,
  EyeOnIcon,
  CloseIcon,
  CheckIcon,
  BackIcon,
} from "@subgrid/ui/icons";
import { useApiKeysScreen } from "../hooks/useApiKeys";
import { ApiKey } from "../types/api-key.type";

const ENV_BADGE: Record<"live" | "test", { label: string; className: string }> = {
  live: { label: "Live", className: "bg-success-bg-light text-success-text-icons border-success-border" },
  test: { label: "Test", className: "bg-warning-bg-light text-warning-text-icons border-warning-border" },
};

const SCOPE_LABELS: Record<string, string> = {
  full_access: "Full access",
  read_only: "Read only",
  webhooks_only: "Webhooks only",
};

const MOCK_KEYS: ApiKey[] = [
  {
    id: "key_01",
    name: "Production server",
    prefix: "sf_live_sk_xk9m3...nQP2",
    environment: "live",
    scope: "full_access",
    created_at: "Jun 10, 2026",
    last_used_at: "Jun 27, 2026",
    is_active: true,
  },
  {
    id: "key_02",
    name: "Mobile app",
    prefix: "sf_live_sk_pR7z1...mW8X",
    environment: "live",
    scope: "read_only",
    created_at: "May 22, 2026",
    last_used_at: "Jun 25, 2026",
    is_active: true,
  },
  {
    id: "key_03",
    name: "Staging environment",
    prefix: "sf_test_sk_aB4d2...kL5N",
    environment: "test",
    scope: "full_access",
    created_at: "May 5, 2026",
    last_used_at: null,
    is_active: true,
  },
  {
    id: "key_04",
    name: "Old webhook handler",
    prefix: "sf_live_sk_qT9w6...rJ3H",
    environment: "live",
    scope: "webhooks_only",
    created_at: "Mar 1, 2026",
    last_used_at: "Mar 28, 2026",
    is_active: false,
  },
];

const KeyRow = ({
  apiKey,
  onRevoke,
}: {
  apiKey: ApiKey;
  onRevoke: (id: string) => void;
}) => {
  const env = ENV_BADGE[apiKey.environment];
  return (
    <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border last:border-0">
      <Container className="flex items-start sm:items-center gap-4">
        <Container
          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
            apiKey.is_active ? "bg-brand-bg-light" : "bg-muted"
          }`}
        >
          <LegalIcon
            size={16}
            className={apiKey.is_active ? "text-brand-text-icons" : "text-secondary"}
          />
        </Container>
        <Container>
          <Container className="flex items-center gap-2 flex-wrap">
            <Text variant="bodySmall" className="text-primary font-medium">
              {apiKey.name}
            </Text>
            <Container
              className={`inline-flex items-center px-2 py-0.5 rounded-full border text-[11px] font-medium ${env.className}`}
            >
              {env.label}
            </Container>
            <Container className="inline-flex items-center px-2 py-0.5 rounded-full border border-border bg-muted text-[11px] text-secondary">
              {SCOPE_LABELS[apiKey.scope]}
            </Container>
            {!apiKey.is_active && (
              <Container className="inline-flex items-center px-2 py-0.5 rounded-full border border-danger-border bg-danger-bg-light text-[11px] text-danger-text-icons">
                Revoked
              </Container>
            )}
          </Container>
          <Container className="flex items-center gap-1 mt-1">
            <Text variant="bodyXSmall" className="text-secondary font-mono">
              {apiKey.prefix}
            </Text>
          </Container>
          <Container className="flex items-center gap-3 mt-1">
            <Text variant="bodyXSmall" className="text-secondary">
              Created {apiKey.created_at}
            </Text>
            <Text variant="bodyXSmall" className="text-secondary">·</Text>
            <Text variant="bodyXSmall" className="text-secondary">
              {apiKey.last_used_at ? `Last used ${apiKey.last_used_at}` : "Never used"}
            </Text>
          </Container>
        </Container>
      </Container>

      {apiKey.is_active && (
        <Button
          variant="danger"
          size="small"
          onClick={() => onRevoke(apiKey.id)}
        >
          Revoke
        </Button>
      )}
    </Container>
  );
};

export const ApiKeysScreen = () => {
  const {
    flowState,
    name,
    environment,
    setEnvironment,
    scope,
    setScope,
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

  return (
    <Container className="max-w-[1400px] mx-auto px-6 py-8 flex flex-col gap-8">
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">
            API Keys
          </Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5 max-w-lg">
            Authenticate your server-side requests to the SubGrid API. Keep
            your secret keys private — never expose them in client-side code.
          </Text>
        </Container>
        {flowState === "list" && (
          <Button
            variant="primary"
            leftIcon={<AddIcon size={16} />}
            onClick={handleStartCreate}
          >
            Create new key
          </Button>
        )}
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
                Store it somewhere safe like a password manager or environment
                variable. You cannot retrieve it after closing this panel.
              </Text>
            </Container>
          </Container>

          <Container className="px-6 py-5 flex flex-col gap-5">
            <Container>
              <Text variant="bodyXSmall" className="text-secondary mb-2">
                Key name
              </Text>
              <Text variant="bodySmall" className="text-primary font-medium">
                {revealedKey.name}
              </Text>
            </Container>

            <Container>
              <Text variant="bodyXSmall" className="text-secondary mb-2">
                Your secret key
              </Text>
              <Container className="flex items-center gap-3 bg-muted border border-border rounded-xl px-4 py-3">
                <Text
                  variant="bodyXSmall"
                  className="text-primary font-mono flex-1 break-all select-all"
                >
                  {revealedSecret}
                </Text>
                <Button
                  variant={hasCopied ? "secondary" : "primary"}
                  size="small"
                  leftIcon={
                    hasCopied ? (
                      <CheckIcon size={14} />
                    ) : (
                      <CopyIcon size={14} />
                    )
                  }
                  onClick={handleCopySecret}
                >
                  {hasCopied ? "Copied!" : "Copy"}
                </Button>
              </Container>
            </Container>

            <Container className="flex items-start gap-3 p-4 bg-warning-bg-light border border-warning-border rounded-xl">
              <WarningIcon size={16} className="text-warning-text-icons shrink-0 mt-0.5" />
              <Text variant="bodyXSmall" className="text-secondary">
                Add this key to your server environment as{" "}
                <span className="font-mono text-primary bg-muted px-1.5 py-0.5 rounded">
                  SUBFLOW_SECRET_KEY
                </span>
                . Never commit it to version control.
              </Text>
            </Container>

            <Container className="flex items-center gap-3 pt-1 border-t border-border">
              <Checkbox
                checked={hasCopied}
                onChange={(val) => setHasCopied(val)}
              />
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

      {/* ── Create form ───────────────────────────────────── */}
      {flowState === "create" && (
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Container className="px-6 py-4 border-b border-border flex items-center gap-3">
            <Container
              as="button"
              onClick={handleCancelCreate}
              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-border transition-colors"
            >
              <BackIcon size={14} className="text-secondary" />
            </Container>
            <Text variant="h5" className="text-primary font-semibold">
              Create a new API key
            </Text>
          </Container>

          <Container className="px-6 py-6 flex flex-col gap-6 max-w-lg">
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
              <Text variant="bodyXSmall" className="text-primary font-medium mb-3">
                Environment
              </Text>
              <Container className="flex flex-col gap-3">
                <Container
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    environment === "live"
                      ? "border-brand-border bg-brand-bg-light"
                      : "border-border bg-surface hover:bg-muted"
                  }`}
                  as="button"
                  onClick={() => setEnvironment("live")}
                >
                  <Radio
                    label=""
                    value="live"
                    checked={environment === "live"}
                    onChange={() => setEnvironment("live")}
                  />
                  <Container className="text-left">
                    <Text variant="bodySmall" className="text-primary font-medium">
                      Live
                    </Text>
                    <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                      Real transactions. Charges actual payment methods.
                    </Text>
                  </Container>
                </Container>

                <Container
                  className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                    environment === "test"
                      ? "border-brand-border bg-brand-bg-light"
                      : "border-border bg-surface hover:bg-muted"
                  }`}
                  as="button"
                  onClick={() => setEnvironment("test")}
                >
                  <Radio
                    label=""
                    value="test"
                    checked={environment === "test"}
                    onChange={() => setEnvironment("test")}
                  />
                  <Container className="text-left">
                    <Text variant="bodySmall" className="text-primary font-medium">
                      Test
                    </Text>
                    <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                      Sandbox mode. No real charges are made.
                    </Text>
                  </Container>
                </Container>
              </Container>
            </Container>

            <Select
              label="Permissions"
              value={scope}
              onChange={(val) => setScope(val as any)}
              options={[
                {
                  value: "full_access",
                  label: "Full access — read and write everything",
                },
                {
                  value: "read_only",
                  label: "Read only — view plans, customers, and transactions",
                },
                {
                  value: "webhooks_only",
                  label: "Webhooks only — receive event notifications",
                },
              ]}
            />

            <Container className="flex items-start gap-3 p-4 bg-brand-bg-light border border-brand-border rounded-xl">
              <LegalIcon size={16} className="text-brand-text-icons shrink-0 mt-0.5" />
              <Text variant="bodyXSmall" className="text-secondary">
                SubGrid generates a{" "}
                <span className="text-primary font-medium">
                  {environment === "live" ? "sf_live_sk_" : "sf_test_sk_"}
                </span>
                prefixed key. You will see the full secret{" "}
                <span className="text-primary font-medium">only once</span>{" "}
                after creation.
              </Text>
            </Container>

            <Container className="flex items-center gap-3 pt-2">
              <Button
                variant="neutral"
                onClick={handleCancelCreate}
                className="flex-1 sm:flex-none"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                leftIcon={<AddIcon size={16} />}
                onClick={handleSubmitCreate}
                loading={isCreating}
                disabled={isCreating}
                className="flex-1 sm:flex-none"
              >
                Generate key
              </Button>
            </Container>
          </Container>
        </Container>
      )}

      {/* ── Keys list ─────────────────────────────────────── */}
      {flowState !== "create" && (
        <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
          <Container className="px-6 py-4 border-b border-border flex items-center justify-between">
            <Container>
              <Text variant="h5" className="text-primary font-semibold">
                Your API keys
              </Text>
              <Text variant="bodyXSmall" className="text-secondary mt-0.5">
                {MOCK_KEYS.filter((k) => k.is_active).length} active ·{" "}
                {MOCK_KEYS.filter((k) => !k.is_active).length} revoked
              </Text>
            </Container>
          </Container>

          {MOCK_KEYS.length === 0 ? (
            <Container className="flex flex-col items-center gap-3 py-16 px-6">
              <Container className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                <LegalIcon size={22} className="text-secondary" />
              </Container>
              <Text variant="bodySmall" className="text-secondary text-center">
                No API keys yet. Create one to start integrating.
              </Text>
            </Container>
          ) : (
            MOCK_KEYS.map((key) => (
              <KeyRow
                key={key.id}
                apiKey={key}
                onRevoke={(id) => setRevokeTargetId(id)}
              />
            ))
          )}
        </Container>
      )}

      {/* ── Revoke confirmation overlay ───────────────────── */}
      {revokeTargetId && (
        <Container className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <Container className="bg-surface rounded-2xl border border-border w-full max-w-md p-6 flex flex-col gap-5">
            <Container className="flex items-start justify-between gap-4">
              <Container className="flex items-start gap-3">
                <Container className="w-9 h-9 rounded-xl bg-danger-bg-light flex items-center justify-center shrink-0">
                  <DangerIcon size={18} className="text-danger-text-icons" />
                </Container>
                <Container>
                  <Text variant="h5" className="text-primary font-semibold">
                    Revoke this key?
                  </Text>
                  <Text variant="bodyXSmall" className="text-secondary mt-1">
                    This action is permanent. Any application using this key
                    will immediately lose API access. You cannot undo this.
                  </Text>
                </Container>
              </Container>
              <Container
                as="button"
                onClick={() => setRevokeTargetId(null)}
                className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:bg-border transition-colors shrink-0"
              >
                <CloseIcon size={14} className="text-secondary" />
              </Container>
            </Container>

            <Container className="p-3 bg-muted rounded-xl border border-border">
              <Text variant="bodyXSmall" className="text-secondary font-mono">
                {MOCK_KEYS.find((k) => k.id === revokeTargetId)?.prefix}
              </Text>
              <Text variant="bodyXSmall" className="text-primary font-medium mt-0.5">
                {MOCK_KEYS.find((k) => k.id === revokeTargetId)?.name}
              </Text>
            </Container>

            <Container className="flex items-center gap-3">
              <Button
                variant="neutral"
                className="flex-1"
                onClick={() => setRevokeTargetId(null)}
                disabled={isRevoking}
              >
                Keep key
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={handleRevokeConfirm}
                loading={isRevoking}
                disabled={isRevoking}
              >
                Yes, revoke key
              </Button>
            </Container>
          </Container>
        </Container>
      )}
    </Container>
  );
};
