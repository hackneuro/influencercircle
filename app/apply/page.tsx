
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
      // 1. Upload CV
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${formData.firstName}_${formData.lastName}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('cvs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('cvs')
        .getPublicUrl(fileName);

      // 2. Insert Application
      const { error: insertError } = await supabase
        .from('applications')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          role: formData.role,
          email: formData.email,
          mobile: formData.mobile,
          linkedin_url: formData.linkedin,
          objective: formData.objective,
          cv_url: publicUrl,
          status: 'pending'
        });

      if (insertError) throw insertError;

      setShowSuccess(true);
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast.error(error.message || "Failed to submit application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1544531586-fde5298cdd40?q=80&w=2000&auto=format&fit=crop"
          alt="Conference background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="max-w-md w-full space-y-8 relative z-10 bg-white/95 backdrop-blur-sm p-8 rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {t('apply.title')}
          </h1>
          <p className="text-slate-600">
            {t('apply.subtitle')}
          </p>
        </div>
        {/* Wrapper to maintain nesting structure for existing closing tags */}
        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t('apply.form.firstName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  required
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t('apply.form.lastName')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  required
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t('apply.form.role')} <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
              >
                <option value="">Select...</option>
                <option value="Influencer">{t('apply.form.roles.influencer')}</option>
                <option value="Executive">{t('apply.form.roles.executive')}</option>
                <option value="Student">{t('apply.form.roles.student')}</option>
                <option value="Beginner">{t('apply.form.roles.beginner')}</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t('apply.form.email')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">
                  {t('apply.form.confirmEmail')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="confirmEmail"
                  required
                  value={formData.confirmEmail}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t('apply.form.mobile')} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="mobile"
                required
                placeholder="+55 11 99999-9999"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t('apply.form.linkedin')} <span className="text-red-500">*</span>
              </label>
              <input
                type="url"
                name="linkedin"
                required
                placeholder="https://linkedin.com/in/yourname"
                value={formData.linkedin}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t('apply.form.objective')} <span className="text-red-500">*</span>
              </label>
              <textarea
                name="objective"
                required
                rows={4}
                value={formData.objective}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">
                {t('apply.form.cv')} <span className="text-red-500">*</span>
              </label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${file ? 'border-green-500 bg-green-50' : 'border-slate-300 hover:border-blue-500 hover:bg-slate-50'}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <div className="flex flex-col items-center gap-2">
                  {file ? (
                    <>
                      <Check className="h-8 w-8 text-green-500" />
                      <span className="text-green-700 font-medium">{file.name}</span>
                      <span className="text-xs text-green-600">{t('apply.form.fileSelected')}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 text-slate-400" />
                      <span className="text-slate-600">{t('apply.form.filePlaceholder')}</span>
                      <span className="text-xs text-slate-400">PDF, DOCX (Max 5MB)</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    {t('apply.form.submit')}
                    <ArrowRight className="h-5 w-5" />
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
