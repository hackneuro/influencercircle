"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CreditCard, AlertCircle } from "lucide-react";
import { Suspense } from "react";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import { useLanguage } from "@/components/marketing/LanguageContext";

function getEnv(val: string | undefined): string | undefined {
  return val ? val.trim() : undefined;
}

function priceEnvFor(region: string | null) {
  // Default fallback (USA)
  // Ensure we have a fallback even if NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID is missing
  const defaultPriceId = getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID) || getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_USA);
  if (!region) return defaultPriceId;

  const envMap: Record<string, string | undefined> = {
    // USA and fallbacks to USA
    "usa": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_USA) || defaultPriceId,
    "rest-of-asia": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_REST_OF_ASIA) || defaultPriceId,
    "other": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_OTHER) || defaultPriceId,

    // Specific regions
    "brazil": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_BRAZIL),
    "puc-angels": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PUC_ANGELS_PRICE_ID),
    "europe": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_EUROPE),
    "india": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_INDIA),
    "australia": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_AUSTRALIA),
    
    // Latin America Specifics
    "colombia": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_COLOMBIA),
    "argentina": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_ARGENTINA),
    "mexico": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_MEXICO),
    "chile": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_CHILE),
    
    // Latin America General -> Uses Colombia ID
    "latin-america": getEnv(process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID_COLOMBIA)
  };

  return envMap[region] ?? defaultPriceId;
}

function regionPricing(region: string | null) {
  const table: Record<string, { label: string; price: string; discount: string; currencyLabel: string; isSpecial?: boolean }> = {
    "usa": { label: "USA", price: "USD 199/mo", discount: "USD 99/mo", currencyLabel: "USD" },
    "other": { label: "Other", price: "USD 199/mo", discount: "USD 99/mo", currencyLabel: "USD" },
    "brazil": { label: "Brazil", price: "BRL 299/mo", discount: "BRL 49,90/mo", currencyLabel: "BRL" },
    "puc-angels": { label: "PUC angels (Participants)", price: "BRL 299/mo", discount: "BRL 39,90/mo", currencyLabel: "BRL", isSpecial: true },
    "europe": { label: "Europe", price: "EUR 199/mo", discount: "EUR 99/mo", currencyLabel: "EUR" },
    "india": { label: "India", price: "INR 8000/mo", discount: "INR 4000/mo", currencyLabel: "INR" },
    "australia": { label: "Australia", price: "AUD 199/mo", discount: "AUD 99/mo", currencyLabel: "AUD" },
    "rest-of-asia": { label: "Rest of Asia", price: "USD 199/mo", discount: "USD 99/mo", currencyLabel: "USD" },
    "colombia": { label: "Colombia", price: "COP 203000/mo", discount: "COP 135000/mo", currencyLabel: "COP" },
    "argentina": { label: "Argentina", price: "ARS 78559/mo", discount: "ARS 52285/mo", currencyLabel: "ARS" },
    "mexico": { label: "Mexico", price: "MXN 969/mo", discount: "MXN 645/mo", currencyLabel: "MXN" },
    "chile": { label: "Chile", price: "CLP 49011/mo", discount: "CLP 32619/mo", currencyLabel: "CLP" },
    "latin-america": { label: "Latin America", price: "COP 203000/mo", discount: "COP 135000/mo", currencyLabel: "COP" }
  };
  const key = region ?? "usa";
  return table[key] ?? table["usa"];
}

function PricingContent() {
  const params = useSearchParams();
  const region = params.get("region");
  const priceId = priceEnvFor(region);
  const pricing = regionPricing(region);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth
      .getUser()
      .then(({ data }) => {
        if (!active) return;
        const user = data?.user ?? null;
        setIsAuthenticated(!!user);
        setAuthEmail(user?.email ?? null);
      })
      .catch(() => {
        if (!active) return;
        setIsAuthenticated(false);
        setAuthEmail(null);
      });
    return () => {
      active = false;
    };
  }, []);

  const { t } = useLanguage();

  const checkout = async () => {
    try {
      setLoading(true);
      setMessage(null);

      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        setMessage(t("platform.auth.sessionExpired"));
        return;
      }
      const accessToken = sessionData.session.access_token;

      const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ??
        (typeof window !== "undefined" ? window.location.origin : "");
      const regionParam = region ? `region=${encodeURIComponent(region)}` : "";
      const successUrl = `${baseUrl}/dashboard?checkout=elite-success${
        regionParam ? `&${regionParam}` : ""
      }`;
      const cancelUrl = `${baseUrl}/onboarding/elite-pricing${
        region ? `?region=${encodeURIComponent(region)}` : ""
      }`;

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          mode: "subscription",
          priceId,
          region,
          successUrl,
          cancelUrl
        })
      });

      const json = await res.json();

      if (res.status === 401) {
        setMessage(t("platform.auth.loginRequired"));
        return;
      }

      if (!res.ok) {
        setMessage(json?.error || t("platform.onboarding_error_generic"));
        return;
      }

      if (json.url) {
        window.location.href = json.url;
      } else {
        setMessage(t("platform.onboarding_error_generic"));
      }
    } catch {
      setMessage(t("platform.onboarding_error_connect"));
    } finally {
      setLoading(false);
    }
  };

  const isCheckoutDisabled = loading || !isAuthenticated || !priceId;

  if (loading) return <div>Loading...</div>;
  if (!pricing) return <div>Invalid region.</div>;

  return (
    <main className="space-y-6">
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Elite Plan</h1>
        <p className="text-sm text-ic-subtext">Region: <strong className="uppercase">{pricing.label}</strong></p>
        {isAuthenticated === true && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs text-green-800">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <span>
              {t("platform.auth.loggedIn").replace("{email}", authEmail || "")}
            </span>
          </div>
        )}
        {isAuthenticated === false && (
          <div className="mt-3 flex flex-col gap-2">
            <div className="flex items-start gap-2 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-xs text-yellow-900">
              <AlertCircle className="h-4 w-4 mt-0.5" />
              <p>
                Para assinar o plano Elite você precisa estar logado. Primeiro{" "}
                <Link href="/onboarding" className="underline font-semibold">
                  preencha o formulário de Onboarding
                </Link>{" "}
                ou, se já tiver conta,{" "}
                <Link href="/login" className="underline font-semibold">
                  faça login aqui
                </Link>
                .
              </p>
            </div>
          </div>
        )}
        <div className="mt-3 text-sm">
          <p>Standard price: <strong>{pricing.price}</strong></p>
          <p>{pricing.isSpecial ? "Special discount for PUC angels members/associates:" : "Discount for free users:"} <strong>{pricing.discount}</strong></p>
        </div>
      </section>

      <section className="card p-6">
        <h3 className="font-semibold mb-3">What you get</h3>
        <ul className="list-disc pl-5 text-sm space-y-1">
          <li>50 Engagements per 1 post per 1 working day</li>
          {/* <li>10 comments</li>
          <li>20 saves</li> */}
          <li>1 Account manager talking to you via WhatsApp</li>
          <li>Access to dashboard (including keeping your SSI Linkedin points in a graphic to check your growth)</li>
          {/* <li>Targeted Location & Market Profile</li> */}
        </ul>
        {pricing.isSpecial && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800 italic">
            30% of your fee will be donated to PUC angels so they can help build a better world through education in Brazil.
          </div>
        )}
        {/* <p className="text-sm text-ic-subtext mt-3">
          Prices vary by market. See details at <a className="text-ic-accent underline" href="https://www.viralmind.me/#plans" target="_blank">ViralMind Plans</a>.
        </p> */}
        <p className="text-sm text-ic-subtext mt-2 italic">
          &gt; If you want more interactions or more posts per day talk to us about special plans.
        </p>
        <button
          className="mt-4 btn btn-primary w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={checkout}
          disabled={isCheckoutDisabled}
        >
          {loading ? "Iniciando checkout..." : "Proceed to Checkout"} <CreditCard className="h-4 w-4" />
        </button>
        {message && (
          <div className="mt-4 flex items-start gap-2 text-sm text-red-600">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <p>{message}</p>
          </div>
        )}
        {!priceId && (
           <div className="mt-4 flex items-start gap-2 text-sm text-red-600">
             <AlertCircle className="h-4 w-4 mt-0.5" />
             <p>Error: Price configuration missing for this region. Please contact support.</p>
           </div>
        )}
        <p className="mt-4 text-xs text-slate-500 font-medium">
          Not time-bound contract, you can leave whenever you want (or downgrade back to the Member plan)
        </p>
      </section>
    </main>
  );
}

export default function ElitePricingPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading pricing...</div>}>
      <PricingContent />
    </Suspense>
  );
}
