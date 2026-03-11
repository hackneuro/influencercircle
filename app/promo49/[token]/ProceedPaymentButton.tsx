"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProceedPaymentButton(props: { token: string }) {
  const { token } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const proceed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/promo49br/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || "Failed to start checkout");
      if (!data?.url) throw new Error("Missing checkout URL");

      window.location.href = data.url;
    } catch (e: any) {
      setError(e?.message || "Failed to proceed");
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={proceed}
        disabled={loading}
        className="btn btn-primary w-full sm:w-auto px-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Starting checkout...
          </span>
        ) : (
          "Click to proceed with payment"
        )}
      </button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}

