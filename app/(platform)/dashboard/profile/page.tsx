"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getMyProfile, upsertProfileFromOnboarding } from "@/services/profileService";
import type { ProfileRow } from "@/types/database";
import { Loader2, Save, User, MapPin, Link as LinkIcon, Target, Camera, Upload, FileText, Trash2, Eye, Lock, Globe, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/marketing/LanguageContext";

export default function ProfileControlPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error", text: string } | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    whatsapp: "",
    how_seen: "executive",
    city: "",
    state: "",
    country: "",
    region: "",
    about_yourself: "",
    linkedin_url: "",
    instagram_url: "",
    average_content_price: 0,
    objective: "",
    market_objective: "",
    location_objective: "",
    is_public: true,
    show_email: false,
    show_phone: false,
    image: "",
    resume_url: ""
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getMyProfile();
      if (data) {
        const roleOptions = ["executive", "influencer", "student", "beginner"];
        const howSeen = (data.user_types || []).find((v) => roleOptions.includes(v)) || "executive";
        setProfile(data);
        setFormData({
          name: data.name || "",
          username: data.username || "",
          whatsapp: data.whatsapp || "",
          how_seen: howSeen,
          city: data.city || "",
          state: data.state || "",
          country: data.country || "",
          region: data.region || "",
          about_yourself: data.about_yourself || data.bio || "",
          linkedin_url: data.linkedin_url || "",
          instagram_url: data.instagram_url || "",
          average_content_price: data.average_content_price || 0,
          objective: data.objective || "",
          market_objective: data.market_objective || "",
          location_objective: data.location_objective || "",
          is_public: data.is_public ?? true,
          show_email: data.show_email ?? false,
          show_phone: data.show_phone ?? false,
          image: data.image || "",
          resume_url: data.resume_url || ""
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
      setMessage({ type: "error", text: t("dashboard.profile.messages.loadFailed") });
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === "checkbox") {
        const checked = (e.target as HTMLInputElement).checked;
        setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (name === "average_content_price") {
        setFormData(prev => ({ ...prev, [name]: value === "" ? 0 : Number(value) }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      setUploadingImage(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, image: data.publicUrl }));
      setMessage({ type: "success", text: t("dashboard.profile.messages.imageUploaded") });
    } catch (error: any) {
      console.error("Error uploading image:", error);
      setMessage({ type: "error", text: error.message || t("dashboard.profile.messages.imageUploadFailed") });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }
      setUploadingResume(true);
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
      
      setFormData(prev => ({ ...prev, resume_url: data.publicUrl }));
      setMessage({ type: "success", text: t("dashboard.profile.messages.resumeUploaded") });
    } catch (error: any) {
      console.error("Error uploading resume:", error);
      setMessage({ type: "error", text: error.message || t("dashboard.profile.messages.resumeUploadFailed") });
    } finally {
      setUploadingResume(false);
    }
  };

  const handlePasswordUpdate = async () => {
    if (!newPassword || newPassword.length < 6) {
      setMessage({ type: "error", text: t("dashboard.profile.messages.passwordTooShort") });
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setMessage({ type: "error", text: t("dashboard.profile.messages.passwordsDontMatch") });
      return;
    }

    setSavingPassword(true);
    setMessage(null);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
        data: { force_password_change: false }
      });
      if (error) throw error;
      setNewPassword("");
      setConfirmNewPassword("");
      setMessage({ type: "success", text: t("dashboard.profile.messages.passwordUpdated") });
      window.scrollTo(0, 0);
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || t("dashboard.profile.messages.passwordUpdateFailed") });
    } finally {
      setSavingPassword(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      if (!profile) return;

      const roleOptions = ["executive", "influencer", "student", "beginner"];
      const baseUserTypes = (profile.user_types ?? []).filter((v) => !roleOptions.includes(v));
      const userTypes = [...baseUserTypes, formData.how_seen];
      const systemRole =
        profile.role === "admin"
          ? "admin"
          : formData.how_seen === "influencer"
            ? "influencer"
            : "user";

      await upsertProfileFromOnboarding({
        ...formData,
        email: profile.email,
        plan: profile.plan,
        role: systemRole,
        advisor_sub_choices: profile.advisor_sub_choices ?? [],
        influencer_channels: profile.influencer_channels ?? [],
        student_level: profile.student_level ?? [],
        company_type: profile.company_type ?? [],
        investor_type: profile.investor_type ?? [],
        executive_experience: profile.executive_experience ?? [],
        user_types: userTypes,
        is_visible: formData.is_public,
        show_email: formData.show_email,
        show_phone: formData.show_phone,
        campaign_preference: profile.campaign_preference ?? undefined,
        social_cause_preference: profile.social_cause_preference ?? undefined,
        disclaimer_accepted: profile.disclaimer_accepted,
        image: formData.image,
        resume_url: formData.resume_url
      });

      setMessage({ type: "success", text: t("dashboard.profile.messages.profileUpdated") });
      window.scrollTo(0, 0);
      loadProfile();
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      setMessage({ type: "error", text: error.message || t("dashboard.profile.messages.profileUpdateFailed") });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{t("dashboard.profile.title")}</h1>
          <p className="text-slate-500 mt-1">{t("dashboard.profile.subtitle")}</p>
        </div>
        {profile?.username && (
          <Link 
            href={`/${profile.username}`} 
            target="_blank"
            className="btn btn-outline flex items-center gap-2 group"
          >
            <Eye className="h-4 w-4 group-hover:text-blue-600 transition-colors" />
            {t("dashboard.profile.viewPublicProfile")}
          </Link>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl flex items-center gap-3 shadow-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
          {message.type === 'success' ? <CheckCircle className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
          <p className="font-medium">{message.text}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column - Image & Resume & Basic */}
        <div className="space-y-8 lg:col-span-1">
          {/* Profile Image */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-4">
            <h2 className="text-lg font-bold text-slate-800 w-full flex items-center gap-2 pb-2 border-b border-slate-100">
              <Camera className="h-5 w-5 text-blue-500" />
              {t("dashboard.profile.photo.title")}
            </h2>
            
            <div className="relative group">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-slate-50 shadow-inner bg-slate-100">
                {formData.image ? (
                  <img src={formData.image} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <img 
                    src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop" 
                    alt="Default" 
                    className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all"
                  />
                )}
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                disabled={uploadingImage}
              >
                {uploadingImage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              </button>
            </div>
            
            <div className="text-xs text-slate-500">
              <p>{t("dashboard.profile.photo.recommended")}</p>
              <p>{t("dashboard.profile.photo.marketNote")}</p>
            </div>
            <input 
              type="file" 
              ref={imageInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleImageUpload}
            />
          </section>

          {/* Resume / CV */}
          <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-100">
              <FileText className="h-5 w-5 text-orange-500" />
              {t("dashboard.profile.resume.title")}
            </h2>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/50">
               {formData.resume_url ? (
                 <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm">
                       <FileText className="h-6 w-6 text-slate-600" />
                     </div>
                     <div className="text-left">
                        <p className="text-sm font-semibold text-slate-900">{t("dashboard.profile.resume.uploaded")}</p>
                        <a href={formData.resume_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 hover:underline">{t("dashboard.profile.resume.viewCurrent")}</a>
                     </div>
                   </div>
                   <button 
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, resume_url: "" }))}
                    className="text-slate-400 hover:text-red-500 transition-colors"
                   >
                     <Trash2 className="h-4 w-4" />
                   </button>
                 </div>
               ) : (
                 <div className="text-center py-4 text-slate-500 text-sm">
                  <p>{t("dashboard.profile.resume.none")}</p>
                 </div>
               )}
            </div>

            <button
              type="button"
              onClick={() => resumeInputRef.current?.click()}
              className="btn btn-outline w-full flex items-center justify-center gap-2"
              disabled={uploadingResume}
            >
              {uploadingResume ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              {formData.resume_url ? t("dashboard.profile.resume.replace") : t("dashboard.profile.resume.upload")}
            </button>
            <input 
              type="file" 
              ref={resumeInputRef} 
              className="hidden" 
              accept=".pdf,.doc,.docx" 
              onChange={handleResumeUpload}
            />
          </section>
        </div>

        {/* Right Column - Details */}
        <div className="lg:col-span-2 space-y-8">
           {/* Basic Information */}
           <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <User className="h-6 w-6 text-blue-600" />
              {t("dashboard.profile.basic.title")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.basic.fullName")}</label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.basic.username")}</label>
                <div className="flex items-center">
                  <span className="bg-slate-100 border border-r-0 border-slate-200 text-slate-500 px-3 py-3 rounded-l-xl text-sm">@</span>
                  <input
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="input w-full rounded-l-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                    required
                    pattern="^[a-zA-Z0-9_-]+$"
                    title={t("dashboard.profile.basic.usernameHelp")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.basic.whatsapp")}</label>
                <input
                  name="whatsapp"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                  placeholder="+55 11 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.basic.howSeen")}</label>
                <select
                  name="how_seen"
                  value={formData.how_seen}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200"
                >
                  <option value="executive">{t("apply.form.roles.executive")}</option>
                  <option value="influencer">{t("apply.form.roles.influencer")}</option>
                  <option value="student">{t("apply.form.roles.student")}</option>
                  <option value="beginner">{t("apply.form.roles.beginner")}</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.basic.about")}</label>
              <textarea
                name="about_yourself"
                value={formData.about_yourself}
                onChange={handleChange}
                className="textarea w-full h-32 bg-slate-50 border-slate-200 focus:bg-white transition-colors text-base"
                placeholder={t("dashboard.profile.basic.aboutPlaceholder")}
              />
            </div>
          </section>

          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Lock className="h-6 w-6 text-purple-600" />
              {t("dashboard.profile.privacy.title")}
            </h2>

            {/* Profile Visibility */}
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     <Globe className="h-4 w-4 text-blue-500" />
                     {t("dashboard.profile.privacy.publicVisibilityTitle")}
                  </h3>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {t("dashboard.profile.privacy.publicVisibilityDesc")}
                  </p>
                </div>
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={(e) => setFormData({...formData, is_public: e.target.checked})}
                  className="toggle toggle-primary shrink-0"
                />
              </div>
            </div>

            {/* Contact Info Privacy */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">{t("dashboard.profile.privacy.contactTitle")}</h3>
              
              {/* Email */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                 <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <Mail className="h-4 w-4 text-slate-500" />
                     <span className="font-semibold text-slate-900">{t("dashboard.profile.privacy.emailLabel")}</span>
                   </div>
                   <p className="text-xs text-slate-500">{t("dashboard.profile.privacy.emailHint", { email: profile?.email || "" })}</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                      type="checkbox" 
                      name="show_email" 
                      checked={formData.show_email} 
                      onChange={(e) => setFormData({...formData, show_email: e.target.checked})} 
                      className="sr-only peer" 
                   />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors">
                 <div className="space-y-1">
                   <div className="flex items-center gap-2">
                     <Phone className="h-4 w-4 text-slate-500" />
                     <span className="font-semibold text-slate-900">{t("dashboard.profile.privacy.phoneLabel")}</span>
                   </div>
                   <p className="text-xs text-slate-500">{t("dashboard.profile.privacy.phoneHint")}</p>
                 </div>
                 <label className="relative inline-flex items-center cursor-pointer">
                   <input 
                      type="checkbox" 
                      name="show_phone" 
                      checked={formData.show_phone} 
                      onChange={(e) => setFormData({...formData, show_phone: e.target.checked})} 
                      className="sr-only peer" 
                   />
                   <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                 </label>
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <MapPin className="h-6 w-6 text-green-600" />
              {t("dashboard.profile.location.title")}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.location.city")}</label>
                <input
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.location.state")}</label>
                <input
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.location.country")}</label>
                <input
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.location.region")}</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="input w-full bg-slate-50 border-slate-200"
                >
                  <option value="">{t("dashboard.profile.location.regionSelect")}</option>
                  <option value="Americas">{t("dashboard.profile.location.regionOptions.americas")}</option>
                  <option value="Europe">{t("dashboard.profile.location.regionOptions.europe")}</option>
                  <option value="Asia">{t("dashboard.profile.location.regionOptions.asia")}</option>
                  <option value="Africa">{t("dashboard.profile.location.regionOptions.africa")}</option>
                  <option value="Oceania">{t("dashboard.profile.location.regionOptions.oceania")}</option>
                </select>
              </div>
            </div>
          </section>

          {/* Social & Objectives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <LinkIcon className="h-5 w-5 text-purple-600" />
                {t("dashboard.profile.social.title")}
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.social.linkedin")}</label>
                  <input
                    name="linkedin_url"
                    value={formData.linkedin_url}
                    onChange={handleChange}
                    className="input w-full bg-slate-50 border-slate-200"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.social.instagram")}</label>
                  <input
                    name="instagram_url"
                    value={formData.instagram_url}
                    onChange={handleChange}
                    className="input w-full bg-slate-50 border-slate-200"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.social.contentPrice")}</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                    <input
                      name="average_content_price"
                      value={formData.average_content_price}
                      onChange={handleChange}
                      className="input w-full pl-8 bg-slate-50 border-slate-200"
                      type="number"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
                <Target className="h-5 w-5 text-red-600" />
                {t("dashboard.profile.objectives.title")}
              </h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.objectives.primaryGoal")}</label>
                  <select
                    name="objective"
                    value={formData.objective}
                    onChange={handleChange}
                    className="input w-full bg-slate-50 border-slate-200"
                  >
                    <option value="">{t("dashboard.profile.objectives.selectObjective")}</option>
                    <option value="Grow Audience">{t("dashboard.profile.objectives.options.growAudience")}</option>
                    <option value="Monetize Content">{t("dashboard.profile.objectives.options.monetizeContent")}</option>
                    <option value="Networking">{t("dashboard.profile.objectives.options.networking")}</option>
                    <option value="Find Jobs">{t("dashboard.profile.objectives.options.findJobs")}</option>
                    <option value="Find Talent">{t("dashboard.profile.objectives.options.findTalent")}</option>
                    <option value="Brand Awareness">{t("dashboard.profile.objectives.options.brandAwareness")}</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.objectives.targetMarket")}</label>
                  <select
                    name="market_objective"
                    value={formData.market_objective}
                    onChange={handleChange}
                    className="input w-full bg-slate-50 border-slate-200"
                  >
                     <option value="">{t("dashboard.profile.objectives.selectMarket")}</option>
                     <option value="Technology">{t("dashboard.profile.objectives.marketOptions.technology")}</option>
                     <option value="Finance">{t("dashboard.profile.objectives.marketOptions.finance")}</option>
                     <option value="Health">{t("dashboard.profile.objectives.marketOptions.health")}</option>
                     <option value="Education">{t("dashboard.profile.objectives.marketOptions.education")}</option>
                     <option value="Entertainment">{t("dashboard.profile.objectives.marketOptions.entertainment")}</option>
                     <option value="Retail">{t("dashboard.profile.objectives.marketOptions.retail")}</option>
                     <option value="Other">{t("dashboard.profile.objectives.marketOptions.other")}</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.objectives.targetLocation")}</label>
                  <select
                    name="location_objective"
                    value={formData.location_objective}
                    onChange={handleChange}
                    className="input w-full bg-slate-50 border-slate-200"
                  >
                     <option value="">{t("dashboard.profile.objectives.selectLocation")}</option>
                     <option value="Global">{t("dashboard.profile.objectives.locationOptions.global")}</option>
                     <option value="North America">{t("dashboard.profile.objectives.locationOptions.northAmerica")}</option>
                     <option value="South America">{t("dashboard.profile.objectives.locationOptions.southAmerica")}</option>
                     <option value="Europe">{t("dashboard.profile.objectives.locationOptions.europe")}</option>
                     <option value="Asia">{t("dashboard.profile.objectives.locationOptions.asia")}</option>
                     <option value="Local">{t("dashboard.profile.objectives.locationOptions.local")}</option>
                  </select>
                </div>
              </div>
            </section>
          </div>

          <section id="password" className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
            <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Lock className="h-5 w-5 text-slate-700" />
              {t("dashboard.profile.password.title")}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.password.new")}</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input w-full bg-slate-50 border-slate-200"
                  minLength={6}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">{t("dashboard.profile.password.confirm")}</label>
                <input
                  type="password"
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  className="input w-full bg-slate-50 border-slate-200"
                  minLength={6}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handlePasswordUpdate}
                disabled={savingPassword}
                className="btn btn-outline flex items-center gap-2 px-6 py-3 rounded-xl"
              >
                {savingPassword ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t("dashboard.profile.password.updating")}
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5" />
                    {t("dashboard.profile.password.update")}
                  </>
                )}
              </button>
            </div>
          </section>
          
          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary flex items-center gap-2 px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
            >
              {saving ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t("dashboard.profile.save.saving")}
                </>
              ) : (
                <>
                  <Save className="h-5 w-5" />
                  {t("dashboard.profile.save.save")}
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  )
}

function AlertCircle({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  )
}
