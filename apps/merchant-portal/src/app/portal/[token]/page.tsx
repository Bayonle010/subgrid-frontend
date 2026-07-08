"use client";
import { useState } from "react";
import { use } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────
interface PayResponse {
  status: boolean;
  data: {
    checkoutSessionId: string;
    invoiceId: string;
    subscriptionId: string;
    orderReference: string;
    checkoutUrl: string;
    amount: number;
    currency: string;
    status: string;
    expiresAt: string;
  };
  message: string;
}

interface CancelResponse {
  status: boolean;
  message: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const API_BASE = process.env.NEXT_PUBLIC_API_URL;

const fmt = (amount: number, currency = "NGN") => {
  const symbol: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };
  return `${symbol[currency] ?? currency}${amount.toLocaleString("en-NG", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

// ── Icons (inline SVG so no import dependency) ────────────────────────────────
const CheckCircle = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#dcfce7" />
    <path d="M14 24l7 7 13-13" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const XCircle = () => (
  <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
    <circle cx="24" cy="24" r="24" fill="#fee2e2" />
    <path d="M17 17l14 14M31 17L17 31" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

const WalletSVG = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
  </svg>
);

const BanSVG = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="m4.9 4.9 14.2 14.2" />
  </svg>
);

const SpinnerSVG = () => (
  <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
    <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CustomerPortalPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = use(params);

  const [payState, setPayState] = useState<"idle" | "loading" | "error">("idle");
  const [cancelState, setCancelState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [payError, setPayError] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const handlePay = async () => {
    setPayState("loading");
    setPayError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/customer-portal/sessions/${token}/pay`,
        { method: "POST" },
      );
      const json: PayResponse = await res.json();
      if (!json.status || !json.data?.checkoutUrl) throw new Error(json.message);
      window.location.href = json.data.checkoutUrl;
    } catch (err) {
      setPayError(err instanceof Error ? err.message : "Failed to initiate payment. Please try again.");
      setPayState("error");
    }
  };

  const handleCancel = async () => {
    setCancelState("loading");
    setCancelError("");
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/customer-portal/sessions/${token}/cancel-now`,
        { method: "POST" },
      );
      const json: CancelResponse = await res.json();
      if (!json.status) throw new Error(json.message);
      setCancelState("success");
    } catch (err) {
      setCancelError(err instanceof Error ? err.message : "Failed to cancel subscription. Please try again.");
      setCancelState("error");
    } finally {
      setShowCancelConfirm(false);
    }
  };

  // ── Cancelled success state ───────────────────────────────────────────────
  if (cancelState === "success") {
    return (
      <Page>
        <Card>
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <XCircle />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Subscription cancelled
              </h2>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                Your subscription has been cancelled successfully. You won't be billed again.
              </p>
            </div>
          </div>
        </Card>
        <Footer />
      </Page>
    );
  }

  // ── Main options ──────────────────────────────────────────────────────────
  return (
    <Page>
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <WalletSVG />
        </div>
        <span className="text-base font-semibold text-gray-900 dark:text-white tracking-tight">
          SubGrid
        </span>
      </div>

      <Card>
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            Payment required
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Your subscription has a failed payment. Choose an action below.
          </p>
        </div>

        <div className="h-px bg-gray-100 dark:bg-white/10 mb-6" />

        <div className="flex flex-col gap-3">
          {/* Pay now */}
          <div className="flex flex-col gap-2">
            <button
              onClick={handlePay}
              disabled={payState === "loading" || cancelState === "loading"}
              className="w-full flex items-center justify-center gap-2.5 px-4 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {payState === "loading" ? (
                <>
                  <SpinnerSVG />
                  Redirecting to payment…
                </>
              ) : (
                <>
                  <WalletSVG />
                  Pay now
                </>
              )}
            </button>
            {payState === "error" && (
              <p className="text-xs text-red-600 dark:text-red-400 px-1">{payError}</p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100 dark:bg-white/10" />
          </div>

          {/* Cancel */}
          {!showCancelConfirm ? (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={payState === "loading" || cancelState === "loading"}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-medium text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              <BanSVG />
              Cancel subscription
            </button>
          ) : (
            <div className="flex flex-col gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
              <p className="text-sm font-medium text-red-800 dark:text-red-300">
                Are you sure you want to cancel?
              </p>
              <p className="text-xs text-red-600 dark:text-red-400">
                This will end your subscription immediately. This action cannot be undone.
              </p>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleCancel}
                  disabled={cancelState === "loading"}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {cancelState === "loading" ? <><SpinnerSVG />Cancelling…</> : "Yes, cancel"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  disabled={cancelState === "loading"}
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors disabled:opacity-60 cursor-pointer"
                >
                  Keep subscription
                </button>
              </div>
              {cancelState === "error" && (
                <p className="text-xs text-red-600 dark:text-red-400 mt-1">{cancelError}</p>
              )}
            </div>
          )}
        </div>
      </Card>

      <Footer />
    </Page>
  );
}

// ── Layout helpers ────────────────────────────────────────────────────────────
const Page = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center px-4 py-12">
    <div className="w-full max-w-sm flex flex-col items-center">
      {children}
    </div>
  </div>
);

const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl shadow-sm p-6 mb-4">
    {children}
  </div>
);

const Footer = () => (
  <p className="text-xs text-gray-400 text-center mt-2">
    Powered by <span className="font-medium text-gray-500 dark:text-gray-400">SubGrid</span>
    {" · "}
    <span>Secure payment processing</span>
  </p>
);
