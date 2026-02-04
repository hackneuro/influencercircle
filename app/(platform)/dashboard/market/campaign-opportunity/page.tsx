"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Camera, Upload, DollarSign } from 'lucide-react';

export default function CampaignOpportunityPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [formData, setFormData] = useState({
        marketNiche: "",
        location: "",
        followingSize: "",
        engagementExpected: "",
        contentCreation: "", // 'CREATOR' or 'USER'
        uploadedFile: null as File | null,
        budget: "",
        channels: [] as string[]
    });

    const handleChannelChange = (value: string) => {
        setFormData(prev => {
            if (prev.channels.includes(value)) {
                return { ...prev, channels: prev.channels.filter(c => c !== value) };
            } else {
                return { ...prev, channels: [...prev.channels, value] };
            }
        });
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, uploadedFile: e.target.files[0] });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.followingSize && parseInt(formData.followingSize.replace(/\D/g, '')) < 1000) {
            alert("Following size must be at least 1,000.");
            return;
        }

        if (formData.budget && parseFloat(formData.budget) < 30) {
            alert("Budget must be at least $30.");
            return;
        }

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
                                Great work, we will analyze your campaign and get back to you in 3 business days! Please check your email for our communication.
                            </p>
                            <p className="text-sm text-slate-500">
                                Targeted influencers submit their pricing, and you choose who to collaborate with.
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
                            By completing this form, you are expressing a formal interest in a professional engagement for a campaign. Our team will curate your request and match you with the most suitable Influencer or Creator/ Executive based on the information provided.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Response Deadline</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Once you receive your mentorship confirmation email, you have <span className="font-semibold text-slate-900">3 (three) business days</span> to respond. If we do not hear from you within this timeframe, the opportunity will be delete it.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Negotiations, Contracts, and Guidelines</h2>
                        <p className="text-slate-600 leading-relaxed">
                            Influencer Circle facilitates direct negotiations and provides the infrastructure for parties to create the content for the campaign, post schedules and formats so that the campaign might happen. Note that the creator must keep the post up for, at least, 30 days after the post ins made.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Changing Influencer/ Creators</h2>
                        <p className="text-slate-600 leading-relaxed">
                            To request a different influencer/ creator, a new formal application must be submitted. If you want a new influencer/ creator the payment for the first chosen and approved one still upholds.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Creator Format</h2>
                        <p className="text-slate-600 leading-relaxed">
                            The structure of the engagement is to be negotiated with Influencer Circle that will help both parties create, post and follow up the campaign.
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
                        <h1 className="text-2xl font-bold text-slate-900">Influencer/ Creator Form</h1>
                        <p className="text-slate-500">Define your campaign requirements to find the perfect match.</p>
                    </div>

                    {/* Set Targeting */}
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">Set Targeting</h3>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="font-medium text-slate-700">Market Niche</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. fintech, health, agro, etc."
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.marketNiche}
                                    onChange={(e) => setFormData({...formData, marketNiche: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="font-medium text-slate-700">Location</label>
                                <input 
                                    type="text" 
                                    placeholder="city, state and or country"
                                    className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="font-medium text-slate-700">Following Size</label>
                                    <input 
                                        type="number" 
                                        placeholder="Min. 1000"
                                        min="1000"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                        value={formData.followingSize}
                                        onChange={(e) => setFormData({...formData, followingSize: e.target.value})}
                                        required
                                    />
                                    <p className="text-xs text-slate-500">Starting with 1,000</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="font-medium text-slate-700">Engagement Expected</label>
                                    <input 
                                        type="number" 
                                        placeholder="Views/Impact count"
                                        className="w-full p-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                        value={formData.engagementExpected}
                                        onChange={(e) => setFormData({...formData, engagementExpected: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Post Campaign */}
                    <div className="space-y-6 pt-4 border-t border-slate-100">
                        <h3 className="text-lg font-bold text-slate-900 pb-2 border-b border-slate-100">Post Campaign</h3>
                        
                        <div className="space-y-4">
                            <label className="font-medium text-slate-700">
                                Do you want to send us your marketing material or the creator can create it?
                            </label>
                            
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="contentCreation" 
                                        value="CREATOR"
                                        checked={formData.contentCreation === "CREATOR"}
                                        onChange={(e) => setFormData({...formData, contentCreation: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                        required
                                    />
                                    <span className="text-slate-700">The creator/ Influencer Circle can create</span>
                                </label>

                                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                                    <input 
                                        type="radio" 
                                        name="contentCreation" 
                                        value="USER"
                                        checked={formData.contentCreation === "USER"}
                                        onChange={(e) => setFormData({...formData, contentCreation: e.target.value})}
                                        className="w-5 h-5 text-blue-600 border-slate-300 focus:ring-blue-500"
                                    />
                                    <span className="text-slate-700">I will send mine</span>
                                </label>
                            </div>

                            {formData.contentCreation === "USER" && (
                                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 animate-in fade-in slide-in-from-top-4">
                                    <label className="block font-medium text-slate-700 mb-2">
                                        Send us your image/ video
                                    </label>
                                    <div className="flex items-center justify-center w-full">
                                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-300 border-dashed rounded-xl cursor-pointer bg-white hover:bg-slate-50 transition-colors">
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-slate-400" />
                                                <p className="text-sm text-slate-500">Click to upload picture/pdf/video</p>
                                            </div>
                                            <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*,video/*,.pdf" />
                                        </label>
                                    </div>
                                    {formData.uploadedFile && (
                                        <p className="mt-2 text-sm text-blue-600 font-medium">
                                            Selected: {formData.uploadedFile.name}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="space-y-2 pt-4">
                                <label className="font-medium text-slate-700">How much are you willing to pay for the content (post)?</label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="number" 
                                        min="30"
                                        placeholder="Min. $30"
                                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 outline-none"
                                        value={formData.budget}
                                        onChange={(e) => setFormData({...formData, budget: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-4">
                                <label className="font-medium text-slate-700">What channels do you want to campaign?</label>
                                <div className="flex gap-6">
                                    {["Linkedin", "Instagram"].map((channel) => (
                                        <label key={channel} className="flex items-center gap-2 cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                value={channel}
                                                checked={formData.channels.includes(channel)}
                                                onChange={() => handleChannelChange(channel)}
                                                className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-slate-700">{channel}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-8">
                        <button 
                            type="submit"
                            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
                        >
                            <Camera className="w-5 h-5" />
                            Submit Campaign Application
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
