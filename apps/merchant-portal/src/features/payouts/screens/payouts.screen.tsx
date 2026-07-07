"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Container, Input, Select, Text } from "@subgrid/ui";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DangerIcon,
  PayIcon,
  PendingIcon,
  WarningIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import {
  Bank,
  PayoutAccount,
} from "../types/payout.type";
import { useListBanks, useCreatePayoutAccount, useListPayoutAccounts, useDisablePayoutAccount } from "../hooks/payout.hooks";
import { lookupBankAccount } from "../services/payout.service";

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

// ── Add payout account modal ──────────────────────────────────────────────────
type LookupState = "idle" | "loading" | "success" | "error";

const AddAccountModal = ({
  onClose,
  onCreated,
  isFirstAccount,
}: {
  onClose: () => void;
  onCreated: () => void;
  isFirstAccount: boolean;
}) => {
  const { data: banks = [], isLoading: banksLoading } = useListBanks();
  const { mutate: create, isPending: isCreating } = useCreatePayoutAccount(
    () => { onCreated(); onClose(); },
  );
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [resolvedName, setResolvedName] = useState("");
  const [lookupState, setLookupState] = useState<LookupState>("idle");
  const [lookupError, setLookupError] = useState("");

  const selectedBank = banks.find((b: Bank) => b.code === bankCode);

  // Reset lookup whenever bank or account number changes
  const resetLookup = () => {
    setResolvedName("");
    setLookupState("idle");
    setLookupError("");
  };

  const handleBankChange = (code: string) => {
    setBankCode(code);
    resetLookup();
  };

  const handleAccountNumberChange = (val: string) => {
    if (!/^\d*$/.test(val) || val.length > 10) return;
    setAccountNumber(val);
    resetLookup();
  };

  // Auto-trigger lookup when both fields are complete
  useEffect(() => {
    if (!bankCode || accountNumber.length !== 10) return;

    let cancelled = false;
    setLookupState("loading");
    setResolvedName("");
    setLookupError("");

    lookupBankAccount({ accountNumber, bankCode })
      .then((res) => {
        if (!cancelled) {
          setResolvedName(res.data.accountName);
          setLookupState("success");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setLookupState("error");
          setLookupError("Could not verify this account. Check the details and try again.");
        }
      });

    return () => { cancelled = true; };
  }, [bankCode, accountNumber]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank || lookupState !== "success") return;
    create({
      accountNumber,
      bankCode: selectedBank.code,
      accountName: resolvedName,
      defaultAccount: isFirstAccount,
    });
  };

  const isValid = bankCode && accountNumber.length === 10 && lookupState === "success" && !isCreating;

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border gap-4">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">Add payout account</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Enter your bank details to receive withdrawal payouts.
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
        <Container className="px-6 py-5 flex flex-col gap-4">
          <Select
            label="Bank"
            placeholder={banksLoading ? "Loading banks…" : "Select your bank"}
            value={bankCode}
            onChange={handleBankChange}
            options={banks.map((b: Bank) => ({ value: b.code, label: b.name.trim() }))}
          />

          <Input
            label="Account number"
            placeholder="0123456789"
            value={accountNumber}
            onChange={(e) => handleAccountNumberChange(e.target.value)}
            maxLength={10}
            hint="10-digit NUBAN account number"
          />

          {/* Account name — resolved automatically */}
          {(lookupState !== "idle" || accountNumber.length === 10) && bankCode && (
            <Container>
              <Text variant="bodyXSmall" className="text-primary font-medium mb-1.5">
                Account name
              </Text>

              {lookupState === "loading" && (
                <Container className="flex items-center gap-2.5 px-4 py-3 bg-muted border border-border rounded-xl">
                  <PendingIcon size={15} className="text-secondary animate-spin shrink-0" />
                  <Text variant="bodyXSmall" className="text-secondary">Verifying account details…</Text>
                </Container>
              )}

              {lookupState === "success" && (
                <Container className="flex items-center gap-2.5 px-4 py-3 bg-success-bg-light border border-success-border rounded-xl">
                  <CheckIcon size={15} className="text-success-text-icons shrink-0" />
                  <Text variant="bodySmall" className="text-success-text-icons font-semibold flex-1">
                    {resolvedName}
                  </Text>
                  <Text variant="bodyXSmall" className="text-success-text-icons opacity-70">Verified</Text>
                </Container>
              )}

              {lookupState === "error" && (
                <Container className="flex items-start gap-2.5 px-4 py-3 bg-danger-bg-light border border-danger-border rounded-xl">
                  <WarningIcon size={15} className="text-danger-text-icons shrink-0 mt-0.5" />
                  <Text variant="bodyXSmall" className="text-danger-text-icons">
                    {lookupError || "Could not verify this account. Check the details and try again."}
                  </Text>
                </Container>
              )}
            </Container>
          )}
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="neutral" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            leftIcon={isCreating ? <PendingIcon size={16} className="animate-spin" /> : <AddIcon size={16} />}
            disabled={!isValid}
          >
            {isCreating ? "Saving…" : "Save account"}
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Remove confirmation modal ─────────────────────────────────────────────────
const RemoveModal = ({
  account,
  onClose,
}: {
  account: PayoutAccount;
  onClose: () => void;
}) => {
  const { mutate: disable, isPending } = useDisablePayoutAccount(account.id, onClose);

  return (
    <Modal onClose={onClose}>
      <Container className="px-6 pt-6 pb-4 flex items-start gap-3 border-b border-border">
        <Container className="w-9 h-9 rounded-xl bg-danger-bg-light flex items-center justify-center shrink-0">
          <DangerIcon size={18} className="text-danger-text-icons" />
        </Container>
        <Container className="flex-1">
          <Text variant="h5" className="text-primary font-semibold">Remove this account?</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-1">
            This account will be disabled and no longer available for payouts.
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
          <Text variant="bodySmall" className="text-primary font-medium">{account.bankName}</Text>
          <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">
            {account.accountNumber} · {account.accountName}
          </Text>
        </Container>
      </Container>

      <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
        <Button variant="neutral" onClick={onClose} disabled={isPending}>
          Keep account
        </Button>
        <Button
          variant="danger"
          onClick={() => disable()}
          leftIcon={isPending ? <PendingIcon size={14} className="animate-spin" /> : undefined}
          disabled={isPending}
        >
          {isPending ? "Removing…" : "Yes, remove"}
        </Button>
      </Container>
    </Modal>
  );
};

// ── Account row ───────────────────────────────────────────────────────────────
const AccountRow = ({
  account,
  onSetDefault,
  onRemove,
}: {
  account: PayoutAccount;
  onSetDefault: (id: string) => void;
  onRemove: (account: PayoutAccount) => void;
}) => (
  <Container className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-border last:border-0 hover:bg-muted/40 transition-colors">
    <Container className="flex items-center gap-4 min-w-0">
      <Container className="w-10 h-10 rounded-xl bg-brand-bg-light flex items-center justify-center shrink-0">
        <PayIcon size={18} className="text-brand-text-icons" />
      </Container>
      <Container className="min-w-0">
        <Container className="flex items-center gap-2 flex-wrap">
          <Text variant="bodySmall" className="text-primary font-medium">{account.bankName}</Text>
          {account.defaultAccount && (
            <Container className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand-bg-light border border-brand-border">
              <CheckIcon size={10} className="text-brand-text-icons" />
              <Text variant="bodyXSmall" className="text-brand-text-icons font-medium text-[10px]">Default</Text>
            </Container>
          )}
        </Container>
        <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">
          {account.accountNumber}
        </Text>
        <Text variant="bodyXSmall" className="text-secondary mt-0.5">{account.accountName}</Text>
      </Container>
    </Container>

    <Container className="flex items-center gap-2 shrink-0">
      {!account.defaultAccount && (
        <Button variant="secondary" size="small" onClick={() => onSetDefault(account.id)}>
          Set as default
        </Button>
      )}
      <Button variant="danger" size="small" onClick={() => onRemove(account)}>
        Remove
      </Button>
    </Container>
  </Container>
);

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <Container className="flex items-center gap-4 px-6 py-4 border-b border-border last:border-0 animate-pulse">
    <Container className="w-10 h-10 rounded-xl bg-muted shrink-0" />
    <Container className="flex flex-col gap-2 flex-1">
      <Container className="h-3 w-36 bg-muted rounded-full" />
      <Container className="h-2.5 w-28 bg-muted rounded-full" />
      <Container className="h-2.5 w-44 bg-muted rounded-full" />
    </Container>
  </Container>
);

// ── Main screen ───────────────────────────────────────────────────────────────
export const PayoutsScreen = () => {
  const { data: accounts = [], isLoading } = useListPayoutAccounts();
  const [showAdd, setShowAdd] = useState(false);
  const [removeTarget, setRemoveTarget] = useState<PayoutAccount | null>(null);

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">

      {/* ── Header ──────────────────────────────────────────── */}
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Payouts</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5 max-w-lg">
            Manage your bank accounts and withdraw your available balance to your preferred account.
          </Text>
        </Container>
        <Button variant="primary" leftIcon={<AddIcon size={16} />} onClick={() => setShowAdd(true)}>
          Add account
        </Button>
      </Container>

      {/* ── Payout accounts ─────────────────────────────────── */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border">
          <Text variant="h5" className="text-primary font-semibold">Payout accounts</Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            {isLoading || accounts.length === 0
              ? "No bank accounts added yet"
              : `${accounts.length} account${accounts.length !== 1 ? "s" : ""} saved · withdrawals go to your default account`}
          </Text>
        </Container>

        {isLoading ? (
          <Container className="flex flex-col">
            {[1, 2].map((i) => <SkeletonRow key={i} />)}
          </Container>
        ) : accounts.length === 0 ? (
          <EmptyState
            icon={<PayIcon size={22} className="text-secondary" />}
            title="No payout accounts yet"
            description="Add a bank account to start withdrawing your available balance."
            action={{ label: "Add account", onClick: () => setShowAdd(true) }}
          />
        ) : (
          accounts.map((account) => (
            <AccountRow
              key={account.id}
              account={account}
              onSetDefault={() => {}}
              onRemove={(a) => setRemoveTarget(a)}
            />
          ))
        )}
      </Container>

      {/* ── Modals ──────────────────────────────────────────── */}
      {showAdd && (
        <AddAccountModal
          onClose={() => setShowAdd(false)}
          onCreated={() => setShowAdd(false)}
          isFirstAccount={accounts.length === 0}
        />
      )}
      {removeTarget && (
        <RemoveModal
          account={removeTarget}
          onClose={() => setRemoveTarget(null)}
        />
      )}
    </Container>
  );
};
