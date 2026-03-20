"use client";

import { useEffect, useState } from "react";

export default function ExpiredRedirect(props: { seconds?: number }) {
  const seconds = props.seconds ?? 5;
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    const timeout = window.setTimeout(() => {
      window.location.href = "https://www.influencercircle.net";
    }, seconds * 1000);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, [seconds]);

  return (
    <div className="text-xs text-slate-500">
      Redirecting in {remaining}s...
    </div>
  );
}

