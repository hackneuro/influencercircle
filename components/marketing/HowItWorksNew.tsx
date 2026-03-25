"use client";

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/marketing/LanguageContext';

export default function HowItWorksNew() {
    const { t } = useLanguage();

    return (
        <div className="min-h-screen bg-slate-50 py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-5xl mx-auto space-y-20">
                
                {/* Header */}
                <div className="text-center space-y-6">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight">
                        {t('howItWorksPage.title')}
                    </h1>
                    <p className="text-2xl text-blue-600 font-semibold max-w-3xl mx-auto">
                        {t('howItWorksPage.subtitle')}
                    </p>
                </div>

                {/* LinkedIn Section */}
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
                    <div className="bg-[#0A66C2] p-8 text-white">
                        <h2 className="text-3xl font-bold flex items-center gap-3">
                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                            {t('howItWorksPage.linkedin.title')}
                        </h2>
                    </div>
                    
                    <div className="p-8 md:p-12 space-y-10">
                        <p className="text-lg text-slate-700 leading-relaxed">
                            {t('howItWorksPage.linkedin.intro')}
                        </p>

                        <div className="grid md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-900 border-b-2 border-blue-100 pb-2 inline-block">
                                    {t('howItWorksPage.linkedin.whatItConsiders')}
                                </h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                                        <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.poTitle')}</span> {t('howItWorksPage.linkedin.poDesc')}</div>
                                    </li>
                                    <li className="flex items-start gap-3">
                                        <div className="mt-1 bg-blue-100 text-blue-600 rounded-full p-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg></div>
                                        <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.isTitle')}</span> {t('howItWorksPage.linkedin.isDesc')}</div>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-4 bg-slate-50 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-slate-900">{t('howItWorksPage.linkedin.keySuccess')}</h3>
                                <ol className="space-y-3 list-decimal list-inside text-slate-700 marker:font-bold marker:text-blue-600">
                                    <li>{t('howItWorksPage.linkedin.ks1')}</li>
                                    <li>{t('howItWorksPage.linkedin.ks2')}</li>
                                    <li>{t('howItWorksPage.linkedin.ks3')}</li>
                                    <li>{t('howItWorksPage.linkedin.ks4')}</li>
                                    <li>{t('howItWorksPage.linkedin.ks5')}</li>
                                </ol>
                                <p className="text-xs text-slate-500 italic mt-4">{t('howItWorksPage.linkedin.ksNote')}</p>
                            </div>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center">
                            <div className="flex-1">
                                <p className="text-blue-900 font-medium">{t('howItWorksPage.linkedin.challenge')}</p>
                            </div>
                            <div className="hidden md:block w-px h-16 bg-blue-200"></div>
                            <div className="flex-1">
                                <p className="text-blue-900 font-bold">{t('howItWorksPage.linkedin.solution')}</p>
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
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('howItWorksPage.linkedin.safetyTitle')}</h3>
                        <ul className="space-y-4">
                            <li className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.s1Title')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.s1Desc')}</span></div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.s2Title')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.s2Desc')}</span></div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.s3Title')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.s3Desc')}</span></div>
                            </li>
                            <li className="flex gap-3">
                                <div className="mt-1 w-2 h-2 rounded-full bg-emerald-500 shrink-0"></div>
                                <div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.s4Title')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.s4Desc')}</span></div>
                            </li>
                        </ul>
                    </div>

                    {/* Interaction Style */}
                    <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
                        <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">{t('howItWorksPage.linkedin.styleTitle')}</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{t('howItWorksPage.linkedin.st1Title')}</h4>
                                <p className="text-slate-600 mt-1">{t('howItWorksPage.linkedin.st1Desc')}</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-lg">{t('howItWorksPage.linkedin.st2Title')}</h4>
                                <p className="text-slate-600 mt-1 mb-3">{t('howItWorksPage.linkedin.st2Desc')}</p>
                                <ul className="space-y-2 ml-4">
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.st2aTitle')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.st2aDesc')}</span></li>
                                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div><span className="font-bold text-slate-800">{t('howItWorksPage.linkedin.st2bTitle')}</span> <span className="text-slate-600">{t('howItWorksPage.linkedin.st2bDesc')}</span></li>
                                </ul>
                                <p className="text-xs text-slate-500 italic mt-4">{t('howItWorksPage.linkedin.stNote')}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Instagram Section */}
                <div className="bg-gradient-to-br from-pink-500 via-red-500 to-yellow-500 rounded-3xl shadow-xl overflow-hidden text-white">
                    <div className="p-8 md:p-12">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                            <svg className="w-10 h-10 shrink-0" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                            <h2 className="text-3xl font-bold">{t('howItWorksPage.instagram.title')} {t('howItWorksPage.instagram.subtitle')}</h2>
                        </div>
                        <p className="text-lg text-white/90 mb-10 max-w-3xl">{t('howItWorksPage.instagram.intro')}</p>

                        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 mb-8">
                            <h3 className="text-xl font-bold mb-6 border-b border-white/20 pb-4">{t('howItWorksPage.instagram.keyFeatures')}</h3>
                            <div className="grid md:grid-cols-2 gap-x-8 gap-y-8">
                                {[
                                    { title: t('howItWorksPage.instagram.f1Title'), desc: t('howItWorksPage.instagram.f1Desc'), how: t('howItWorksPage.instagram.f1How') },
                                    { title: t('howItWorksPage.instagram.f2Title'), desc: t('howItWorksPage.instagram.f2Desc'), how: t('howItWorksPage.instagram.f2How') },
                                    { title: t('howItWorksPage.instagram.f3Title'), desc: t('howItWorksPage.instagram.f3Desc'), how: t('howItWorksPage.instagram.f3How') },
                                    { title: t('howItWorksPage.instagram.f4Title'), desc: t('howItWorksPage.instagram.f4Desc'), how: t('howItWorksPage.instagram.f4How') },
                                    { title: t('howItWorksPage.instagram.f5Title'), desc: t('howItWorksPage.instagram.f5Desc'), how: t('howItWorksPage.instagram.f5How') },
                                    { title: t('howItWorksPage.instagram.f6Title'), desc: t('howItWorksPage.instagram.f6Desc'), how: t('howItWorksPage.instagram.f6How') },
                                    { title: t('howItWorksPage.instagram.f7Title'), desc: t('howItWorksPage.instagram.f7Desc'), how: t('howItWorksPage.instagram.f7How') },
                                    { title: t('howItWorksPage.instagram.f8Title'), desc: t('howItWorksPage.instagram.f8Desc'), how: t('howItWorksPage.instagram.f8How') },
                                    { title: t('howItWorksPage.instagram.f9Title'), desc: t('howItWorksPage.instagram.f9Desc'), how: t('howItWorksPage.instagram.f9How') },
                                    { title: t('howItWorksPage.instagram.f10Title'), desc: t('howItWorksPage.instagram.f10Desc'), how: t('howItWorksPage.instagram.f10How') }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4">
                                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">{i+1}</div>
                                        <div>
                                            <h4 className="font-bold text-white mb-1">{item.title}</h4>
                                            <p className="text-white/80 text-sm mb-2">{item.desc}</p>
                                            <p className="text-white text-sm font-medium bg-black/10 p-2 rounded-lg">{item.how}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div className="bg-black/20 rounded-2xl p-6">
                            <h3 className="text-xl font-bold mb-2">{t('howItWorksPage.instagram.finalResultTitle')}</h3>
                            <p className="text-white/90">{t('howItWorksPage.instagram.finalResultDesc')}</p>
                        </div>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
                    <h2 className="text-3xl font-bold text-slate-900 mb-10 text-center">{t('howItWorksPage.faq.title')}</h2>
                    
                    <div className="space-y-12">
                        {/* Group 1: Safety */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                {t('howItWorksPage.faq.safetyTitle')}
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q1Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q1Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q2Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q2Desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Group 2: Security */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                {t('howItWorksPage.faq.securityTitle')}
                            </h3>
                            <div className="bg-slate-50 p-6 rounded-2xl border-l-4 border-emerald-500">
                                <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q3Title')}</h4>
                                <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q3Desc')}</p>
                            </div>
                        </div>

                        {/* Group 3: How it works */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                {t('howItWorksPage.faq.howItWorksTitle')}
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q4Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q4Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q5Title')}</h4>
                                    <p className="text-slate-600">{t('howItWorksPage.faq.q5Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q6Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q6Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q9Title')}</h4>
                                    <p className="text-slate-600">{t('howItWorksPage.faq.q9Desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Group 4: Results & Sub */}
                        <div>
                            <h3 className="text-xl font-bold text-blue-600 mb-6 flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                {t('howItWorksPage.faq.resultsTitle')}
                            </h3>
                            <div className="space-y-6">
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q7Title')}</h4>
                                    <p className="text-slate-600">{t('howItWorksPage.faq.q7Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q8Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q8Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q10Title')}</h4>
                                    <p className="text-slate-600 whitespace-pre-line">{t('howItWorksPage.faq.q10Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q11Title')}</h4>
                                    <p className="text-slate-600">{t('howItWorksPage.faq.q11Desc')}</p>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-2xl">
                                    <h4 className="font-bold text-slate-900 text-lg mb-2">{t('howItWorksPage.faq.q12Title')}</h4>
                                    <p className="text-slate-600">{t('howItWorksPage.faq.q12Desc')}</p>
                                </div>
                            </div>
                        </div>

                        {/* Guarantee */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100 mt-12">
                            <h3 className="text-2xl font-bold text-blue-900 mb-6 text-center">{t('howItWorksPage.faq.guaranteeTitle')}</h3>
                            <ul className="space-y-4 text-blue-800">
                                <li className="flex gap-3"><div className="mt-1">✅</div><div>{t('howItWorksPage.faq.g1')}</div></li>
                                <li className="flex gap-3"><div className="mt-1">✅</div><div>{t('howItWorksPage.faq.g2')}</div></li>
                                <li className="flex gap-3"><div className="mt-1">✅</div><div>{t('howItWorksPage.faq.g3')}</div></li>
                                <li className="flex gap-3"><div className="mt-1">✅</div><div>{t('howItWorksPage.faq.g4')}</div></li>
                                <li className="flex gap-3"><div className="mt-1">✅</div><div>{t('howItWorksPage.faq.g5')}</div></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Final CTA */}
                <div className="bg-[#1A103C] rounded-3xl p-10 md:p-16 text-center text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/20 to-purple-600/20"></div>
                    <div className="relative z-10 space-y-8">
                        <h2 className="text-3xl md:text-5xl font-extrabold">Ready to dominate the algorithm?</h2>
                        <Link href="/dashboard" className="inline-block bg-white text-[#1A103C] font-bold text-lg px-10 py-4 rounded-xl hover:bg-blue-50 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:scale-105 transform duration-200">
                            Go to Platform
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
}
