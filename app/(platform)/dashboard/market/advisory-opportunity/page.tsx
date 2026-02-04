"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Clock, Calendar, MessageSquare, DollarSign } from 'lucide-react';

export default function AdvisoryOpportunityPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        profileType: "",
        advisorProfile: "",
        sessionDuration: "",
        frequency: "",
        totalPeriod: "",
        directMessaging: "",
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
        // Here you would typically send the data to your backend
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
                                Great, we will analyze your request and get back to you via email. Please pay attention to your email for more instructions.
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
                            By completing this form, you are expressing a formal interest in a professional engagement (whether pro-bono, paid, equity-based, or performance-based). Our team will curate your request and match you with the most suitable Angel or Board Advisor based on the information provided.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Response Deadline</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Once you receive your mentorship confirmation email, you have <span className="font-semibold text-slate-900">3 (three) business days</span> to respond. If we do not hear from you within this timeframe, the opportunity will be reassigned to another member.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Negotiations, Contracts, and Guidelines</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Influencer Circle facilitates direct negotiations and provides the infrastructure for parties to message and support each other throughout the process (please note: we do not intervene in the final working relationship).
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Changing Advisors</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To request a different advisor, a new formal application must be submitted.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Advisory Format</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The structure of the engagement is to be negotiated directly between both parties via direct messaging.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button 
                            onClick={() => setStep(2)}
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                        >
                            Continue
                        </button>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-8">
                    <div className="text-center space-y-2 mb-8">
                        <h1 className="text-2xl font-bold text-slate-900">Advisory Application Form</h1>
                        <p className="text-slate-500">Please fill out the details below to find your perfect advisor match.</p>
                    </div>

                    {/* What are you? */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">What are you?</h3>
                        <div className="space-y-3">
                            {["Student (undergrad or grad student)", "Executive/ Experience Professional", "Startup Early Stage", "Medium Company/ Startup", "Large Company (Corporation)"].map((option) => (
                                <label key={option} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="profileType" 
                                        value={option}
                                        checked={formData.profileType === option}
                                        onChange={(e) => setFormData({...formData, profileType: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Desired Advisor Profile */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-slate-900">Desired Advisor Profile</h3>
                        <p className="text-sm text-slate-500">What specific expertise or background are you looking for?</p>
                        <textarea 
                            className="w-full h-32 p-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                            placeholder="Describe the skills, industry experience, or specific background you need..."
                            value={formData.advisorProfile}
                            onChange={(e) => setFormData({...formData, advisorProfile: e.target.value})}
                        />
                    </div>

                    {/* Engagement Structure */}
                    <div className="space-y-6 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Engagement Structure</h3>
                        <p className="text-sm text-slate-500 -mt-4">Define your preferred format:</p>

                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Session Duration */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <Clock className="w-4 h-4 text-blue-500" />
                                    Session Duration
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                    value={formData.sessionDuration}
                                    onChange={(e) => setFormData({...formData, sessionDuration: e.target.value})}
                                >
                                    <option value="">Select duration...</option>
                                    <option value="30 min">30 min</option>
                                    <option value="1 hour">1 hour</option>
                                    <option value="no time bound">No time bound</option>
                                </select>
                            </div>

                            {/* Frequency */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 font-medium text-slate-700">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    Frequency
                                </label>
                                <select 
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none bg-white"
                                    value={formData.frequency}
                                    onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                                >
                                    <option value="">Select frequency...</option>
                                    <option value="once per week">Once per week</option>
                                    <option value="once per 15 days">Once per 15 days</option>
                                    <option value="once per month">Once per month</option>
                                </select>
                            </div>
                        </div>

                        {/* Total Period */}
                        <div className="space-y-3">
                            <label className="font-medium text-slate-700">Total Period</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    min="4"
                                    className="w-24 p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.totalPeriod}
                                    onChange={(e) => setFormData({...formData, totalPeriod: e.target.value})}
                                />
                                <span className="text-slate-600 font-medium">Months</span>
                            </div>
                        </div>

                        {/* Direct Messaging */}
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 font-medium text-slate-700">
                                <MessageSquare className="w-4 h-4 text-blue-500" />
                                Do you want to have direct whatsapp (or any other Instant Messaging) for rapid communication with your Advisor?
                            </label>
                            <div className="flex gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="directMessaging" 
                                        value="YES"
                                        checked={formData.directMessaging === "YES"}
                                        onChange={(e) => setFormData({...formData, directMessaging: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700 font-medium">YES</span>
                                </label>
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input 
                                        type="radio" 
                                        name="directMessaging" 
                                        value="NO"
                                        checked={formData.directMessaging === "NO"}
                                        onChange={(e) => setFormData({...formData, directMessaging: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700 font-medium">NO</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Compensation Structure */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900">Compensation Structure</h3>
                        <p className="text-sm text-slate-500 -mt-2">How do you intend to compensate the advisor?</p>
                        
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
