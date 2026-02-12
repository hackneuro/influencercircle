"use client";
import { useState, useEffect } from "react";
import { ArrowRight, CheckCircle, CreditCard, AlertCircle, Linkedin, Instagram, Phone, Briefcase, Mail, Loader2 } from "lucide-react";
import type { Profile } from "@/types";
import { useRouter } from "next/navigation";
import { upsertProfileFromOnboarding, getMyProfile } from "@/services/profileService";
import { supabase } from "@/lib/supabaseClient";

type FormData = Omit<Profile, "id" | "created_at" | "updated_at"> & {
  user_types: string[];
};

export default function OnboardingForm() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [plan, setPlan] = useState<FormData["plan"]>("member");
  const [region, setRegion] = useState<string>("");
  const [countryCode, setCountryCode] = useState("+1");
  const [phonePart, setPhonePart] = useState("");
  const router = useRouter();
  const [data, setData] = useState<FormData>({
    name: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    country: "",
    linkedin_url: "",
    instagram_url: "",
    objective: "",
    market_objective: "",
    location_objective: "",
    average_content_price: undefined,
    about_yourself: "",
    plan: "member",
    disclaimer_accepted: false,
    user_types: [] as string[],
    is_visible: true,
    campaign_preference: "Yes, I want to receive campaign propositions for me to approve",
    social_cause_preference: "No, I don't want to donate",
    advisor_sub_choices: [],
    influencer_channels: [],
    student_level: [],
    company_type: [],
    investor_type: [],
    executive_experience: []
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [connections, setConnections] = useState({
    linkedin: false,
    instagram: false,
    whatsapp: false
  });

  const [isVerifying, setIsVerifying] = useState(false);
  const [pollingId, setPollingId] = useState<NodeJS.Timeout | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isConnectingLinkedin, setIsConnectingLinkedin] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useEffect(() => {
    let player: any = null;

    if (showVideo) {
      const initPlayer = () => {
        // @ts-ignore
        player = new window.YT.Player('youtube-player', {
          height: '100%',
          width: '100%',
          videoId: 'qDaLSX16VTM',
          playerVars: {
            'autoplay': 1,
            'controls': 0,
            'rel': 0,
            'playsinline': 1
          },
          events: {
            'onReady': (event: any) => {
              event.target.setVolume(30);
            }
          }
        });
      };

      if (!(window as any).YT) {
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        (window as any).onYouTubeIframeAPIReady = initPlayer;
      } else {
        initPlayer();
      }
    }

    return () => {
        if (player) {
            // player.destroy(); 
        }
    };
  }, [showVideo]);
  
  const deriveUsernameFromEmail = (email: string) => {
    const localPart = (email.split("@")[0] || "").toLowerCase();
    let handle = localPart.replace(/[^a-z0-9._-]/g, "-").replace(/-+/g, "-");
    handle = handle.replace(/^[-_.]+|[-_.]+$/g, "");
    if (!handle) {
      handle = "user";
    }
    return handle;
  };

  const isE164 = (v: string) => /^\+?[1-9]\d{7,14}$/.test(v.trim());
  const isUrl = (v: string) => {
    try {
      new URL(v);
      return true;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          setIsAuthenticated(true);
        }
        
        // Debug info gathering
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!session) return;

        // Check confirmation status on load
        // STRICT CHECK: user must be confirmed or not email provider
        if (user && !user.email_confirmed_at && user.app_metadata.provider === 'email') {
           console.log("[Onboarding] User has session but is unconfirmed. Enforcing verification.");
           setIsVerifying(true);
           startPolling();
           return;
        }

        const profile = await getMyProfile();
        if (profile) {
          // Reconstruct user_types from profile data
          const types: string[] = [];
          if (profile.role === 'influencer' || (profile.influencer_channels && profile.influencer_channels.length > 0)) types.push('influencer');
          if (profile.company_type && profile.company_type.length > 0) types.push('company');
          if (profile.investor_type && profile.investor_type.length > 0) types.push('investor');
          if (profile.executive_experience && profile.executive_experience.length > 0) types.push('executive');
          if (profile.student_level && profile.student_level.length > 0) types.push('student');
          if (profile.advisor_sub_choices && profile.advisor_sub_choices.length > 0) types.push('advisor');
          // Fallback: if no specific arrays but role is 'user', might be executive, but we can't be sure.
          // We'll leave it empty or keep existing defaults if nothing found.

          // Parse phone number
          let loadedCountryCode = "+1";
          let loadedPhonePart = "";
          if (profile.whatsapp) {
            if (profile.whatsapp.startsWith("+55")) {
              loadedCountryCode = "+55";
              loadedPhonePart = profile.whatsapp.slice(3);
            } else {
              // Simple heuristic: take first 2 chars as code if starts with +
              loadedCountryCode = profile.whatsapp.substring(0, 3); // e.g. +12
              loadedPhonePart = profile.whatsapp.substring(3);
            }
            setCountryCode(loadedCountryCode);
            setPhonePart(loadedPhonePart);
          }

          // Update connections state based on profile data
          setConnections(prev => ({
            ...prev,
            linkedin: !!profile.linkedin_url,
            instagram: !!profile.instagram_url,
            whatsapp: !!profile.whatsapp
          }));

          setData(prev => ({
            ...prev,
            name: profile.name || prev.name,
            email: profile.email || prev.email,
            city: profile.city || prev.city,
            state: profile.state || prev.state,
            country: profile.country || prev.country,
            user_types: types.length > 0 ? types : prev.user_types,
            linkedin_url: profile.linkedin_url || prev.linkedin_url,
            instagram_url: profile.instagram_url || prev.instagram_url,
            objective: profile.objective || prev.objective,
            market_objective: profile.market_objective || prev.market_objective,
            location_objective: profile.location_objective || prev.location_objective,
            average_content_price: profile.average_content_price ?? prev.average_content_price,
            about_yourself: profile.about_yourself || prev.about_yourself,
            plan: profile.plan || prev.plan,
            disclaimer_accepted: profile.disclaimer_accepted || prev.disclaimer_accepted,
            advisor_sub_choices: profile.advisor_sub_choices || prev.advisor_sub_choices,
            influencer_channels: profile.influencer_channels || prev.influencer_channels,
            student_level: profile.student_level || prev.student_level,
            company_type: profile.company_type || prev.company_type,
            investor_type: profile.investor_type || prev.investor_type,
            campaign_preference: profile.campaign_preference || prev.campaign_preference,
            social_cause_preference: profile.social_cause_preference || prev.social_cause_preference,
            is_visible: profile.is_public ?? prev.is_visible
          }));

          // Determine step
          if (profile.city && profile.country && profile.name) {
             // Step 1 likely done
             let nextStep = 2;
             if (profile.objective && profile.market_objective && profile.location_objective) {
               nextStep = 3;
               // Check connections
               if (profile.linkedin_url && profile.instagram_url) {
                 nextStep = 4;
               }
             }
             setStep(nextStep);
          }
        }
      } catch (e) {
        console.error("Failed to load existing profile", e);
      }
    }
    load();
  }, []);

  useEffect(() => {
    return () => {
      if (pollingId) clearInterval(pollingId);
    };
  }, [pollingId]);

  const createProfileAfterAuth = async () => {
    const finalPhone = `${countryCode}${phonePart.replace(/\D/g, "")}`;
    const role = data.user_types.includes("influencer") ? "influencer" : "user";
    
    await upsertProfileFromOnboarding({
        username: deriveUsernameFromEmail(data.email.trim()),
        name: data.name,
        email: data.email,
        whatsapp: finalPhone,
        city: data.city,
        state: data.state,
        country: data.country,
        linkedin_url: data.linkedin_url,
        instagram_url: data.instagram_url,
        objective: data.objective,
        market_objective: data.market_objective,
        location_objective: data.location_objective,
        average_content_price: data.average_content_price,
        about_yourself: data.about_yourself,
        plan: data.plan,
        region: region, // Save region state
        user_types: data.user_types, // Save raw user types
        advisor_sub_choices: data.advisor_sub_choices,
        influencer_channels: data.influencer_channels,
        student_level: data.student_level,
        company_type: data.company_type,
        investor_type: data.investor_type,
        executive_experience: data.executive_experience,
        disclaimer_accepted: data.disclaimer_accepted,
        is_visible: data.is_visible,
        campaign_preference: data.campaign_preference,
        social_cause_preference: data.social_cause_preference,
        role: role
      });
  };

  const startPolling = () => {
    if (pollingId) return;
    const id = setInterval(async () => {
      // First, try to see if we have an active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        // If we have a session, check if it is confirmed
        // Note: For some providers or configs, email_confirmed_at might be missing but user is verified.
        // But for email signup with confirmation enabled, it should be present.
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user && user.email_confirmed_at) {
           clearInterval(id);
           setPollingId(null);
           setIsVerifying(false);
           try {
             await createProfileAfterAuth();
           } catch (e) {
             console.error("Failed to create profile during polling:", e);
           }
           setStep(2);
        }
      } else {
         // If no session, try to sign in (in case they clicked the link in another tab but this tab needs a refresh of session state)
         // Actually, signInWithPassword will fail if unconfirmed.
         // If they confirmed in another tab, they might need to sign in here.
         // But usually, the link logs them in the other tab.
         // We can try to recover session or just wait.
         // Let's keep the old logic of trying to sign in, which might work if they confirmed?
         // No, signInWithPassword requires password.
         
         const { data: signInData } = await supabase.auth.signInWithPassword({
            email: data.email,
            password
         });
         
         if (signInData.session && signInData.user?.email_confirmed_at) {
            clearInterval(id);
            setPollingId(null);
            setIsVerifying(false);
            try {
              await createProfileAfterAuth();
            } catch (e) {
              console.error("Failed to create profile during polling:", e);
            }
            setStep(2);
         }
      }
    }, 4000);
    setPollingId(id);
  };

  const handleSignUpStep1 = async () => {
    setLoading(true);
    setAuthLoading(true);
    setMessage(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Strict session check: if session exists, verify it matches the current email input
      if (session) {
        if (session.user.email?.toLowerCase() === data.email.toLowerCase()) {
          // Force refresh user data to check confirmation status reliably
          const { data: { user: freshUser }, error: userError } = await supabase.auth.getUser();
          
          if (userError || !freshUser) {
             // Session might be invalid, sign out
             await supabase.auth.signOut();
          } else {
             // Check if user is confirmed
             const isConfirmed = !!freshUser.email_confirmed_at;
             const isOAuth = freshUser.app_metadata?.provider && freshUser.app_metadata.provider !== 'email';
             
             console.log("[Onboarding] Existing session check:", { email: freshUser.email, isConfirmed, confirmedAt: freshUser.email_confirmed_at });

             if (isConfirmed || isOAuth) {
                await createProfileAfterAuth();
                setStep(2);
                return;
             } else {
                // User has session but NOT confirmed
                setIsVerifying(true);
                startPolling();
                return;
             }
          }
        } else {
          // Mismatch: User is logged in as someone else. Sign out to allow new sign up.
          await supabase.auth.signOut();
        }
      }

      const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
        email: data.email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/verified`
        }
      });

      if (signUpError) throw signUpError;

      // Force refresh user data to ensure we have the latest status from server
      // (Sometimes signUp returns a session even if unconfirmed, depending on config)
      const { data: { user: newUser } } = await supabase.auth.getUser();
      
      const hasSession = !!signUpData.session;
      const isConfirmed = !!newUser?.email_confirmed_at;
      
      console.log("[Onboarding] SignUp result:", { hasSession, isConfirmed, confirmedAt: newUser?.email_confirmed_at });
      
      // If we got a user but NO session, it means email confirmation is required.
      if (signUpData.user && !hasSession) {
        setIsVerifying(true);
        startPolling();
      } 
      // If we got a session immediately
      else if (hasSession) {
        if (isConfirmed) {
           await createProfileAfterAuth();
           setStep(2);
        } else {
           // Got session but not confirmed -> "Allow unconfirmed sign in" is ON
           setIsVerifying(true);
           startPolling();
        }
      }
    } catch (err: any) {
      setMessage(err.message);
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const validateStepReturnErrors = (s: number) => {
    const newErrors: Record<string, string> = {};
    if (s === 1) {
      if (data.user_types.length === 0) newErrors.user_types = "Please select at least one role";
      if (data.user_types.includes('advisor') && (!data.advisor_sub_choices || data.advisor_sub_choices.length === 0)) {
        newErrors.advisor_sub_choices = "Please select who you want to advise";
      }
      if (data.user_types.includes('influencer') && (!data.influencer_channels || data.influencer_channels.length === 0)) {
        newErrors.influencer_channels = "Please select at least one channel";
      }
      if (data.user_types.includes('student') && (!data.student_level || data.student_level.length === 0)) {
        newErrors.student_level = "Please select your education level";
      }
      if (data.user_types.includes('company') && (!data.company_type || data.company_type.length === 0)) {
        newErrors.company_type = "Please select your company type";
      }
      if (data.user_types.includes('investor') && (!data.investor_type || data.investor_type.length === 0)) {
        newErrors.investor_type = "Please select your investor type";
      }
      if (data.user_types.includes('executive') && (!data.executive_experience || data.executive_experience.length === 0)) {
        newErrors.executive_experience = "Please select your experience level";
      }
      if (!data.name?.trim()) newErrors.name = "Full name is required";
      const fullPhone = `${countryCode}${phonePart.replace(/\D/g, "")}`;
      if (!phonePart.trim()) {
        newErrors.whatsapp = "Phone number is required";
      } else if (!isE164(fullPhone)) {
        newErrors.whatsapp = "Invalid phone format";
      }
      if (!data.email?.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        newErrors.email = "Invalid email format";
      }
      
      if (!isAuthenticated) {
        if (!password.trim()) {
          newErrors.password = "Password is required";
        } else if (password.length < 6) {
          newErrors.password = "Password must be at least 6 characters";
        }
        if (!confirmPassword.trim()) {
          newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
          newErrors.confirmPassword = "Passwords do not match";
        }
      }

      if (!data.city?.trim()) newErrors.city = "City is required";
      if (!data.state?.trim()) newErrors.state = "State is required";
      if (!data.country?.trim()) newErrors.country = "Country is required";
    }
    if (s === 2) {
      if (!data.linkedin_url?.trim()) {
        newErrors.linkedin_url = "LinkedIn link is required";
      } else if (!isUrl(data.linkedin_url)) {
        newErrors.linkedin_url = "Invalid LinkedIn URL";
      }
      if (!data.instagram_url?.trim()) {
        newErrors.instagram_url = "Instagram link is required";
      } else if (!isUrl(data.instagram_url)) {
        newErrors.instagram_url = "Invalid Instagram URL";
      }
      if (!data.objective?.trim()) newErrors.objective = "Objective is required";
      if (!data.market_objective?.trim()) newErrors.market_objective = "Market objective is required";
      if (!data.location_objective?.trim()) newErrors.location_objective = "Location objective is required";
      if (data.average_content_price === undefined || Number.isNaN(data.average_content_price)) newErrors.average_content_price = "Average content price is required";
      if (!data.about_yourself?.trim()) newErrors.about_yourself = "Please write something about yourself";
    }
    if (s === 3) {
      if (!connections.linkedin) newErrors.linkedin_connection = "Please login to your LinkedIn account";
      // if (!connections.instagram) newErrors.instagram_connection = "Please login to your Instagram account";
      // if (!connections.whatsapp) newErrors.whatsapp_connection = "Please login to your WhatsApp account";
    }
    if (s === 4) {
      if (!region) newErrors.region = "Please select your target region";
      if (!data.disclaimer_accepted) newErrors.disclaimerStatus = "You must accept the contact authorization";
    }
    return newErrors;
  };

  const validateStep = (s: number) => {
      // Validation wrapper
      const errors = validateStepReturnErrors(s);
      setErrors(errors);
      return Object.keys(errors).length === 0;
  };

  const saveCurrentProgress = async () => {
    setLoading(true);
    try {
      const finalPhone = `${countryCode}${phonePart.replace(/\D/g, "")}`;
      const role = data.user_types.includes("influencer") ? "influencer" : "user";

      await upsertProfileFromOnboarding({
        username: deriveUsernameFromEmail(data.email.trim()),
        name: data.name,
        email: data.email,
        whatsapp: finalPhone,
        city: data.city,
        state: data.state,
        country: data.country,
        linkedin_url: data.linkedin_url,
        instagram_url: data.instagram_url,
        objective: data.objective,
        market_objective: data.market_objective,
        location_objective: data.location_objective,
        average_content_price: data.average_content_price,
        about_yourself: data.about_yourself,
        plan: data.plan,
        region: region, // Save region state
        user_types: data.user_types, // Save raw user types
        advisor_sub_choices: data.advisor_sub_choices,
        influencer_channels: data.influencer_channels,
        student_level: data.student_level,
        company_type: data.company_type,
        investor_type: data.investor_type,
        executive_experience: data.executive_experience,
        disclaimer_accepted: data.disclaimer_accepted,
        is_visible: data.is_visible,
        campaign_preference: data.campaign_preference,
        social_cause_preference: data.social_cause_preference,
        role: role
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const next = async () => {
    setMessage(null); // Clear previous messages
    
    // Helper to get error message list
    const getErrorList = (errs: Record<string, string>) => {
       const uniqueMessages = Array.from(new Set(Object.values(errs)));
       if (uniqueMessages.length === 1) return uniqueMessages[0];
       return "Please fix: " + uniqueMessages.join(", ");
    };

    if (step === 1) {
      // Validate step 1 specifically
      const currentErrors = validateStepReturnErrors(1);
      setErrors(currentErrors);
      
      if (Object.keys(currentErrors).length === 0) {
        await handleSignUpStep1();
      } else {
        setMessage(getErrorList(currentErrors));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }
    
    // For other steps
    const currentErrors = validateStepReturnErrors(step);
    setErrors(currentErrors);
    
    if (Object.keys(currentErrors).length === 0) {
      try {
        await saveCurrentProgress();
        // Add 3s delay as requested by user to ensure system stability
        setLoading(true);
        setTimeout(() => {
            setStep((s) => Math.min(s + 1, 4));
            setErrors({});
            setLoading(false);
            window.scrollTo(0, 0);
        }, 3000);
      } catch (e) {
        setMessage("Failed to save progress. Please check your connection.");
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setLoading(false);
      }
    } else {
      setMessage(getErrorList(currentErrors));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const prev = () => {
    setStep((s) => Math.max(s - 1, 1));
    setErrors({});
  };

  const update = (key: keyof FormData, value: any) => {
    setData((d) => ({ ...d, [key]: value }));
    if (errors[key]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3) || !validateStep(4)) {
      setMessage("Please correct the errors before completing.");
      return;
    }

    setLoading(true);
    setAuthLoading(true);
    try {
      setMessage(null);
      const { data: existingSession } = await supabase.auth.getSession();
      if (!existingSession.session) {
        const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
          email: data.email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding/verified`
          }
        });
        if (signUpError) {
          throw new Error(signUpError.message || "Failed to create account.");
        }
        if (!signUpData.session) {
          setMessage("Check your email to confirm your account, then log in again to complete onboarding.");
          return;
        }
      }

      const finalPhone = `${countryCode}${phonePart.replace(/\D/g, "")}`;
      const finalData = { ...data, whatsapp: finalPhone, plan };
      const role = finalData.user_types.includes("influencer") ? "influencer" : "user";

      await upsertProfileFromOnboarding({
        username: deriveUsernameFromEmail(finalData.email.trim()),
        name: finalData.name,
        email: finalData.email,
        whatsapp: finalPhone,
        city: finalData.city,
        state: finalData.state,
        country: finalData.country,
        linkedin_url: finalData.linkedin_url,
        instagram_url: finalData.instagram_url,
        objective: finalData.objective,
        market_objective: finalData.market_objective,
        location_objective: finalData.location_objective,
        average_content_price: finalData.average_content_price,
        about_yourself: finalData.about_yourself,
        plan: finalData.plan,
        region: region, // Save region state
        user_types: finalData.user_types, // Save raw user types
        advisor_sub_choices: finalData.advisor_sub_choices,
        influencer_channels: finalData.influencer_channels,
        student_level: finalData.student_level,
        company_type: finalData.company_type,
        investor_type: finalData.investor_type,
        executive_experience: finalData.executive_experience,
        disclaimer_accepted: finalData.disclaimer_accepted,
        is_visible: finalData.is_visible,
        campaign_preference: finalData.campaign_preference,
        social_cause_preference: finalData.social_cause_preference,
        role: role
      });

      if (plan === "elite") {
        router.push(`/onboarding/elite-pricing?region=${encodeURIComponent(region)}`);
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      const msg = err?.message ?? "Failed to submit onboarding.";
      if (msg.includes("Auth session missing") || msg.includes("Not authenticated")) {
        setMessage("Sua sessão de autenticação expirou ou não foi criada. Atualize a página, faça login novamente e tente completar o onboarding.");
      } else {
        setMessage(msg);
      }
    } finally {
      setLoading(false);
      setAuthLoading(false);
    }
  };

  const connectLinkedin = async () => {
    setIsConnectingLinkedin(true);
    setMessage("Initializing connection...");
    console.log("[LinkedIn] Starting connection process...");
    
    // OPTIMIZATION: Use pre-fetched link if available
    if (generatedLink) {
      console.log("[LinkedIn] Using pre-fetched LinkedIn link.");
      setMessage(null);
      // Open as popup with dimensions
      window.open(generatedLink, 'linkedin_login', 'width=600,height=700,status=yes,scrollbars=yes');
      setShowConfirmation(true);
      setIsConnectingLinkedin(false);
      return;
    }

    // Open popup immediately to prevent blocking
    // Use dimensions to force a new window (popup) instead of a tab
    const popupWindow = window.open('', 'linkedin_login', 'width=600,height=700,status=yes,scrollbars=yes');
    if (popupWindow) {
        popupWindow.document.write(`
            <html>
                <head><title>Connecting...</title></head>
                <body style="font-family: system-ui, -apple-system, sans-serif; text-align: center; padding-top: 50px; color: #333;">
                    <div style="margin-bottom: 20px;">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                            <rect x="2" y="9" width="4" height="12"></rect>
                            <circle cx="4" cy="4" r="2"></circle>
                        </svg>
                    </div>
                    <p style="font-size: 18px; font-weight: 500;">Connecting to LinkedIn...</p>
                    <p style="color: #666;">Please wait while we secure your connection.</p>
                </body>
            </html>
        `);
    }

    try {
      // 1. Save progress first to ensure data is up to date
      setMessage("Saving your profile data...");
      console.log("[LinkedIn] Step 1: Saving progress...");
      try {
        await saveCurrentProgress();
        console.log("[LinkedIn] Step 1: Save success.");
      } catch (saveError) {
        console.error("[LinkedIn] Save failed:", saveError);
        // We continue even if save fails, but warn the user
        // setMessage("Warning: Could not save recent changes, proceeding to connection...");
      }

      // 2. Prepare data
      setMessage("Preparing connection data...");
      const finalPhone = `${countryCode}${phonePart.replace(/\D/g, "")}`;
      console.log("[LinkedIn] Step 2: Preparing data for", data.email);
      
      // 3. Call integration API with timeout
      setMessage("Contacting authentication server...");
      console.log("[LinkedIn] Step 3: Fetching API...");
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

      let response;
      try {
        response = await fetch('/api/integration/linkedin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: data.email,
            name: data.name,
            phone: finalPhone,
          }),
          signal: controller.signal
        });
      } catch (fetchError: any) {
        console.error("[LinkedIn] Fetch error:", fetchError);
        if (fetchError.name === 'AbortError') {
          throw new Error('Connection timed out. The integration server is taking too long to respond.');
        }
        throw fetchError;
      } finally {
        clearTimeout(timeoutId);
      }

      console.log("[LinkedIn] Step 4: Response received", response.status);

      if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("[LinkedIn] Server error response:", errorData);
                
                // Differentiate between 504 (Gateway Timeout) and other errors
                if (response.status === 504) {
                     throw new Error("Server Timeout: The link generation service is not responding. Please try again later.");
                }
                
                // Combine error and details for better visibility
                const errorMsg = errorData.error || "Unknown Error";
                const detailsMsg = errorData.details || "";
                const combinedMsg = detailsMsg ? `${errorMsg}: ${detailsMsg}` : errorMsg;

                throw new Error(combinedMsg || `Server Error (${response.status}): Failed to start LinkedIn connection process.`);
              }

      const result = await response.json();
      console.log("[LinkedIn] Step 5: Result parsed", result);
      
      if (result.ok && result.link) {
        // 4. Save link and show modal
        setGeneratedLink(result.link);
        setMessage(null);
        
        if (popupWindow) {
            popupWindow.location.href = result.link;
        } else {
            // Fallback: try to open new window if original failed (might be blocked)
            window.open(result.link, 'linkedin_login', 'width=600,height=700,status=yes,scrollbars=yes');
        }
        
        setShowConfirmation(true);
      } else {
        throw new Error('Invalid response from integration service: Missing link.');
      }

    } catch (error: any) {
      // Do NOT close the popup, instead show the error there so the user knows what happened
      if (popupWindow) {
          popupWindow.document.body.innerHTML = `
            <div style="font-family: system-ui, sans-serif; text-align: center; padding: 40px; color: #333;">
                <div style="color: #ef4444; margin-bottom: 20px;">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <h3 style="margin-bottom: 10px;">Connection Failed</h3>
                <p style="color: #666; margin-bottom: 20px;">${error.message || "An unknown error occurred"}</p>
                <button onclick="window.close()" style="padding: 10px 20px; background: #333; color: white; border: none; border-radius: 6px; cursor: pointer;">Close Window</button>
            </div>
          `;
      }

      console.error('LinkedIn Connection Error:', error);
      let userMessage = error.message || "Failed to connect LinkedIn. Please try again.";
      
      // Make error message very clear for the user
      if (userMessage.includes("time") || userMessage.includes("Time")) {
         userMessage = "Connection Timeout: The external system is busy. Please try again in a few moments.";
      }
      
      setMessage(`Error: ${userMessage}`);
      
      // Also scroll to top to show error
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsConnectingLinkedin(false);
      // If we are still "loading" from saveCurrentProgress, ensure it's off
      setLoading(false);
    }
  };

  const InputError = ({ name }: { name: string }) => errors[name] ? (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="h-3 w-3" /> {errors[name]}
    </p>
  ) : null;

  const inputClass = (name: string) => `border rounded-lg px-4 py-2.5 transition-all focus:ring-2 focus:ring-blue-500/20 outline-none ${errors[name] ? 'border-red-500 bg-red-50' : 'border-slate-200 focus:border-blue-500'}`;

  return (
    <div className="card p-8 md:p-10">
      <div className="mb-8">
        {/* Debug panel removed for production */}
      <h2 className="text-2xl font-bold text-slate-900 mb-2">You are 4 steps away from becoming an influencer in your market.</h2>
        <p className="text-slate-500">All fields are mandatory to complete your profile.</p>
      </div>

      <div className="flex items-center gap-3 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex-1">
            <div className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? "bg-blue-600" : "bg-slate-100"}`} />
            <p className={`text-[10px] font-bold uppercase mt-2 tracking-wider ${step >= s ? "text-blue-600" : "text-slate-400"}`}>
              Step 0{s}
            </p>
          </div>
        ))}
      </div>

      <div className="min-h-[300px]">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-2">I am a... (Select all that apply)</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { id: 'influencer', label: 'Influencer/ Creator', desc: 'I want to grow and monetize my audience through my content' },
                  { id: 'executive', label: 'Executive', desc: 'I work in the market and I want to become known' },
                  { id: 'investor', label: 'Investor', desc: 'Angel, VC, PE or professional investor' },
                  { id: 'advisor', label: 'Angel Advisor', desc: 'I want to advise startups/ small companies' },
                  { id: 'student', label: 'Student', desc: 'UnderGrad (first graduation) student in search to boost the professional image' },
                  { id: 'company', label: 'Brand/ Company', desc: 'I want to hire influencers for my brand' }
                ].map((role) => (
                  <div key={role.id} className={`relative flex flex-col p-3 border rounded-xl cursor-pointer transition-all ${data.user_types.includes(role.id) ? 'border-blue-500 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'}`}>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        checked={data.user_types.includes(role.id)}
                        onChange={(e) => {
                          const newTypes = e.target.checked
                            ? [...data.user_types, role.id]
                            : data.user_types.filter(t => t !== role.id);
                          update("user_types", newTypes);
                        }}
                      />
                      <div className="ml-3">
                        <span className="block text-sm font-bold text-slate-900">{role.label}</span>
                        <span className="block text-xs text-slate-500 mt-0.5">{role.desc}</span>
                      </div>
                    </label>

                    {role.id === 'influencer' && data.user_types.includes('influencer') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">What channels do you use/ create?</p>
                        {[
                          "Linkedin",
                          "Instagram",
                          "Facebook",
                          "Tiktok",
                          "Youtube",
                          "Others"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.influencer_channels?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.influencer_channels || [];
                                  if (checked) return { ...prev, influencer_channels: [...current, option] };
                                  return { ...prev, influencer_channels: current.filter(c => c !== option) };
                                });
                                if (errors.influencer_channels) setErrors(prev => { const n = { ...prev }; delete n.influencer_channels; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="influencer_channels" />
                      </div>
                    )}

                    {role.id === 'executive' && data.user_types.includes('executive') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">How many years of experience do you have?</p>
                        {[
                          "Less than 5 years of market experience",
                          "5 to 10 years of market experience",
                          "10 to 20 years of market experience",
                          "20+ years of market experience",
                          "I achieve a C-Level position"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.executive_experience?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.executive_experience || [];
                                  if (checked) return { ...prev, executive_experience: [...current, option] };
                                  return { ...prev, executive_experience: current.filter(c => c !== option) };
                                });
                                if (errors.executive_experience) setErrors(prev => { const n = { ...prev }; delete n.executive_experience; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="executive_experience" />
                      </div>
                    )}
                    
                    {role.id === 'advisor' && data.user_types.includes('advisor') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">Who do you want to advise?</p>
                        {[
                          "Ideas/ MVP’s Small Companies / Startups Early stage",
                          "Medium Companies/ Startups",
                          "Large Companies (Board Advisory)",
                          "Students/ Career Starters",
                          "Executives/ Experienced Professionals"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.advisor_sub_choices?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.advisor_sub_choices || [];
                                  if (checked) return { ...prev, advisor_sub_choices: [...current, option] };
                                  return { ...prev, advisor_sub_choices: current.filter(c => c !== option) };
                                });
                                if (errors.advisor_sub_choices) setErrors(prev => { const n = { ...prev }; delete n.advisor_sub_choices; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="advisor_sub_choices" />
                      </div>
                    )}

                    {role.id === 'student' && data.user_types.includes('student') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">What is your current education level?</p>
                        {[
                          "School (please note we do not accept under 18 creators or users)",
                          "College (Graduation)",
                          "College (Post Graduation)",
                          "College (Master or Minors)",
                          "College (PHD or more)"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.student_level?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.student_level || [];
                                  if (checked) return { ...prev, student_level: [...current, option] };
                                  return { ...prev, student_level: current.filter(c => c !== option) };
                                });
                                if (errors.student_level) setErrors(prev => { const n = { ...prev }; delete n.student_level; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="student_level" />
                      </div>
                    )}

                    {role.id === 'company' && data.user_types.includes('company') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">I am ...</p>
                        {[
                          "Startup Early Stage (less than 2 years)",
                          "Startup Medium size (2 to 4 years)",
                          "Company (large size - over 4 years)"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.company_type?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.company_type || [];
                                  if (checked) return { ...prev, company_type: [...current, option] };
                                  return { ...prev, company_type: current.filter(c => c !== option) };
                                });
                                if (errors.company_type) setErrors(prev => { const n = { ...prev }; delete n.company_type; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="company_type" />
                      </div>
                    )}

                    {role.id === 'investor' && data.user_types.includes('investor') && (
                      <div className="mt-3 ml-7 pt-3 border-t border-blue-200 space-y-2">
                        <p className="text-xs font-bold text-blue-900">What kind of investor are you?</p>
                        {[
                          "Angel Investor",
                          "Venture Capital Investor",
                          "Private Equity Investor",
                          "Family Office Investor",
                          "Investment Banker",
                          "Professional Investor (stock investment and funds)"
                        ].map((option) => (
                          <label key={option} className="flex items-start gap-2 cursor-pointer group">
                            <input 
                              type="checkbox"
                              className="mt-0.5 w-3.5 h-3.5 rounded border-blue-300 text-blue-600 focus:ring-blue-500"
                              checked={data.investor_type?.includes(option)}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                setData(prev => {
                                  const current = prev.investor_type || [];
                                  if (checked) return { ...prev, investor_type: [...current, option] };
                                  return { ...prev, investor_type: current.filter(c => c !== option) };
                                });
                                if (errors.investor_type) setErrors(prev => { const n = { ...prev }; delete n.investor_type; return n; });
                              }}
                            />
                            <span className="text-xs text-slate-700 group-hover:text-blue-800 transition-colors leading-tight">{option}</span>
                          </label>
                        ))}
                        <InputError name="investor_type" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500 mt-2">
                you can choose one or both, in either way you will need to onboard in the platform for security (no financial information or Linkedin password is required)
              </p>
              <InputError name="user_types" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input
                  className={inputClass("name")}
                  placeholder="Your complete name"
                  value={data.name}
                  onChange={(e) => update("name", e.target.value)}
                />
                <InputError name="name" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input
                  type="email"
                  className={inputClass("email")}
                  placeholder="name@company.com"
                  value={data.email}
                  onChange={(e) => update("email", e.target.value)}
                />
                <InputError name="email" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <input
                  type="password"
                  className={inputClass("password")}
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                />
                <InputError name="password" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  className={inputClass("confirmPassword")}
                  placeholder="Repeat your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                />
                <InputError name="confirmPassword" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">Country Code and Mobile Phone number (prefered if you have whatsapp on it)</label>
              <div className="flex gap-2">
                <div className="relative w-32">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">+</span>
                  <input
                    type="text"
                    className="border border-slate-200 rounded-lg pl-6 pr-3 py-2.5 transition-all focus:ring-2 focus:ring-blue-500/20 outline-none w-full focus:border-blue-500"
                    placeholder="55"
                    value={countryCode.replace("+", "")}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setCountryCode(`+${val}`);
                    }}
                  />
                </div>
                <input
                  type="tel"
                  className={inputClass("whatsapp") + " flex-1"}
                  placeholder="Number only (e.g. 11988887777)"
                  value={phonePart}
                  onChange={(e) => {
                    setPhonePart(e.target.value);
                    if (errors.whatsapp) setErrors(prev => { const n = { ...prev }; delete n.whatsapp; return n; });
                  }}
                />
              </div>
              <InputError name="whatsapp" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">City</label>
                <input className={inputClass("city")} placeholder="Current city" value={data.city}
                  onChange={(e) => update("city", e.target.value)} />
                <InputError name="city" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">State/Province</label>
                <input className={inputClass("state")} placeholder="State or Region" value={data.state}
                  onChange={(e) => update("state", e.target.value)} />
                <InputError name="state" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Country</label>
                <input className={inputClass("country")} placeholder="Full country name" value={data.country}
                  onChange={(e) => update("country", e.target.value)} />
                <InputError name="country" />
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">LinkedIn Profile URL</label>
                <input className={inputClass("linkedin_url")} placeholder="https://linkedin.com/in/username" value={data.linkedin_url}
                  onChange={(e) => update("linkedin_url", e.target.value)} />
                <InputError name="linkedin_url" />
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-slate-700 mb-1.5">Instagram Profile URL</label>
                <input className={inputClass("instagram_url")} placeholder="https://instagram.com/username" value={data.instagram_url}
                  onChange={(e) => update("instagram_url", e.target.value)} />
                <InputError name="instagram_url" />
              </div>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">What is your objective?</label>
              <textarea
                className={inputClass("objective") + " min-h-[80px]"}
                placeholder="Ex. Become an influencer in my market, get a new job, increase my network, improve my image in LinkedIn, get leads for sales, etc."
                value={data.objective}
                onChange={(e) => update("objective", e.target.value)}
              />
              <InputError name="objective" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">What is your market objective?</label>
              <textarea
                className={inputClass("market_objective") + " min-h-[80px]"}
                placeholder="Ex. Fintech, Health, Insurance, Payments, etc."
                value={data.market_objective}
                onChange={(e) => update("market_objective", e.target.value)}
              />
              <InputError name="market_objective" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">What is your location objective?</label>
              <input
                className={inputClass("location_objective")}
                placeholder="City, state and/or country"
                value={data.location_objective}
                onChange={(e) => update("location_objective", e.target.value)}
              />
              <InputError name="location_objective" />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">What is the average price do you want per content*? Note that this is not a fixated value, is just a reference.</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">$</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass("average_content_price") + " pl-8 w-full"}
                  value={data.average_content_price ?? ""}
                  onChange={(e) => update("average_content_price", e.target.value === "" ? undefined : Number(e.target.value))}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                * This will be the base for people/ companies to send you a proposition.
              </p>
              <InputError name="average_content_price" />
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-sm text-slate-600 leading-relaxed space-y-2">
              <p>
                We never post a campaign in your profile without your explicit and direct authorization and text approve over client's name, value, text, format, and time.
              </p>
              <p>
                All campaigns are incetivized via Cross-Engagement so, not only you get paid for it but also the content gets traction as well as your profile.
              </p>
              <p>
                The majority of the campaigns are more testimonial and validation. Rarely we have selling campaigns (but it doesn't matter because all campaigns involving your profile are strickly approved by you).
              </p>
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-semibold text-slate-700 mb-1.5">Write something about yourself (you can copy from your Linkedin Account)</label>
              <textarea
                className={inputClass("about_yourself") + " min-h-[120px]"}
                value={data.about_yourself}
                onChange={(e) => update("about_yourself", e.target.value)}
              />
              <InputError name="about_yourself" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
             <div className="space-y-4">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!isConnectingLinkedin) {
                      connectLinkedin();
                    }
                  }}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${connections.linkedin ? 'border-blue-600 bg-blue-50/30' : 'border-slate-200 hover:border-blue-300'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-blue-600 rounded-lg flex items-center justify-center text-white">
                            {isConnectingLinkedin ? <Loader2 className="h-5 w-5 animate-spin" /> : <Linkedin className="h-5 w-5" />}
                        </div>
                        <span className="font-bold text-slate-700">
                           {isConnectingLinkedin ? "Connecting..." : "Click to login your Linkedin"}
                        </span>
                    </div>
                    {connections.linkedin && <CheckCircle className="h-6 w-6 text-blue-600" />}
                </a>

                {showConfirmation && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-start gap-3 animate-in fade-in duration-300">
                        <input 
                          type="checkbox" 
                          id="confirm_linkedin"
                          checked={connections.linkedin}
                          onChange={(e) => setConnections(prev => ({ ...prev, linkedin: e.target.checked }))}
                          className="mt-1 w-5 h-5 rounded border-blue-400 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                        <label htmlFor="confirm_linkedin" className="text-sm text-blue-900 font-medium cursor-pointer leading-relaxed select-none">
                          I confirm that I have successfully logged in and authorized the connection in the new tab.
                        </label>
                    </div>
                )}

                {/* <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setConnections(prev => ({...prev, instagram: true}));
                  }}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${connections.instagram ? 'border-pink-600 bg-pink-50/30' : 'border-slate-200 hover:border-pink-300'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                            <Instagram className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-700">Click to login your Instagram</span>
                    </div>
                    {connections.instagram && <CheckCircle className="h-6 w-6 text-pink-600" />}
                </a> */}

                {/* <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setConnections(prev => ({...prev, whatsapp: true}));
                  }}
                  className={`w-full p-4 rounded-xl border-2 flex items-center justify-between transition-all ${connections.whatsapp ? 'border-green-600 bg-green-50/30' : 'border-slate-200 hover:border-green-300'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-green-500 rounded-lg flex items-center justify-center text-white">
                            <Phone className="h-5 w-5" />
                        </div>
                        <span className="font-bold text-slate-700">Click to login your Whatsapp</span>
                    </div>
                    {connections.whatsapp && <CheckCircle className="h-6 w-6 text-green-600" />}
                </a> */}
             </div>

             <div className="bg-slate-50 border border-slate-100 rounded-xl p-6 text-sm text-slate-600 leading-relaxed space-y-4">
                <div>
                    <strong className="block text-slate-900 mb-1">Security Note:</strong>
                    <p>Your privacy is our priority. That is why we never ask for your ID or password. You log in to LinkedIn directly through our secure log into our platform, ensuring your credentials remain private (and you are the only one with access to them). If you wish to disconnect your accounts, you can do so instantly via changing your password directly on Linkedin, your Profile Settings in the Platform, or simply reach out to our support team for assistance. As soon as you ask to unlog it is done.</p>
                </div>
                <div>
                    <strong className="block text-slate-900 mb-1">Note:</strong>
                    <p>Connecting your social accounts is a key step (and therefore, mandatory) to unlocking the full power of Influencer Circle / Viralmind. This allows our AI to craft personalized intelligence and execute strategic cross-engagement actions tailored to your profile. If you have any questions, we’re here to help! Message us here or via WhatsApp.</p>
                </div>
             </div>
             
             <div className="flex flex-col gap-1">
               <InputError name="linkedin_connection" />
               <InputError name="instagram_connection" />
               <InputError name="whatsapp_connection" />
             </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6 border-b border-slate-100 pb-8">
              <h3 className="text-lg font-bold text-slate-900">3 Simple questions before we go on</h3>
              
              {/* Question 1 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  1- Do you want to make your profile visible in the Influencer Circle Network?
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="is_visible" 
                      checked={data.is_visible === true}
                      onChange={() => update("is_visible", true)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">YES</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="is_visible" 
                      checked={data.is_visible === false}
                      onChange={() => update("is_visible", false)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-600">NO</span>
                  </label>
                </div>
              </div>

              {/* Question 2 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  2- Do you want to receive campaign propositions from our team?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="campaign_preference" 
                      checked={data.campaign_preference === "Yes, I want to receive campaign propositions for me to approve"}
                      onChange={() => update("campaign_preference", "Yes, I want to receive campaign propositions for me to approve")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-slate-600">Yes, I want to receive campaign propositions for me to approve</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="campaign_preference" 
                      checked={data.campaign_preference === "No, I just want to participate on the Cross- Engagement App (ViralMind App)"}
                      onChange={() => update("campaign_preference", "No, I just want to participate on the Cross- Engagement App (ViralMind App)")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-slate-600">No, I just want to participate on the Cross- Engagement App (ViralMind App)</span>
                  </label>
                </div>
              </div>

              {/* Question 3 */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">
                  3- Do you want to donate in a Social Cause?
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="social_cause_preference" 
                      checked={data.social_cause_preference === "Yes, I want to donate to a Social Cause"}
                      onChange={() => update("social_cause_preference", "Yes, I want to donate to a Social Cause")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-slate-600">Yes, I want to donate to a Social Cause</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="social_cause_preference" 
                      checked={data.social_cause_preference === "No, I don't want to donate"}
                      onChange={() => update("social_cause_preference", "No, I don't want to donate")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-slate-600">No, I don't want to donate</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="social_cause_preference" 
                      checked={data.social_cause_preference === "No, I am already a part of PUC angels (it will be checked)."}
                      onChange={() => update("social_cause_preference", "No, I am already a part of PUC angels (it will be checked).")}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500 mt-0.5"
                    />
                    <span className="text-sm text-slate-600">No, I am already a part of PUC angels (it will be checked).</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <button type="button" onClick={() => setPlan("member")}
                className={`relative card p-6 text-left border-2 transition-all ${plan === "member" ? "border-blue-600 bg-blue-50/30" : "border-slate-100"}`}>
                {plan === "member" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-blue-600" />}
                <h4 className="font-bold text-slate-900 text-lg">Member Plan</h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">Boost your organic reach with <strong className="text-slate-700">25 engagements per post</strong>, 1 post every working day.</p>
              </button>

              <button type="button" onClick={() => setPlan("elite")}
                className={`relative card p-6 text-left border-2 transition-all ${plan === "elite" ? "border-blue-600 bg-blue-50/30" : "border-slate-100"}`}>
                {plan === "elite" && <CheckCircle className="absolute top-4 right-4 h-5 w-5 text-blue-600" />}
                <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">Elite Tier <CreditCard className="h-4 w-4 text-blue-600 text-sm" /></h4>
                <p className="text-sm text-slate-500 mt-2 leading-relaxed">Full acceleration: 50 engagements per post, 1 post every working day, {/* comments, saves, */} and personal WhatsApp Manager.</p>
              </button>
            </div>

            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <label className="text-sm font-semibold text-slate-700 mb-2 block">Choose your target market region</label>
                <select className={inputClass("region") + " w-full"} value={region}
                  onChange={(e) => {
                    setRegion(e.target.value);
                    if (errors.region) setErrors(prev => { const n = { ...prev }; delete n.region; return n; });
                  }}>
                  <option value="" disabled>Select your primary region</option>
                  <option value="usa">USA</option>
                  <option value="puc-angels">PUC angels (Brazil)</option>
                  <option value="brazil">Brazil</option>
                  <option value="argentina">Argentina</option>
                  <option value="chile">Chile</option>
                  <option value="colombia">Colombia</option>
                  <option value="mexico">Mexico</option>
                  <option value="europe">Europe</option>
                  <option value="australia">Australia</option>
                  <option value="india">India</option>
                  <option value="latin-america">Latin America</option>
                  <option value="rest-of-asia">Rest of Asia</option>
                  <option value="other">Other</option>
                </select>
                <InputError name="region" />
              </div>

            {plan === "elite" && (
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">Elite Plan Benefits</h4>
                <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                  <li>Priority support via WhatsApp</li>
                  <li>Advanced analytics and reporting</li>
                  <li>Dedicated account manager</li>
                </ul>
              </div>
            )}

            <div className="flex flex-col gap-4">
              <label className={`flex items-start gap-3 p-4 rounded-xl border transition-all cursor-pointer ${data.disclaimer_accepted ? 'border-blue-200 bg-blue-50/20' : 'border-slate-100'}`}>
                <input type="checkbox" className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  checked={!!data.disclaimer_accepted}
                  onChange={(e) => update("disclaimer_accepted", e.target.checked)} />
                <span className="text-sm text-slate-600 leading-snug">
                  I authorize contact via WhatsApp/Email by Influencer Circle, ViralMind, EngageViral and HackNeuro’s group for operational and strategic updates.
                </span>
              </label>
              <InputError name="disclaimerStatus" />
            </div>

            <div className="pt-4">
              <button disabled={loading} onClick={handleSubmit} className="btn btn-primary w-full py-4 text-lg">
                Complete Onboarding
                {loading ? <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              </button>
              {message && (
                <p className="mt-4 text-center text-sm font-medium text-red-600 bg-red-50 p-3 rounded-lg flex items-center justify-center gap-2">
                  <AlertCircle className="h-4 w-4" /> {message}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
        <button onClick={prev} className="btn btn-outline min-w-[120px]" disabled={step === 1 || loading}>Back</button>
        {step < 4 && (
          <button onClick={next} disabled={loading} className="btn btn-primary min-w-[120px] flex items-center justify-center gap-2">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Continue"}
          </button>
        )}
      </div>

      {isVerifying && (
        <div className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full border border-slate-100 text-center relative overflow-hidden">
             <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
             
             <div className="mx-auto w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 shadow-sm ring-4 ring-blue-50/50">
                <Mail className="h-10 w-10 text-blue-600" />
             </div>
             
             <h3 className="text-2xl font-bold text-slate-900 mb-3">Verifique seu e-mail</h3>
             <p className="text-slate-600 mb-8 leading-relaxed">
               Enviamos um link de confirmação para <br/><strong className="text-slate-900 font-medium">{data.email}</strong>.
               <br />
               Clique no link para continuar o cadastro.
             </p>
             
             <div className="flex flex-col gap-4">
               <div className="flex items-center justify-center gap-2 text-sm font-medium text-slate-600 bg-slate-50 py-3 rounded-xl border border-slate-100">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                  Aguardando confirmação...
               </div>
               
               <p className="text-xs text-slate-400">
                 Esta tela avançará automaticamente assim que você confirmar.
               </p>
             </div>
          </div>
        </div>
      )}

      {showVideo && (
        <div className="fixed inset-0 bg-slate-900/95 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-black rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col">
              <div className="p-4 flex items-center justify-between bg-slate-800 text-white border-b border-slate-700">
                 <h3 className="font-bold flex items-center gap-2">
                    {videoEnded ? <CheckCircle className="text-green-500" /> : <Loader2 className="animate-spin text-blue-400" />}
                    {videoEnded ? "Connection Ready!" : "Setting up remote environment..."}
                 </h3>
                 {!videoEnded && <span className="text-xs text-slate-400 bg-slate-900 px-2 py-1 rounded">Please wait...</span>}
              </div>
              
              <div className="relative aspect-video bg-black">
                 {/* YouTube Embed via API */}
                 <div id="youtube-player" className="absolute inset-0 w-full h-full"></div>
              </div>

              <div className="p-6 bg-slate-800 border-t border-slate-700 flex justify-end">
                 {videoEnded ? (
                   <button 
                     onClick={() => {
                        if (generatedLink) {
                           window.open(generatedLink, '_blank');
                           setShowConfirmation(true);
                           setShowVideo(false);
                           setVideoEnded(false);
                           setGeneratedLink(null);
                        }
                     }}
                     className="btn btn-primary bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg flex items-center gap-2 shadow-lg shadow-green-900/20 animate-bounce"
                   >
                      Access Secure Connection <ArrowRight className="h-5 w-5" />
                   </button>
                 ) : (
                   <button disabled className="btn bg-slate-700 text-slate-400 cursor-not-allowed px-8 py-3 flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" /> Preparing Link...
                   </button>
                 )}
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
