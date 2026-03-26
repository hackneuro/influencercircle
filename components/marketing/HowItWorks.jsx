import React from 'react';
import Link from 'next/link';

export default function HowItWorks({ onNavigate }) {
    return (
        <section className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans" id="how-it-works">
            <div className="max-w-5xl mx-auto space-y-16">
                
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                        How <span className="text-blue-600">Cross-Interaction</span> Really Works
                    </h1>
                    <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                        Real engagement happens when you understand the social media algorithm and learn how to champion it.
                    </p>
                </div>

                {/* LinkedIn Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-[#0A66C2] p-8 text-white">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            LinkedIn: Championing the Algorithm
                        </h2>
                    </div>
                    
                    <div className="p-8 md:p-12 space-y-10">
                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-slate-900 border-b-2 border-blue-100 pb-2 inline-block">What LinkedIn Considers</h3>
                                <p className="text-slate-600">LinkedIn uses a complex set of deep analyses to classify whether a profile or piece of content is "worth" exposing to others.</p>
                                <ul className="space-y-3 mt-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                                        <div><span className="font-bold text-slate-800">Profile Organization:</span> The quality of your photo and how effectively your description connects to your content.</div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                                        <div><span className="font-bold text-slate-800">Initial Success:</span> How your content (text, video, image, or carousel) performs immediately after posting.</div>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-slate-900">Key Success Factors</h3>
                                <ol className="space-y-3 list-decimal list-inside text-slate-700 marker:font-bold marker:text-blue-600">
                                    <li><span className="font-bold text-slate-900">Interactions:</span> Total number of likes, comments, shares, saves, and sends.</li>
                                    <li><span className="font-bold text-slate-900">Format:</span> Clean formatting without external links or prohibited content.</li>
                                    <li><span className="font-bold text-slate-900">Relevance:</span> Alignment between your professional niche and your topics.</li>
                                    <li><span className="font-bold text-slate-900">Consistency:</span> Posting frequency and optimal timing.</li>
                                    <li><span className="font-bold text-slate-900">Reciprocal Activity:</span> How you interact with others.</li>
                                </ol>
                                <p className="text-xs text-slate-500 italic mt-4">* Note: We have mapped over 200 additional rules, including connection requests and usage patterns.</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-blue-900 mb-2">The Challenge</h4>
                                <p className="text-blue-800">To succeed alone, you would need to work the platform 24/5 for an entire year.</p>
                            </div>
                            <div className="hidden md:block w-px h-16 bg-blue-200"></div>
                            <div className="flex-1">
                                <h4 className="text-lg font-bold text-blue-900 mb-2">The Solution</h4>
                                <p className="text-blue-800">Influencer Circle does the heavy lifting for you. We help you interact with strategic accounts that drive traffic back to your profile.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Safety & Style Grid */}
                <div className="grid md:grid-cols-2 gap-8">
                    {/* Safety */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Safety & Human Verification</h3>
                        <ul className="space-y-4">
                            {[
                                { title: "100% Real People", desc: "Every account is verified by a human being to keep the ecosystem clean." },
                                { title: "Dual-Check System", desc: "We manually check all accounts AND every individual post submitted." },
                                { title: "Human-Like Behavior", desc: "Our platform behaves naturally—opening pages and clicking posts." },
                                { title: "Strict Content Policy", desc: "We ban political, adult, spam, or hateful content. We only support positive content." }
                            ].map((item, i) => (
                                <li key={i} className="flex gap-3">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                    <div>
                                        <span className="font-bold text-slate-800">{item.title}:</span> <span className="text-slate-600">{item.desc}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Interaction Style */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">Interaction Style</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Reactions</h4>
                                <p className="text-slate-600 mt-1">We randomize Like, Love, Congratulations, and Insightful reactions. We never use "Funny" to avoid potential offense.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">Neuro-Linguistic Comments</h4>
                                <p className="text-slate-600 mt-1 mb-3">We don't use "nice work" bots. Our AI generates high-value comments based on your Tone of Voice:</p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div><span className="font-bold text-slate-800">Informative:</span> <span className="text-slate-600">Adds data and value.</span></li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div><span className="font-bold text-slate-800">Interrogative:</span> <span className="text-slate-600">Asks smart questions to compel engagement.</span></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instagram Section */}
                <div className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-3xl shadow-xl overflow-hidden text-white">
                    <div className="p-8 md:p-12">
                        <div className="flex items-center gap-4 mb-8">
                            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <h2 className="text-3xl font-bold">Instagram: Mastering the 2025 AI Systems</h2>
                        </div>
                        <p className="text-lg text-white/90 mb-10 max-w-3xl">Instagram’s algorithm is notoriously harsh. In 2025, it has evolved into a set of AI-driven ranking systems tailored specifically for Feed, Reels, Stories, and Explore.</p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">The 10 Key Features We Trigger for Your Growth</h3>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
                                {[
                                    { t: "Retention & Watch Time", p: "We provide the initial views to signal high quality." },
                                    { t: "Sends per Reach (DM Shares)", p: "Our ecosystem facilitates DM shares to signal high 'social value'." },
                                    { t: "Engagement Velocity", p: "We deliver humanized, fast engagement immediately after you post." },
                                    { t: "Relationship Strength", p: "We exchange DMs and comments within our ecosystem to validate 'closeness'." },
                                    { t: "Content Originality", p: "We incentivize 3x daily posting to ensure content looks raw." },
                                    { t: "Save Rate", p: "We use 'Cross-Saving' to build long-term momentum." },
                                    { t: "Keyword & SEO Relevance", p: "We use specific OCR techniques so your content is auto-categorized." },
                                    { t: "Interactive Features", p: "We implement stickers and taps to keep you at the front of Stories." },
                                    { t: "Image & Video Quality", p: "We ensure only high-quality media is used to satisfy AI checks." },
                                    { t: "User Activity Patterns", p: "Our 24/7 platform keeps your account always active." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">{i+1}</div>
                                        <div>
                                            <h4 className="font-bold text-white">{item.t}</h4>
                                            <p className="text-white/80 text-sm mt-1">{item.p}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">Frequently Asked Questions</h2>
                    
                    <div className="space-y-12">
                        {/* Group 1 */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                Safety & Account Integrity
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">1. Is using Influencer Circle safe? Will I get banned?</h4>
                                    <p className="text-slate-600">Yes, it is totally safe. We do not use "fake" engagement. Every interaction comes from a real, human-verified account within our ecosystem. All actions mimic natural browsing patterns, which keeps your account well within the safety limits.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">2. Does Influencer Circle cause a "Shadowban"?</h4>
                                    <p className="text-slate-600">No. In 2025, "Shadowbanning" is typically caused by banned hashtags, community violations, or low-quality automation. Influencer Circle avoids this by ensuring all interactions are high-quality and human-led, actually helping prevent shadowbans.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">3. Do you need my password?</h4>
                                    <p className="text-slate-800 font-medium">Never. We do not require your id or password, it stays directly in Linkedin and Instagram!</p>
                                    <p className="text-slate-600 mt-2">You link your account directly in our platform. Your credentials remain with the social networks.</p>
                                </div>
                            </div>
                        </div>

                        {/* Group 2 */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                How the Platform Works
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">4. What kind of content is allowed?</h4>
                                    <p className="text-slate-600 mb-2">We maintain a "Clean Ecosystem." We only accept Technical/Corporate, Positive brand growth, and Educational/Entertaining content.</p>
                                    <p className="text-red-500 text-sm font-medium">We strictly ban: Political propaganda, gambling, adult content, hate speech.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">5. Are the comments generated by AI?</h4>
                                    <p className="text-slate-600">We use a Hybrid Neuro-Linguistic model. Our AI analyzes your tone and suggests high-value comments which are reviewed to ensure they sound human.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl md:col-span-2">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">6. Can I choose who interacts with my content?</h4>
                                    <p className="text-slate-600">On the Elite Plan, yes. You can select the geo-location and the specific market/niche. If you DON’T want to interact with someone, just block them in your social media.</p>
                                </div>
                            </div>
                        </div>

                        {/* Group 3 */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                Results & Subscription
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">7. How quickly will I see results?</h4>
                                    <p className="text-slate-600">You will see a surge in likes, comments, and saves almost immediately after your post is submitted. Most users report significant increases within 24-48 hours.</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">8. What happens if I want to leave?</h4>
                                    <p className="text-slate-600">You are in full control. You can cancel at any time through our dashboard. Since we don't hold your password, you can also simply change your social media password to instantly revoke access.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-[#1A103C] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-extrabold">Ready to dominate the algorithm?</h2>
                        <p className="text-xl text-blue-200 max-w-2xl mx-auto">The InfluencerCircle Guarantee: Real People, Verified Content, Natural Behavior, and Full Control.</p>
                        <Link href="/app" className="inline-block bg-white text-[#1A103C] font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200">
                            Go to Platform
                        </Link>
                    </div>
                </div>

            </div>
        </section>
    );
}
