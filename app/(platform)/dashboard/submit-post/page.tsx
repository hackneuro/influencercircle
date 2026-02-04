"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Send, AlertCircle, X } from "lucide-react";
import type { ServiceRow } from "@/types/database";
import { getPlatformProducts } from "@/services/marketplaceService";
import { supabase } from "@/lib/supabaseClient";

function isLinkedInPost(url: string) {
  const u = url.trim();
  return /^https?:\/\/(www\.)?linkedin\.com\/(posts|feed\/update\/urn:li:activity)/.test(u);
}
function isInstagramPost(url: string) {
  const u = url.trim();
  return /^https?:\/\/(www\.)?instagram\.com\/p\/[A-Za-z0-9_-]+/.test(u);
}

export default function SubmitPostPage() {
  const [linkedin, setLinkedin] = useState("");
  const [instagram, setInstagram] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [products, setProducts] = useState<ServiceRow[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [authEmail, setAuthEmail] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Free Plan State
  const [freePostUrl, setFreePostUrl] = useState("");
  const [freeSubmitting, setFreeSubmitting] = useState(false);
  const [canSubmitFree, setCanSubmitFree] = useState<boolean | null>(null);
  const [freeError, setFreeError] = useState<string | null>(null);
  const [freeSuccess, setFreeSuccess] = useState(false);
  const [loadingFreeLimit, setLoadingFreeLimit] = useState(false);
  const [isElite, setIsElite] = useState(false);

  useEffect(() => {
    // Check if user is elite
    supabase.auth.getUser().then(async ({ data }) => {
      if (data?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('plan')
          .eq('id', data.user.id)
          .single();
        setIsElite(profile?.plan === 'elite');
      }
    });
  }, []);

  useEffect(() => {
    // Check for success param in URL
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.get("checkout") === "success") {
      setShowSuccess(true);
      const sessionId = searchParams.get("session_id");
      if (sessionId) {
        setOrderId(sessionId.slice(-8).toUpperCase());
      }
      // Clean up URL without reload
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated === true) {
      let active = true;
      setLoadingFreeLimit(true);
      
      supabase.auth.getSession().then(({ data: { session } }) => {
         if (!session || !active) return;
         
         fetch("/api/submit-free-post", {
           headers: {
             Authorization: `Bearer ${session.access_token}`
           }
         })
         .then(res => res.json())
         .then(data => {
           if (active) {
              setCanSubmitFree(data.canSubmit);
           }
         })
         .catch(err => console.error("Error checking free limit:", err))
         .finally(() => {
            if (active) setLoadingFreeLimit(false);
         });
      });
  
      return () => { active = false; };
    }
  }, [isAuthenticated]);

  useEffect(() => {
    let active = true;
    setLoadingProducts(true);
    setProductsError(null);
    getPlatformProducts()
      .then((items) => {
        if (!active) return;
        // Filter out "Elite Membership" product as it shouldn't be selectable here
        const filteredItems = items.filter(
          (p) => !p.title.toLowerCase().includes("elite")
        );
        setProducts(filteredItems);
        if (filteredItems.length > 0) {
          setSelectedProductId(filteredItems[0].id);
        }
      })
      .catch((e: any) => {
        if (!active) return;
        console.error("Error loading platform products from Supabase:", e);
        setProductsError(e.message ?? "Failed to load products");
      })
      .finally(() => {
        if (!active) return;
        setLoadingProducts(false);
      });
    return () => {
      active = false;
    };
  }, []);

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

  const canSend =
    !!isAuthenticated &&
    agree &&
    !!selectedProductId &&
    (linkedin.trim().length > 0 || instagram.trim().length > 0);

  const handleFreeSubmit = async () => {
    setFreeError(null);
    setFreeSuccess(false);
    
    if (!freePostUrl.trim()) {
      setFreeError("Please provide a post URL");
      return;
    }

    if (freePostUrl.trim() && !isLinkedInPost(freePostUrl)) {
      setFreeError("LinkedIn link must be a post in your account.");
      return;
    }

    setFreeSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("/api/submit-free-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ postUrl: freePostUrl })
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit");
      }

      setFreeSuccess(true);
      setCanSubmitFree(false);
      setFreePostUrl("");
      
    } catch (e: any) {
      setFreeError(e.message);
    } finally {
      setFreeSubmitting(false);
    }
  };

  const submit = async () => {
    setError(null);
    if (!agree) {
      setError("You must accept the policy before sending.");
      return;
    }
    if (!selectedProductId) {
      setError("Please select a package before sending.");
      return;
    }
    if (!linkedin.trim() && !instagram.trim()) {
      setError("Provide at least one post link.");
      return;
    }
    if (linkedin.trim() && !isLinkedInPost(linkedin)) {
      setError("LinkedIn link must be a post in your account.");
      return;
    }
    if (instagram.trim() && !isInstagramPost(instagram)) {
      setError("Instagram link must be a post in your account.");
      return;
    }
    setSending(true);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        setError("Your login session has expired. Please log in again and try.");
        return;
      }

      const postUrl = linkedin.trim() || instagram.trim();
      const origin = window.location.origin;

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session.access_token}`
        },
        body: JSON.stringify({
          serviceId: selectedProductId,
          postUrl,
          successUrl: `${origin}/dashboard/submit-post?checkout=success`,
          cancelUrl: `${origin}/dashboard/submit-post?checkout=cancel`
        })
      });

      if (!response.ok) {
        let message = "Failed to start checkout. Please try again.";
        try {
          const data = await response.json();
          if (data?.error && typeof data.error === "string") {
            message = data.error;
          }
        } catch (e) {
          console.error("Error parsing error response:", e);
        }
        throw new Error(message);
      }

      const json = await response.json();
      if (json?.url && typeof json.url === "string") {
        window.location.href = json.url;
        return;
      }

      setError("Checkout URL was not returned. Please try again.");
    } catch (e: any) {
      setError(e?.message || "Failed to start checkout. Please try again.");
    } finally {
      setSending(false);
    }
  };

  if (loadingProducts) {
    return <div className="p-8 text-center text-slate-500">Loading products...</div>;
  }

  if (productsError) {
    return (
      <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl border border-red-200">
        <AlertCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
        <p className="font-semibold">Error loading products</p>
        <p className="text-sm mt-1">{productsError}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
      {/* Success Message */}
      {showSuccess && (
        <div className="p-6 bg-green-50 border border-green-200 rounded-xl flex items-start gap-4 shadow-sm animate-in slide-in-from-top-4">
          <div className="bg-green-100 p-2 rounded-full">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-green-900">Purchase Successful!</h3>
            <p className="text-green-800 mt-1">
              Thank you for your order. We have received your request and will start processing it shortly.
              You will receive a confirmation email soon.
            </p>
            {orderId && (
              <p className="text-sm text-green-700 mt-2 font-mono bg-green-100/50 inline-block px-2 py-1 rounded">
                Order Ref: {orderId}
              </p>
            )}
            <div className="mt-3">
              <button 
                onClick={() => setShowSuccess(false)}
                className="text-sm font-medium text-green-700 hover:text-green-900 underline"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <section className="card p-6">
        <h1 className="text-2xl font-semibold mb-2">Send us a Post for Increase engagement</h1>
        <p className="text-sm text-ic-subtext">Paste your post links below. At least one is required.</p>
        {isAuthenticated === true && (
          <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs text-green-800">
            <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
            <span>
              Você está logado
              {authEmail ? ` como ${authEmail}` : ""}. Pode concluir a compra com segurança.
            </span>
          </div>
        )}
      </section>

      {/* Daily Submission Section */}
      <section className={`card p-6 space-y-4 border-l-4 ${isElite ? "border-l-amber-500 bg-amber-50/10" : "border-l-blue-500"}`}>
        <div>
          <h2 className="text-lg font-semibold flex items-center gap-2">
            {isElite ? (
              <>
                <span className="text-amber-600">👑</span> Elite Daily Engagement
              </>
            ) : "Daily Free Engagement"}
            
            <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${isElite ? "bg-amber-100 text-amber-700 border border-amber-200" : "bg-blue-100 text-blue-700"}`}>
              {isElite ? "Elite Plan" : "Free Plan"}
            </span>
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            {isElite 
              ? "As an Elite member, submit your daily post here for prioritized engagement."
              : "Submit one post per day for free engagement. This limit resets every day at midnight (UTC-3)."
            }
          </p>
        </div>

        {isAuthenticated === false ? (
           <div className="text-sm text-slate-500 bg-slate-50 p-3 rounded-lg">
              Please log in to use the daily free engagement.
           </div>
        ) : loadingFreeLimit ? (
          <p className="text-sm text-slate-500 animate-pulse">Checking daily limit...</p>
        ) : (
          <div className="space-y-3">
             {freeSuccess && (
                <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm flex items-center gap-2 animate-in fade-in">
                  <CheckCircle className="h-4 w-4" />
                  Post submitted successfully! Admin has been notified.
                </div>
             )}

             {!canSubmitFree && !freeSuccess ? (
                <div className="p-3 bg-orange-50 text-orange-800 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  You have reached your daily limit. Come back tomorrow for another free boost!
                </div>
             ) : !freeSuccess && (
                <div className="flex flex-col gap-3">
                  <div>
                    <input
                      className="border rounded-md px-3 py-2 w-full text-sm"
                      placeholder="Paste your LinkedIn post URL here..."
                      value={freePostUrl}
                      onChange={(e) => setFreePostUrl(e.target.value)}
                      disabled={freeSubmitting}
                    />
                    <p className="text-xs text-slate-500 mt-1">Only LinkedIn posts are supported currently.</p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      className={`px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${
                        isElite 
                          ? "bg-amber-500 text-white hover:bg-amber-600" 
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                      disabled={freeSubmitting || !freePostUrl}
                      onClick={handleFreeSubmit}
                    >
                      {freeSubmitting ? "Submitting..." : isElite ? "Submit Elite Post" : "Submit Free Post"}
                    </button>
                    
                    {freeError && (
                      <span className="text-sm text-red-600 flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" /> {freeError}
                      </span>
                    )}
                  </div>
                </div>
             )}
          </div>
        )}
      </section>

      <section className="card p-6 space-y-4">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">Choose your engagement package</h2>
          {loadingProducts && (
            <p className="text-sm text-ic-subtext">Loading packages...</p>
          )}
          {productsError && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-4 w-4" />
              {productsError}
            </p>
          )}
          {!loadingProducts && !productsError && products.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {products.map((product) => {
                const isSelected = selectedProductId === product.id;
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => setSelectedProductId(product.id)}
                    className={`text-left border rounded-xl p-4 transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/40 shadow-sm"
                        : "border-slate-200 hover:border-blue-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-slate-900">{product.title}</h3>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    {product.description && (
                      <p className="text-xs text-slate-600 mb-2">
                        {product.description}
                      </p>
                    )}
                    <p className="text-sm font-bold text-slate-900">
                      {product.currency} {product.price.toFixed(2)}
                    </p>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="text-sm font-medium">LinkedIn Post</label>
            <input
              className="mt-1 border rounded-md px-3 py-2 w-full"
              placeholder="https://www.linkedin.com/posts/..."
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
            />
            <p className="text-xs text-ic-subtext mt-1">It must be a post in your account.</p>
          </div>
          {/* <div>
            <label className="text-sm font-medium">Instagram Post</label>
            <input
              className="mt-1 border rounded-md px-3 py-2 w-full"
              placeholder="https://www.instagram.com/p/..."
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
            />
            <p className="text-xs text-ic-subtext mt-1">It must be a post in your account.</p>
          </div> */}
        </div>

        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
          />
          <span>
            We keep our content positive and technical. All post as human-checked so it doesn't contain content that goes against our rules and policy. All Political, Religous, Government related, Adult/ Sexy, Gambiling, Achool, Weapons, Violence, Extremist, Crime/ Drug related will NOT be accepted (it doesn't matter that you are a Member or Elite).
          </span>
        </label>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <button
              className="btn btn-primary"
              disabled={!canSend || sending}
              onClick={submit}
            >
              Send <Send className="h-4 w-4" />
            </button>
            
            {error && (
              <span className="text-sm text-red-700 flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> {error}
              </span>
            )}
          </div>
          {isAuthenticated === false && (
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2 p-3 rounded-lg border border-yellow-300 bg-yellow-50 text-sm text-yellow-900">
                <AlertCircle className="h-4 w-4 mt-0.5" />
                <p>
                  Para liberar o botão <strong>Send</strong> e comprar o pacote de likes,
                  você precisa estar logado. Primeiro preencha o{" "}
                  <Link href="/onboarding" className="underline font-semibold">
                    formulário de Onboarding
                  </Link>{" "}
                  ou, se já tiver conta,{" "}
                  <Link href="/login" className="underline font-semibold">
                    faça login aqui
                  </Link>{" "}
                  e depois volte para esta tela.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Support Email Section - Only for Elite Members */}
      {isElite && (
        <section className="card p-6 border-t-4 border-t-purple-500 bg-purple-50/50">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-purple-900">
            <span className="bg-purple-100 p-1 rounded-md">👑</span> Elite Support
          </h2>
          <div className="prose prose-sm max-w-none text-slate-700">
            <p>
              As an Elite member, you have priority access to our technical team.
              If you need any assistance with your posts or account, please contact us directly at:
            </p>
            <div className="mt-3 flex items-center gap-2 font-mono bg-white px-4 py-2 rounded-lg border border-purple-200 inline-block">
              <span className="text-purple-700 font-bold">tecnologia@hackneuro.com</span>
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
