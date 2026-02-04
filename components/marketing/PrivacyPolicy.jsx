import React from 'react';

export default function PrivacyPolicy() {
    return (
        <section className="max-w-4xl mx-auto p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl my-12" id="privacy-policy">
            <h1 className="text-4xl font-extrabold mb-8 text-primary border-b pb-4">Privacy Notice</h1>

            <div className="space-y-8 text-gray-800 leading-relaxed">
                <header>
                    <h2 className="text-2xl font-bold mb-2">INFLUENCER CIRCLE PRIVACY NOTICE</h2>
                    <p className="text-sm text-gray-500 italic">Last Updated: December 19, 2025</p>
                    <p className="mt-4">
                        Influencer Circle, ViralMind, and HackNeuro Group (together, “Influencer Circle”, “we”, “us”, and “our”) operate a global influencer growth and marketing platform. We are committed to protecting your personal information in accordance with the General Data Protection Regulation (GDPR), the Lei Geral de Proteção de Dados (LGPD), and applicable US State Laws (CCPA/CPRA).
                    </p>
                </header>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">1</span>
                        INFORMATION ABOUT US
                    </h3>
                    <ul className="list-disc ml-8 space-y-1">
                        <li><strong>Influencer Circle</strong> is the Data Controller responsible for your personal information.</li>
                        <li><strong>Global Operations:</strong> Operated by ViralMind / HackNeuro Group.</li>
                        <li><strong>Contact Email:</strong> <a href="mailto:contact@influencercircle.net" className="text-primary hover:underline">contact@influencercircle.net</a></li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">2</span>
                        DATA WE COLLECT VIA VIRALMIND INTEGRATION
                    </h3>
                    <p className="mb-4">
                        To facilitate the "Cross-Interaction" growth format, we do not collect data through your connected social media profiles (LinkedIn and Instagram). We only collect your public social media data or information once a client shows interest in having you participate in a campaign and/ or it is needed in our commercial material. We do not store your data, posts, or information. We do not store your personal id or password for any social media platform (you log directly into the social media in our platform and therefore the id and password stay in the social media platform).
                    </p>

                    <div className="space-y-4 ml-8">
                        <div>
                            <h4 className="font-bold underline mb-2">2.1. Social Network Data</h4>
                            <p>By connecting your profiles via the ViralMind API, we may collect (only if needed):</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Public Profile Info:</strong> Name, handle, profile picture, and bio.</li>
                                <li><strong>Engagement Metrics:</strong> Follower counts, likes, comments, shares, and reach data.</li>
                                <li><strong>Content Metadata:</strong> Post frequency, timestamps, and media types.</li>
                                <li><strong>API Tokens:</strong> Secure OAuth tokens for our platform only (we do not store your passwords).</li>
                                <li><strong>Linkedin/ Instagram:</strong> we do not collect your id or password for this platform. In our integration you integrate the social media platforms directly into our platform.</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold underline mb-2">2.2. User-Provided Data</h4>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Registration:</strong> Name, email, mobile phone, profile informations and interests, and billing information (for Elite Members).</li>
                                <li><strong>Correspondence:</strong> Information provided during support requests or disputes.</li>
                            </ul>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">3</span>
                        SPECIAL CATEGORIES OF DATA (SENSITIVE INFO)
                    </h3>
                    <div className="ml-8 space-y-3">
                        <p>Under Art. 5 of the LGPD and Art. 9 of the GDPR, information regarding race, ethnicity, religious beliefs, sexual orientation, or political opinions is considered "Sensitive/Special Category" data.</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>Collection:</strong> We only collect this if you voluntarily provide it when applying for specific campaigns directed at these demographics.</li>
                            <li><strong>Legal Basis:</strong> Explicit consent or the exercise of legal rights in the public interest.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">4</span>
                        HOW WE USE YOUR INFORMATION
                    </h3>
                    <div className="grid md:grid-cols-3 gap-4 ml-8">
                        <div className="bg-blue-50 p-4 rounded-xl">
                            <h4 className="font-bold mb-2 text-blue-900 text-sm italic">Contractual Necessity</h4>
                            <p className="text-xs">To provide the "Cross-Interaction" service and fulfill Elite Member commercial plans.</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-xl">
                            <h4 className="font-bold mb-2 text-green-900 text-sm italic">Legitimate Interest</h4>
                            <p className="text-xs">To improve our growth algorithms, prevent fraud, and market your profile to potential Brands.</p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-xl">
                            <h4 className="font-bold mb-2 text-purple-900 text-sm italic">Legal Obligation</h4>
                            <p className="text-xs">Maintaining logs for 6 months under the Brazilian Marco Civil da Internet and tax records for 6-7 years.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">5</span>
                        SHARING AND EXPOSURE
                    </h3>
                    <ul className="list-disc ml-14 mt-2 space-y-1">
                        <li><strong>Brand Portal:</strong> Your profile data and engagement metrics are showcased to Brands in our portal for campaign selection.</li>
                        <li><strong>Service Providers:</strong> We share data with IT hosts, payment processors, and analytics providers (e.g., Google Analytics).</li>
                        <li><strong>Group Companies:</strong> Data is shared within the ViralMind/HackNeuro Group for global reporting and system maintenance.</li>
                        <li><strong>No Sale of Data:</strong> We do not sell your personal contact info to third parties for their independent marketing.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">6</span>
                        INTERNATIONAL TRANSFERS
                    </h3>
                    <div className="ml-8 space-y-2">
                        <p>Your data is stored and processed across data centers in the UK, USA, and Brazil.</p>
                        <ul className="list-disc ml-6 space-y-1">
                            <li><strong>Safeguards:</strong> Transfers are protected by Standard Contractual Clauses (SCCs) and adequacy decisions where applicable.</li>
                            <li><strong>LGPD Compliance:</strong> Transfers from Brazil follow the requirements of the ANPD.</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">7</span>
                        DATA RETENTION
                    </h3>
                    <div className="ml-8 overflow-hidden rounded-xl border border-gray-200">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Type</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Retention Period</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Connection Logs (Brazil)</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6 Months (Mandatory per Marco Civil)</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Contractual Records</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">6 Years post-account closure</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Payment Information</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3 Years post-deactivation</td>
                                </tr>
                                <tr>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Marketing Data</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Until you opt-out</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">8</span>
                        YOUR RIGHTS
                    </h3>
                    <p className="ml-8 mb-4">Depending on your jurisdiction (GDPR, LGPD, or CCPA), you have the right to:</p>
                    <ul className="list-disc ml-14 mt-2 space-y-1">
                        <li><strong>Access & Portability:</strong> Request a copy of your personal data.</li>
                        <li><strong>Correction:</strong> Fix inaccurate or incomplete data.</li>
                        <li><strong>Deletion:</strong> Request erasure of your data when it is no longer needed.</li>
                        <li><strong>Withdraw Consent:</strong> Disconnect profiles via settings or revoke API access via Google Security Settings.</li>
                        <li><strong>CCPA Opt-Out:</strong> US residents may opt-out of "sharing" for commercial exposure.</li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">9</span>
                        COOKIES AND TRACKING
                    </h3>
                    <p className="ml-8">
                        We use strictly necessary, analytical, and targeting cookies to distinguish you from other users and improve the Platform. You can block cookies via your browser, but this may impair Platform functionality.
                    </p>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">10</span>
                        THIRD-PARTY LINKS
                    </h3>
                    <p className="ml-8 mb-2">The Platform may contain links to YouTube, Google, and other third parties. Their use of your data is governed by their respective policies:</p>
                    <ul className="list-disc ml-14 space-y-1">
                        <li><a href="https://policies.google.com/privacy" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a></li>
                        <li><a href="https://www.youtube.com/t/terms" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a></li>
                    </ul>
                </section>

                <section>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-lg text-sm">11</span>
                        CHANGES TO THIS NOTICE
                    </h3>
                    <p className="ml-8">
                        We update this notice to reflect changes in global laws or our business model. Significant changes will be notified via email or a platform pop-up.
                    </p>
                </section>

                <footer className="pt-8 border-t text-center text-sm text-gray-400">
                    <p>Contact: contact@influencercircle.net</p>
                </footer>
            </div>
        </section>
    );
}
