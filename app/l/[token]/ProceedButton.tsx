"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

export default function ProceedButton(props: { token: string }) {
  const { token } = props;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleProceed = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/public/linkedin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Failed to generate LinkedIn link");
      }

      const maybeUrl =
        data?.url ||
        data?.link ||
        data?.redirect_url ||
        data?.redirectUrl ||
        data?.data?.url ||
        data?.data?.link;

      if (typeof maybeUrl === "string" && maybeUrl.startsWith("http")) {
        window.location.href = maybeUrl;
        return;
      }

      throw new Error("Integration service did not return a redirect URL");
    } catch (e: any) {
      setError(e?.message || "Failed to proceed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <button
        onClick={handleProceed}
        disabled={loading}
        className="btn btn-primary w-full sm:w-auto px-6"
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Processing...
          </span>
        ) : (
          "Click here to proceed"
        )}
      </button>
      {error && <div className="text-sm text-red-600">{error}</div>}
    </div>
  );
}
