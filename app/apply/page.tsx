
"use client";

import { useState, useRef } from "react";
import { useLanguage } from "@/components/marketing/LanguageContext";
import { supabase } from "@/lib/supabaseClient";
import { Upload, X, Check, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function ApplyPage() {
  const { t } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    email: "",
    confirmEmail: "",
    mobile: "",
    linkedin: "",
    objective: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("File is too large. Max 5MB.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (formData.email !== formData.confirmEmail) {
      toast.error("Emails do not match.");
      setLoading(false);
      return;
    }

    if (!file) {
      toast.error("Please upload your CV.");
      setLoading(false);
      return;
    }

    try {
      // 1. Upload CV (Using server-side Signed URL to bypass RLS)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.firstName}_${formData.lastName}.${fileExt}`;
      
      // Get Signed URL
      const uploadUrlRes = await fetch('/api/application/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, fileType: file.type })
      });
      
      if (!uploadUrlRes.ok) {
        const error = await uploadUrlRes.json();
        throw new Error(`Failed to get upload URL: ${error.error}`);
      }
      
      const { signedUrl, path, publicUrl } = await uploadUrlRes.json();

      // Upload file to Signed URL
      const uploadRes = await fetch(signedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      });

      if (!uploadRes.ok) {
        console.error('CV Upload Error Status:', uploadRes.status);
        throw new Error('CV Upload failed: Could not upload to storage');
      }

      // 2. Insert Application (Using server-side API to bypass RLS)
      const submitRes = await fetch('/api/application/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          role: formData.role,
          email: formData.email,
          mobile: formData.mobile,
          linkedin: formData.linkedin,
          objective: formData.objective,
          cvUrl: publicUrl
        })
      });

      if (!submitRes.ok) {
        const error = await submitRes.json();
        throw new Error(`Application submission failed: ${error.error}`);
      }

      setShowSuccess(true);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2000&auto=format&fit=crop"
          alt="Conference background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-[2px]" />
      </div>

      <div className="max-w-2xl w-full space-y-8 relative z-10">
        {/* Main Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-8 md:p-10 rounded-2xl shadow-[0_0_40px_rgba(59,130,246,0.15)] border border-blue-500/30 ring-1 ring-white/10">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
              {t('apply.title')}
            </h1>
            <p className="text-slate-400 text-lg">
              {t('apply.subtitle')}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  {t('apply.form.firstName')} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  {t('apply.form.lastName')} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">
                {t('apply.form.role')} <span className="text-blue-400">*</span>
              </label>
              <div className="relative">
                <select
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 appearance-none"
                >
                  <option value="" className="bg-slate-900 text-slate-400">Select...</option>
                  <option value="Influencer" className="bg-slate-900">{t('apply.form.roles.influencer')}</option>
                  <option value="Executive" className="bg-slate-900">{t('apply.form.roles.executive')}</option>
                  <option value="Student" className="bg-slate-900">{t('apply.form.roles.student')}</option>
                  <option value="Beginner" className="bg-slate-900">{t('apply.form.roles.beginner')}</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  {t('apply.form.email')} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 ml-1">
                  {t('apply.form.confirmEmail')} <span className="text-blue-400">*</span>
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">
                {t('apply.form.mobile')} <span className="text-blue-400">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="+55 11 99999-9999"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">
                {t('apply.form.linkedin')} <span className="text-blue-400">*</span>
              </label>
              <input
                type="url"
                name="linkedin"
                required
                placeholder="https://linkedin.com/in/yourname"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">
                {t('apply.form.objective')} <span className="text-blue-400">*</span>
              </label>
              <textarea
                name="objective"
                required
                rows={4}
                value={formData.objective}
                onChange={handleChange}
                className="w-full px-4 py-3.5 rounded-xl bg-slate-950/50 border border-slate-700 text-white placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all duration-200 resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">
                {t('apply.form.cv')} <span className="text-blue-400">*</span>
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 group ${
                  file 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-slate-700 hover:border-blue-500 hover:bg-slate-800/50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-3">
                  {file ? (
                    <>
                      <div className="p-3 bg-blue-500/20 rounded-full">
                        <Check className="h-6 w-6 text-blue-400" />
                      </div>
                      <span className="text-blue-400 font-medium">{file.name}</span>
                      <span className="text-xs text-blue-300/70">{t('apply.form.fileSelected')}</span>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-slate-800 rounded-full group-hover:bg-blue-500/20 transition-colors">
                        <Upload className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                      </div>
                      <span className="text-slate-300 font-medium group-hover:text-white transition-colors">{t('apply.form.filePlaceholder')}</span>
                      <span className="text-xs text-slate-500 group-hover:text-slate-400">PDF, DOCX (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] border border-blue-400/20 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {t('apply.form.submit')}
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-in zoom-in-95 duration-200">
            <div className="absolute top-4 right-4">
              <button onClick={() => window.location.href = "https://www.influencercircle.net/app"} className="text-slate-400 hover:text-slate-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-900">
                {t('apply.success.title')}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {t('apply.success.message')}
              </p>
              
              <button
                onClick={() => window.location.href = "https://www.influencercircle.net/app"}
                className="w-full mt-4 bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition-colors"
              >
                {t('apply.success.close')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
