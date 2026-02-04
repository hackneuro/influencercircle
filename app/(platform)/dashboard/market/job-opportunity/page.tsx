"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, MapPin, Briefcase, DollarSign, Calendar } from 'lucide-react';

export default function JobOpportunityPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        whatAreYou: "",
        jobTitle: "",
        functionDescription: "",
        employmentType: "",
        experienceLevel: "",
        workType: "",
        desiredProfile: "",
        location: "",
        locationType: "",
        language: "",
        budget: "",
        duration: "",
        compensation: [] as string[]
    });

    const handleCompensationChange = (value: string) => {
        setFormData(prev => {
            if (prev.compensation.includes(value)) {
                return { ...prev, compensation: prev.compensation.filter(c => c !== value) };
            } else {
                return { ...prev, compensation: [...prev.compensation, value] };
            }
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        setShowSuccessModal(true);
    };

    const handleSuccessModalClose = () => {
        setShowSuccessModal(false);
        router.push('/dashboard/market');
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 pb-12 relative">
            {showSuccessModal && (
                <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-200">
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">Application Received</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Thank you for submiting this opportunity. Our team will evaluate the information and get back to you in 3 business days. Please check your email for our communication.
                            </p>
                            <button
                                onClick={handleSuccessModalClose}
                                className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors mt-4"
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <Link href="/dashboard/market" className="inline-flex items-center text-slate-500 hover:text-blue-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Market
            </Link>

            {step === 1 ? (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3 text-amber-600">
                            <AlertCircle className="w-6 h-6" />
                            <h1 className="text-xl font-bold uppercase tracking-wide">IMPORTANT — PLEASE READ CAREFULLY</h1>
                        </div>
                        
                        <p className="text-slate-600 leading-relaxed">
                            By completing this form, you are expressing a formal interest in a professional work (whether pro-bono, paid, equity-based, or performance-based). Our team will curate your request and match you with the most suitable Executive/ Experience Professional or student based on the information provided.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Response Deadline</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Once you receive your mentorship confirmation email, you have <span className="font-semibold text-slate-900">3 (three) business days</span> to respond. If we do not hear from you within this timeframe, the opportunity will be discarted. The next opportunity you submit will be required a down payment for further commitment.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Negotiations, Contracts, and Guidelines</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Influencer Circle facilitates direct negotiations and provides the infrastructure for parties to message and support each other throughout the process (please note: we do not intervene in the final working relationship).
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Changing Professionals</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To request a different professional, a new formal application must be submitted.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Hiring Format</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The structure of the engagement is to be negotiated directly between both parties via direct messaging.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            I Understand, Continue
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Professional Hiring Application Form</h1>
                        <p className="text-slate-500">Please fill out the details below to find your perfect advisor match.</p>
                    </div>

                    {/* What are you? */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">What are you?</h3>
                        <div className="space-y-3">
                            {["Physical Person that wants to hire a service", "Startup Early Stage", "Medium Company/ Startup", "Large Company (Corporation)"].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="whatAreYou" 
                                        value={option}
                                        checked={formData.whatAreYou === option}
                                        onChange={(e) => setFormData({...formData, whatAreYou: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Job Title */}
                    <div className="space-y-3">
                        <label className="font-medium text-slate-700">Job Title</label>
                        <input 
                            type="text" 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                            placeholder="eg. Media Manager or Financial Director or Marketing Intern"
                            value={formData.jobTitle}
                            onChange={(e) => setFormData({...formData, jobTitle: e.target.value})}
                        />
                    </div>

                    {/* Work Activities (functions) */}
                    <div className="space-y-3">
                        <label className="font-medium text-slate-700">Work Activities (functions)</label>
                        <textarea 
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                            placeholder="eg. Manage the financial office or manage the marketing campagins on Linkedin"
                            value={formData.functionDescription}
                            onChange={(e) => setFormData({...formData, functionDescription: e.target.value})}
                        />
                    </div>

                    {/* Employment Type */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 font-medium text-slate-700">
                            <Briefcase className="w-4 h-4 text-blue-500" />
                            Employment Type
                        </label>
                        <select 
                            className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                            value={formData.employmentType}
                            onChange={(e) => setFormData({...formData, employmentType: e.target.value})}
                        >
                            <option value="">Select type...</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                            <option value="Pro-bono">Pro-bono</option>
                        </select>
                    </div>

                    {/* Level of experience */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Level of experience:</h3>
                        <div className="space-y-3">
                            {["Starter/ Student", "Less than 5 years of experience", "5 to 10 years of experience", "10 to 20 years of experience", "20+ years of experience"].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="experienceLevel" 
                                        value={option}
                                        checked={formData.experienceLevel === option}
                                        onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Work Type */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Do you want the work to be:</h3>
                        <div className="space-y-3">
                            {[
                                "fixed (long term contract)", 
                                "temporary (short term contract)", 
                                "per project (once it is delivered, the work is over)"
                            ].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="workType" 
                                        value={option}
                                        checked={formData.workType === option}
                                        onChange={(e) => setFormData({...formData, workType: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Desired Advisor Profile */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Desired Profile</h3>
                        <p className="text-sm text-slate-500">What specific expertise or background are you looking for?</p>
                        <textarea 
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                            placeholder="Describe the skills, industry experience, or specific background you need..."
                            value={formData.desiredProfile}
                            onChange={(e) => setFormData({...formData, desiredProfile: e.target.value})}
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Location Type */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                Location Type
                            </label>
                            <select 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                value={formData.locationType}
                                onChange={(e) => setFormData({...formData, locationType: e.target.value})}
                            >
                                <option value="">Select location...</option>
                                <option value="In office">In office</option>
                                <option value="Hybrid">Hybrid</option>
                                <option value="Remote">Remote</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                What location this professional must be?
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="eg. Sao Paulo"
                                value={formData.location}
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </div>

                        {/* Language */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <Briefcase className="w-4 h-4 text-blue-500" />
                                What language it must speak to communicate with you/ do the job?
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="eg. English, Spanish or Portuguese"
                                value={formData.language}
                                onChange={(e) => setFormData({...formData, language: e.target.value})}
                            />
                        </div>

                        {/* Budget/Salary */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <DollarSign className="w-4 h-4 text-blue-500" />
                                Budget / Salary Range
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="e.g. $5k-10k or Market Rate"
                                value={formData.budget}
                                onChange={(e) => setFormData({...formData, budget: e.target.value})}
                            />
                        </div>

                        {/* Duration */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                Duration (if applicable)
                            </label>
                            <input 
                                type="text" 
                                className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                placeholder="e.g. 6 months, Indefinite"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* Compensation Structure */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Compensation Structure</h3>
                        <p className="text-sm text-slate-500 -mt-2">How do you intend to compensate this professional?</p>
                        
                        <div className="grid md:grid-cols-2 gap-3">
                            {["Paid in Money", "Equity of your Startup", "Performance %", "Pro-bono (no payment)"].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="checkbox" 
                                        value={option}
                                        checked={formData.compensation.includes(option)}
                                        onChange={() => handleCompensationChange(option)}
                                        className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="pt-8 space-y-6">
                        <button 
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Submit Application
                        </button>

                        <p className="text-center text-slate-500 text-sm font-medium leading-relaxed max-w-lg mx-auto">
                            We are here to support your growth and help you connect with the best minds of the market! Use this opportunity wisely!
                        </p>
                    </div>
                </form>
            )}
        </div>
    );
}