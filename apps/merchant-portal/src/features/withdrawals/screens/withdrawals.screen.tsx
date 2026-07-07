"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button, Container, Input, Select, Text } from "@subgrid/ui";
import {
  AddIcon,
  CheckIcon,
  CloseIcon,
  DangerIcon,
  PendingIcon,
  ScrollIcon,
  SuccessIcon,
  WalletIcon,
  WarningIcon,
} from "@subgrid/ui/icons";
import { EmptyState } from "@/shared/ui/empty-state";
import { useGetLedgerBalance } from "@/features/ledger/hooks/ledger.hooks";
import { useListPayoutAccounts } from "@/features/payouts/hooks/payout.hooks";
import { useCreateWithdrawal, useGetWithdrawal, useListWithdrawals, useRetryWithdrawal } from "../hooks/withdrawal.hooks";
import { Withdrawal, WithdrawalStatus } from "../types/withdrawal.type";

// ── Helpers ───────────────────────────────────────────────────────────────────
const CURRENCY_SYMBOL: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };

const formatAmount = (amount: number, currency = "NGN") =>
  `${CURRENCY_SYMBOL[currency] ?? currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const STATUS_CONFIG: Record<
  WithdrawalStatus,
  { label: string; icon: React.ReactNode; className: string }
> = {
  PENDING: {
    label: "Pending",
    icon: <PendingIcon size={11} className="text-warning-text-icons" />,
    className: "bg-warning-bg-light text-warning-text-icons border-warning-border",
  },
  PROCESSING: {
    label: "Processing",
    icon: <PendingIcon size={11} className="text-brand-text-icons" />,
    className: "bg-brand-bg-light text-brand-text-icons border-brand-border",
  },
  SUCCEEDED: {
    label: "Succeeded",
    icon: <SuccessIcon size={11} className="text-success-text-icons" />,
    className: "bg-success-bg-light text-success-text-icons border-success-border",
  },
  FAILED: {
    label: "Failed",
    icon: <DangerIcon size={11} className="text-danger-text-icons" />,
    className: "bg-danger-bg-light text-danger-text-icons border-danger-border",
  },
};

const StatusBadge = ({ status }: { status: WithdrawalStatus }) => {
  const cfg = STATUS_CONFIG[status];
  return (
    <Container
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium ${cfg.className}`}
    >
      {cfg.icon}
      {cfg.label}
    </Container>
  );
};

// ── Modal shell ───────────────────────────────────────────────────────────────
const Modal = ({
  onClose,
  children,
}: {
  onClose: () => void;
  children: React.ReactNode;
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
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

// ── Withdraw modal (exported for use on dashboard) ────────────────────────────
export const WithdrawModal = ({ onClose }: { onClose: () => void }) => {
  const { data: balance } = useGetLedgerBalance();
  const { data: payoutAccounts = [] } = useListPayoutAccounts();

  const [amount, setAmount] = useState("");
  const [payoutAccountId, setPayoutAccountId] = useState("");
  const [narration, setNarration] = useState("");
  const [succeeded, setSucceeded] = useState(false);

  const verifiedAccounts = payoutAccounts.filter((a) => a.status === "VERIFIED");

  const { mutate: withdraw, isPending } = useCreateWithdrawal(
    () => setSucceeded(true),
  );

  const availableBalance = balance?.availableBalance ?? 0;
  const currency = balance?.currency ?? "NGN";
  const numericAmount = parseFloat(amount.replace(/,/g, "")) || 0;

  const amountError =
    numericAmount > 0 && numericAmount > availableBalance
      ? `Exceeds available balance of ${formatAmount(availableBalance, currency)}`
      : "";

  const isValid =
    numericAmount > 0 &&
    !amountError &&
    payoutAccountId &&
    narration.trim().length > 0 &&
    !isPending;

  const handleAmountChange = (val: string) => {
    if (!/^\d*\.?\d{0,2}$/.test(val)) return;
    setAmount(val);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    withdraw({
      payoutAccountId,
      amount: numericAmount,
      currency,
      narration: narration.trim(),
    });
  };

  if (succeeded) {
    return (
      <Modal onClose={onClose}>
        <Container className="px-6 py-10 flex flex-col items-center gap-4 text-center">
          <Container className="w-14 h-14 rounded-2xl bg-success-bg-light flex items-center justify-center">
            <CheckIcon size={26} className="text-success-text-icons" />
          </Container>
          <Container>
            <Text variant="h5" className="text-primary font-semibold">
              Withdrawal initiated
            </Text>
            <Text variant="bodySmall" className="text-secondary mt-1.5 max-w-xs mx-auto">
              Your withdrawal of {formatAmount(numericAmount, currency)} is being processed and
              will arrive in your bank account shortly.
            </Text>
          </Container>
          <Button variant="primary" onClick={onClose} className="mt-2">
            Done
          </Button>
        </Container>
      </Modal>
    );
  }

  return (
    <Modal onClose={onClose}>
      {/* Header */}
      <Container className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border gap-4">
        <Container>
          <Text variant="h5" className="text-primary font-semibold">
            Withdraw funds
          </Text>
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            Transfer your available balance to a bank account.
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
          {/* Balance pill */}
          <Container className="flex items-center justify-between px-4 py-3 bg-brand-bg-light border border-brand-border rounded-xl">
            <Text variant="bodyXSmall" className="text-brand-text-icons">
              Available balance
            </Text>
            <Text variant="bodySmall" className="text-brand-text-icons font-semibold tabular-nums">
              {balance ? formatAmount(availableBalance, currency) : "—"}
            </Text>
          </Container>

          {/* Amount */}
          <Container>
            <Input
              label="Amount"
              placeholder="0.00"
              value={amount}
              onChange={(e) => handleAmountChange(e.target.value)}
              error={amountError}
              hint={`Enter the amount in ${currency}`}
            />
          </Container>

          {/* Payout account */}
          {verifiedAccounts.length === 0 ? (
            <Container className="flex items-start gap-2.5 px-3 py-3 bg-warning-bg-light border border-warning-border rounded-xl">
              <WarningIcon size={14} className="text-warning-text-icons shrink-0 mt-0.5" />
              <Text variant="bodyXSmall" className="text-warning-text-icons">
                You have no verified payout accounts. Go to Settings → Banking &amp; Payouts to add one.
              </Text>
            </Container>
          ) : (
            <Select
              label="Send to"
              placeholder="Select payout account"
              value={payoutAccountId}
              onChange={setPayoutAccountId}
              options={verifiedAccounts.map((a) => ({
                value: a.id,
                label: `${a.bankName} · ${a.accountNumber}`,
              }))}
            />
          )}

          {/* Narration */}
          <Input
            label="Narration"
            placeholder="e.g. Merchant revenue withdrawal"
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
            hint="A description that will appear on your bank statement"
          />
        </Container>

        <Container className="px-6 py-4 border-t border-border flex items-center justify-end gap-3">
          <Button variant="neutral" type="button" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            leftIcon={
              isPending ? (
                <PendingIcon size={16} className="animate-spin" />
              ) : (
                <WalletIcon size={16} />
              )
            }
            disabled={!isValid}
          >
            {isPending
              ? "Processing…"
              : isValid
              ? `Withdraw ${formatAmount(numericAmount, currency)}`
              : "Withdraw"}
          </Button>
        </Container>
      </form>
    </Modal>
  );
};

// ── Detail modal ─────────────────────────────────────────────────────────────
const DetailRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <Container className="flex items-start justify-between gap-4 py-3 border-b border-border last:border-0">
    <Text variant="bodyXSmall" className="text-secondary shrink-0 w-36">{label}</Text>
    <Container className="text-right">{value}</Container>
  </Container>
);

const WithdrawalDetailModal = ({ id, onClose }: { id: string; onClose: () => void }) => {
  const { data: w, isLoading } = useGetWithdrawal(id);
  const [retrySucceeded, setRetrySucceeded] = useState(false);
  const { mutate: retry, isPending: retrying } = useRetryWithdrawal(
    id,
    () => setRetrySucceeded(true),
  );

  return (
    <Modal onClose={onClose}>
      <Container className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-border">
        <Text variant="h5" className="text-primary font-semibold">Withdrawal details</Text>
        <button
          type="button"
          onClick={onClose}
          className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-border transition-colors"
        >
          <CloseIcon size={14} className="text-secondary" />
        </button>
      </Container>

      <Container className="px-6 py-2 max-h-[70vh] overflow-y-auto">
        {isLoading || !w ? (
          <Container className="py-8 flex flex-col gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Container key={i} className="flex justify-between animate-pulse">
                <Container className="h-3 w-28 rounded bg-muted" />
                <Container className="h-3 w-40 rounded bg-muted" />
              </Container>
            ))}
          </Container>
        ) : (
          <>
            <Container className="py-4 flex items-center justify-between">
              <StatusBadge status={w.status} />
              <Text variant="h4" className="text-primary font-semibold tabular-nums">
                {formatAmount(w.amount, w.currency)}
              </Text>
            </Container>

            <Container className="pb-2">
              <DetailRow
                label="Bank"
                value={<Text variant="bodySmall" className="text-primary font-medium">{w.bankName}</Text>}
              />
              <DetailRow
                label="Account"
                value={
                  <Container>
                    <Text variant="bodySmall" className="text-primary font-medium">{w.accountName.trim()}</Text>
                    <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">{w.accountNumber}</Text>
                  </Container>
                }
              />
              <DetailRow
                label="Reference"
                value={
                  <Text variant="bodyXSmall" className="text-secondary font-mono break-all">{w.merchantTxRef}</Text>
                }
              />
              {w.providerTransferId && (
                <DetailRow
                  label="Provider ID"
                  value={
                    <Text variant="bodyXSmall" className="text-secondary font-mono break-all">{w.providerTransferId}</Text>
                  }
                />
              )}
              {w.providerStatus && (
                <DetailRow
                  label="Provider status"
                  value={<Text variant="bodyXSmall" className="text-primary font-medium">{w.providerStatus}</Text>}
                />
              )}
              {w.failureReason && (
                <DetailRow
                  label="Failure reason"
                  value={<Text variant="bodyXSmall" className="text-danger-text-icons">{w.failureReason}</Text>}
                />
              )}
              <DetailRow
                label="Initiated"
                value={
                  <Text variant="bodyXSmall" className="text-secondary">
                    {new Date(w.createdAt).toLocaleString("en-GB", {
                      day: "numeric", month: "short", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </Text>
                }
              />
              {w.succeededAt && (
                <DetailRow
                  label="Settled"
                  value={
                    <Text variant="bodyXSmall" className="text-success-text-icons">
                      {new Date(w.succeededAt).toLocaleString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </Text>
                  }
                />
              )}
              {w.failedAt && (
                <DetailRow
                  label="Failed at"
                  value={
                    <Text variant="bodyXSmall" className="text-danger-text-icons">
                      {new Date(w.failedAt).toLocaleString("en-GB", {
                        day: "numeric", month: "short", year: "numeric",
                        hour: "2-digit", minute: "2-digit",
                      })}
                    </Text>
                  }
                />
              )}
            </Container>
          </>
        )}
      </Container>

      <Container className="px-6 py-4 border-t border-border flex items-center justify-between gap-3">
        {w?.status === "FAILED" && !retrySucceeded ? (
          <Button
            variant="primary"
            leftIcon={retrying ? <PendingIcon size={14} className="animate-spin" /> : <WarningIcon size={14} />}
            disabled={retrying}
            onClick={() => retry()}
          >
            {retrying ? "Retrying…" : "Retry withdrawal"}
          </Button>
        ) : retrySucceeded ? (
          <Container className="flex items-center gap-2 text-success-text-icons">
            <CheckIcon size={14} />
            <Text variant="bodyXSmall" className="!text-[inherit] font-medium">Retry submitted</Text>
          </Container>
        ) : (
          <Container />
        )}
        <Button variant="neutral" onClick={onClose}>Close</Button>
      </Container>
    </Modal>
  );
};

// ── Skeleton row ──────────────────────────────────────────────────────────────
const SkeletonRow = () => (
  <tr className="border-b border-border last:border-0 animate-pulse">
    {[120, 80, 160, 100, 80].map((w, i) => (
      <td key={i} className="px-5 py-4">
        <Container className={`h-3 rounded-full bg-muted`} style={{ width: w }} />
      </td>
    ))}
  </tr>
);

// ── Full withdrawals page ─────────────────────────────────────────────────────
export const WithdrawalsScreen = () => {
  const { data: withdrawals = [], isLoading } = useListWithdrawals();
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <Container className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-8">

      {/* Header */}
      <Container className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <Container>
          <Text variant="h4" className="text-primary">Withdrawals</Text>
          <Text variant="bodySmall" className="text-secondary mt-0.5">
            Transfer your available balance to your bank account.
          </Text>
        </Container>
        <Button
          variant="primary"
          leftIcon={<WalletIcon size={16} />}
          onClick={() => setShowWithdraw(true)}
        >
          Withdraw funds
        </Button>
      </Container>

      {/* History table */}
      <Container className="bg-surface border border-border rounded-2xl overflow-hidden">
        <Container className="px-6 py-4 border-b border-border flex items-center justify-between">
          <Container>
            <Text variant="h5" className="text-primary font-semibold">
              Withdrawal history
            </Text>
            <Text variant="bodyXSmall" className="text-secondary mt-0.5">
              {isLoading || withdrawals.length === 0
                ? "No withdrawals yet"
                : `${withdrawals.length} withdrawal${withdrawals.length !== 1 ? "s" : ""}`}
            </Text>
          </Container>
        </Container>

        <Container className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                {["Date", "Amount", "Account", "Reference", "Status"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left">
                    <Text
                      variant="bodyXSmall"
                      className="text-secondary uppercase tracking-wider font-medium"
                    >
                      {h}
                    </Text>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <SkeletonRow key={i} />)
              ) : withdrawals.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={<ScrollIcon size={22} className="text-secondary" />}
                      title="No withdrawals yet"
                      description="When you withdraw funds they'll appear here."
                      action={{
                        label: "Withdraw funds",
                        onClick: () => setShowWithdraw(true),
                      }}
                    />
                  </td>
                </tr>
              ) : (
                withdrawals.map((w) => (
                  <WithdrawalRow key={w.id} withdrawal={w} onClick={() => setSelectedId(w.id)} />
                ))
              )}
            </tbody>
          </table>
        </Container>
      </Container>

      {showWithdraw && <WithdrawModal onClose={() => setShowWithdraw(false)} />}
      {selectedId && <WithdrawalDetailModal id={selectedId} onClose={() => setSelectedId(null)} />}
    </Container>
  );
};

const WithdrawalRow = ({ withdrawal: w, onClick }: { withdrawal: Withdrawal; onClick: () => void }) => {
  const settledAt = w.succeededAt ?? w.failedAt;
  return (
    <tr
      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <td className="px-5 py-4">
        <Text variant="bodyXSmall" className="text-primary">
          {new Date(w.createdAt).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Text>
        <Text variant="bodyXSmall" className="text-secondary mt-0.5">
          {new Date(w.createdAt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </td>
      <td className="px-5 py-4">
        <Text variant="bodySmall" className="text-primary font-semibold tabular-nums">
          {formatAmount(w.amount, w.currency)}
        </Text>
      </td>
      <td className="px-5 py-4">
        <Text variant="bodySmall" className="text-primary font-medium">{w.bankName}</Text>
        <Text variant="bodyXSmall" className="text-secondary font-mono mt-0.5">
          {w.accountNumber} · {w.accountName.trim()}
        </Text>
      </td>
      <td className="px-5 py-4">
        <Text variant="bodyXSmall" className="text-secondary font-mono truncate max-w-[160px]" title={w.merchantTxRef}>
          {w.merchantTxRef}
        </Text>
      </td>
      <td className="px-5 py-4">
        <StatusBadge status={w.status} />
        {w.failureReason && (
          <Text variant="bodyXSmall" className="text-danger-text-icons mt-1">
            {w.failureReason}
          </Text>
        )}
        {settledAt && (
          <Text variant="bodyXSmall" className="text-secondary mt-0.5">
            {new Date(settledAt).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
            })}
          </Text>
        )}
      </td>
    </tr>
  );
};
