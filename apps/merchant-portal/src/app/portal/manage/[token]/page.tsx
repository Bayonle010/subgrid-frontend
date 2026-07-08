"use client";
import { use, useEffect, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
type SubscriptionStatus = "INCOMPLETE" | "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED" | "EXPIRED";
type AvailableAction = "CANCEL_AT_PERIOD_END" | "CANCEL_NOW" | "RESUME" | "REQUEST_PAYMENT_METHOD_UPDATE";

interface PaymentMethod {
  paymentMethodId: string;
  type: string;
  status: string;
  provider: string;
  cardBrand: string;
  cardLast4: string;
  expiryMonth: string;
  expiryYear: string;
  reusable: boolean;
}

interface PortalSubscription {
  portalSessionId: string;
  portalSessionExpiresAt: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  subscriptionId: string;
  planId: string;
  planName: string;
  status: SubscriptionStatus;
  amount: number;
  currency: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelledAt: string | null;
  paymentMethod: PaymentMethod | null;
  availableActions: AvailableAction[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const fmt = (amount: number, currency = "NGN") => {
  const symbols: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };
  return `${symbols[currency] ?? currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

const STATUS_LABEL: Record<SubscriptionStatus, { label: string; cls: string }> = {
  ACTIVE: { label: "Active", cls: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  TRIALING: { label: "Trialing", cls: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400" },
  PAST_DUE: { label: "Past due", cls: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  EXPIRED: { label: "Expired", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
  INCOMPLETE: { label: "Incomplete", cls: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400" },
};

// ── Inline SVG icons ──────────────────────────────────────────────────────────
const WalletIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

const CheckIcon = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#dcfce7" />
    <path d="M14 24l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

// ── Action button configs ──────────────────────────────────────────────────────
const ACTION_CONFIG = {
  RESUME: {
    label: "Resume subscription",
    description: "Your subscription will continue and you won't be cancelled.",
    buttonLabel: "Resume",
    buttonCls: "bg-indigo-600 hover:bg-indigo-700 text-white",
    confirmCls: "bg-indigo-50 dark:bg-indigo-950/30 border-indigo-100 dark:border-indigo-900/50",
    confirmText: "text-indigo-800 dark:text-indigo-300",
    confirmSub: "text-indigo-600 dark:text-indigo-400",
  },
  CANCEL_AT_PERIOD_END: {
    label: "Cancel at period end",
    description: "You'll keep access until the end of the current billing period.",
    buttonLabel: "Cancel at period end",
    buttonCls: "border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-white/5",
    confirmCls: "bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/50",
    confirmText: "text-orange-800 dark:text-orange-300",
    confirmSub: "text-orange-600 dark:text-orange-400",
  },
  CANCEL_NOW: {
    label: "Cancel immediately",
    description: "Your subscription ends right now. This cannot be undone.",
    buttonLabel: "Cancel now",
    buttonCls: "border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20",
    confirmCls: "bg-red-50 dark:bg-red-950/30 border-red-100 dark:border-red-900/50",
    confirmText: "text-red-800 dark:text-red-300",
    confirmSub: "text-red-600 dark:text-red-400",
  },
} as const;

type ActionKey = keyof typeof ACTION_CONFIG;
const RENDERED_ACTIONS: ActionKey[] = ["RESUME", "CANCEL_AT_PERIOD_END", "CANCEL_NOW"];

const ACTION_ENDPOINT: Record<ActionKey, string> = {
  RESUME: "resume",
  CANCEL_AT_PERIOD_END: "cancel-at-period-end",
  CANCEL_NOW: "cancel-now",
};

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ManagePortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [sub, setSub] = useState<PortalSubscription | null>(null);
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);

  const [pendingAction, setPendingAction] = useState<ActionKey | null>(null);
  const [confirmAction, setConfirmAction] = useState<ActionKey | null>(null);
  const [actionError, setActionError] = useState("");
  const [successAction, setSuccessAction] = useState<ActionKey | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/v1/customer-portal/sessions/${token}/subscription`,
          { cache: "no-store" },
        );
        const json = await res.json();
        if (!json.status) throw new Error(json.message);
        setSub(json.data);
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Failed to load subscription details.");
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  const handleAction = async (action: ActionKey) => {
    setPendingAction(action);
    setActionError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/customer-portal/sessions/${token}/${ACTION_ENDPOINT[action]}`,
        { method: "POST" },
      );
      const json = await res.json();
      if (!json.status) throw new Error(json.message);
      setSuccessAction(action);
      setConfirmAction(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPendingAction(null);
    }
  };

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <Page>
        <Logo />
        <Card>
          <div className="flex flex-col gap-3 py-4 animate-pulse">
            {[160, 120, 200, 140].map((w, i) => (
              <div key={i} className="h-3 rounded-full bg-gray-100 dark:bg-gray-800" style={{ width: w }} />
            ))}
          </div>
        </Card>
        <Footer />
      </Page>
    );
  }

  // ── Load error ──────────────────────────────────────────────────────────────
  if (loadError || !sub) {
    return (
      <Page>
        <Logo />
        <Card>
          <p className="text-sm text-red-600 dark:text-red-400 text-center py-4">
            {loadError || "This link is invalid or has expired."}
          </p>
        </Card>
        <Footer />
      </Page>
    );
  }

  const statusCfg = STATUS_LABEL[sub.status] ?? STATUS_LABEL.INCOMPLETE;
  const availableActionSet = new Set(sub.availableActions);
  const actionsToShow = RENDERED_ACTIONS.filter((a) => availableActionSet.has(a));

  // ── Success state ───────────────────────────────────────────────────────────
  if (successAction) {
    const cfg = ACTION_CONFIG[successAction];
    const messages: Record<ActionKey, { title: string; body: string }> = {
      RESUME: {
        title: "Subscription resumed",
        body: "Your subscription is active again. You'll continue to be billed normally.",
      },
      CANCEL_AT_PERIOD_END: {
        title: "Cancellation scheduled",
        body: `Your subscription will remain active until ${fmtDate(sub.currentPeriodEnd)}, then it will end.`,
      },
      CANCEL_NOW: {
        title: "Subscription cancelled",
        body: "Your subscription has been cancelled immediately. You won't be billed again.",
      },
    };
    const msg = messages[successAction];
    return (
      <Page>
        <Logo />
        <Card>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <CheckIcon />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{msg.title}</h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{msg.body}</p>
            </div>
          </div>
        </Card>
        <Footer />
      </Page>
    );
  }

  // ── Main view ───────────────────────────────────────────────────────────────
  return (
    <Page>
      <Logo />

      {/* Customer greeting */}
      <div className="w-full mb-4 px-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Hello, <span className="font-medium text-gray-900 dark:text-white">{sub.customerName}</span>
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500">{sub.customerEmail}</p>
      </div>

      {/* Subscription card */}
      <Card>
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <h2 className="text-base font-bold text-gray-900 dark:text-white">{sub.planName}</h2>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1 tabular-nums">
              {fmt(sub.amount, sub.currency)}
              <span className="text-sm font-normal text-gray-400 ml-1">/mo</span>
            </p>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 mt-0.5 ${statusCfg.cls}`}>
            {statusCfg.label}
          </span>
        </div>

        {sub.cancelAtPeriodEnd && (
          <div className="mb-4 px-3 py-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/30 border border-orange-100 dark:border-orange-900/50">
            <p className="text-xs font-medium text-orange-700 dark:text-orange-300">
              Cancels on {fmtDate(sub.currentPeriodEnd)}
            </p>
            <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
              You have access until then. Resume anytime to keep your subscription.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          <InfoRow icon={<CalendarIcon />} label="Current period">
            {fmtDate(sub.currentPeriodStart)} → {fmtDate(sub.currentPeriodEnd)}
          </InfoRow>

          {sub.paymentMethod && (
            <InfoRow icon={<CardIcon />} label="Payment method">
              {sub.paymentMethod.cardBrand} ···· {sub.paymentMethod.cardLast4}
              <span className="text-gray-400 ml-1 text-[11px]">
                {sub.paymentMethod.expiryMonth}/{sub.paymentMethod.expiryYear}
              </span>
            </InfoRow>
          )}
        </div>
      </Card>

      {/* Actions */}
      {actionsToShow.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">
            Manage subscription
          </h3>

          {actionError && (
            <div className="mb-3 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
              <p className="text-xs text-red-600 dark:text-red-400">{actionError}</p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {actionsToShow.map((action) => {
              const cfg = ACTION_CONFIG[action];
              const isConfirming = confirmAction === action;
              const isRunning = pendingAction === action;

              return (
                <div key={action}>
                  {!isConfirming ? (
                    <div className="flex items-center justify-between gap-3 py-2">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{cfg.label}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{cfg.description}</p>
                      </div>
                      <button
                        onClick={() => setConfirmAction(action)}
                        disabled={!!pendingAction}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 ${cfg.buttonCls}`}
                      >
                        {cfg.buttonLabel}
                      </button>
                    </div>
                  ) : (
                    <div className={`p-3.5 rounded-xl border ${cfg.confirmCls}`}>
                      <p className={`text-sm font-medium ${cfg.confirmText}`}>
                        Are you sure?
                      </p>
                      <p className={`text-xs mt-0.5 ${cfg.confirmSub}`}>
                        {cfg.description}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(action)}
                          disabled={isRunning}
                          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                        >
                          {isRunning ? <><SpinnerIcon />Processing…</> : "Confirm"}
                        </button>
                        <button
                          onClick={() => { setConfirmAction(null); setActionError(""); }}
                          disabled={isRunning}
                          className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-xs font-medium transition-colors hover:bg-gray-50 dark:hover:bg-white/5 disabled:opacity-60 cursor-pointer"
                        >
                          Go back
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Divider between actions */}
                  {actionsToShow.indexOf(action) < actionsToShow.length - 1 && (
                    <div className="h-px bg-gray-100 dark:bg-white/5 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <Footer />
    </Page>
  );
}

// ── Layout helpers ────────────────────────────────────────────────────────────
const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-start px-4 py-10">
    <div className="w-full max-w-sm flex flex-col items-center">
      {children}
    </div>
  </div>
);

const Logo = () => (
  <div className="flex items-center gap-2 mb-6 self-start">
    <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
      <WalletIcon />
    </div>
    <span className="text-sm font-semibold text-gray-900 dark:text-white tracking-tight">SubGrid</span>
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-5 mb-3">
    {children}
  </div>
);

const InfoRow = ({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex items-start gap-2.5">
    <span className="text-gray-400 mt-0.5 shrink-0">{icon}</span>
    <div className="min-w-0">
      <p className="text-[11px] text-gray-400 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm text-gray-700 dark:text-gray-200 mt-0.5">{children}</p>
    </div>
  </div>
);

const Footer = () => (
  <p className="text-xs text-gray-400 text-center mt-3">
    Powered by <span className="font-medium text-gray-500 dark:text-gray-400">SubGrid</span>
    {" · "}
    Secure subscription management
  </p>
);
