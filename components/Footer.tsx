import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-12 mt-20">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    {/* Main Brand Info */}
                    <div className="space-y-4">
                        <h3 className="text-xl font-bold text-slate-900">ViralMind</h3>
                        <p className="text-sm text-slate-600 leading-relaxed italic">
                            Makes what's in your mind goes viral!
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Empowering professionals with Neuro-hooked engagement and strategic and cross-interactions platform/ ecosystem.
                        </p>
                        <a href="https://viralmind.me" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                            viralmind.me
                        </a>
                    </div>

                    {/* Monetization / Influencer */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Influencers</h4>
                        <p className="text-sm text-slate-600">Do you want to make money by becoming an Influencer?</p>
                        <a href="/onboarding" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm">
                            Join the Influencer Circle.
                        </a>
                    </div>

                    {/* Corporate / Companies */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Corporate</h4>
                        <p className="text-sm text-slate-600">Do you want to see our Corporate plans (for Companies)?</p>
                        <a href="https://Engageviral.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-sm">
                            Check out the EVx format and plans at Engageviral.net.
                        </a>
                    </div>

                    {/* Technology */}
                    <div className="space-y-4">
                        <h4 className="font-bold text-slate-900">Technology</h4>
                        <p className="text-sm text-slate-600 leading-relaxed">
                            Powered by proprietary Neuroscience and AI technology from
                            <a href="https://www.hackneuro.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mx-1">HackNeuro Lab</a>.
                        </p>
                        <p className="text-sm text-slate-600 leading-relaxed mt-2">
                            Payments powered by <a href="https://stripe.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Stripe</a>.
                        </p>
                    </div>
                </div>

                {/* Separator */}
                <div className="border-t border-slate-200 pt-8 mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        {/* Legal & Copyright */}
                        <div className="space-y-4">
                            <p className="text-xs text-slate-500 font-medium">
                                © 2026 ViralMind | Influencer Circle | HackNeuro - All rights reserved.
                            </p>
                            <p className="text-xs text-slate-500">
                                We strictly follow legal and privacy guidelines from HackNeuro Lab.
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-blue-600 font-medium">
                                <a href="https://www.viralmind.me/#terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:underline">Terms of Service</a>
                                <span className="text-slate-300">|</span>
                                <a href="https://www.viralmind.me/#sla" target="_blank" rel="noopener noreferrer" className="hover:underline">Service Level Agreement</a>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2">
                                For more legal information read the Privacy Policy, Terms of Service, Creators Terms, Code of Conduct from <span className="font-medium text-slate-500">influencercircle.net</span>
                            </p>
                            <div className="text-[10px] text-slate-400 leading-relaxed space-y-2">
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
                        </div>

                        {/* Social Impact / PUC angels */}
                        <div className="bg-white p-6 rounded-xl border border-blue-100/50 shadow-sm">
                            <p className="text-xs text-slate-600 leading-relaxed">
                                We believe that education can change the world and we invest part of our revenues in
                                <span className="font-bold mx-1">PUC angels</span> - A Brazilian Non-profit that is working hard to make the world a better place through education and fight hunger. Join us in this fight.
                            </p>
                            <a href="https://www.pucangels.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 font-bold text-sm mt-3 inline-block">
                                www.pucangels.org
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
