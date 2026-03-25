import React from 'react';
import Link from 'next/link';

export default function HowItWorks({ onNavigate }) {
    return (
        <section className="max-w-4xl mx-auto p-8 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-100 shadow-xl my-12" id="how-it-works">
            <h1 className="text-4xl font-extrabold mb-8 text-primary border-b pb-4">How Cross-Interaction Really Works</h1>

            <div className="space-y-12 text-gray-800 leading-relaxed">
                <header className="space-y-2">
                    <h2 className="text-2xl font-bold text-primary">Championing the Algorithm</h2>
                </header>

                <section className="space-y-6">
                    <h3 className="text-xl font-extrabold text-secondary">LINKEDIN:</h3>
                    <p>
                        Real engagement happens when you understand the social media algorithm and learn how to champion it. LinkedIn uses a complex set of deep analyses to classify whether a profile or piece of content is &quot;worth&quot; exposing to others.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">What LinkedIn Considers:</h4>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><span className="font-bold">Profile Organization:</span> The quality of your photo and how effectively your description connects to your content.</li>
                            <li><span className="font-bold">Initial Success:</span> How your content (text, video, image, or carousel) performs immediately after posting.</li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">Key Success Factors:</h4>
                        <ol className="list-decimal pl-6 space-y-2">
                            <li><span className="font-bold">Interactions:</span> Total number of likes, comments, shares, saves, and sends.</li>
                            <li><span className="font-bold">Format:</span> Clean formatting without external links or prohibited content (weapons, adult themes, etc.).</li>
                            <li><span className="font-bold">Relevance:</span> Alignment between your professional niche (e.g., Fintech) and your topics.</li>
                            <li><span className="font-bold">Consistency:</span> Posting frequency and optimal timing.</li>
                            <li><span className="font-bold">Reciprocal Activity:</span> How you interact with others, which drives return visits to your page.</li>
                        </ol>
                        <p className="text-sm text-gray-600 italic">
                            Note: We have mapped over 200 additional rules, including connection requests and usage patterns.
                        </p>
                    </div>

                    <p>
                        The Challenge: To succeed alone, you would need to work the platform 24/5 for an entire year. The Solution: ViralMind does the heavy lifting for you. We help you interact with strategic accounts that drive traffic back to your profile.
                    </p>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-extrabold text-secondary">Safety and Human Verification</h3>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><span className="font-bold">100% Real People:</span> Every account in our platform is verified by a human being to keep the ecosystem clean.</li>
                        <li><span className="font-bold">Dual-Check System:</span> We manually check all accounts entering the platform AND every individual post submitted for interaction.</li>
                        <li><span className="font-bold">Human-Like Behavior:</span> Our platform behaves naturally—opening pages and clicking posts—just like a real person.</li>
                        <li><span className="font-bold">Strict Content Policy:</span> We ban political, adult, spam, gambling, religious, or hateful content. We only support healthy, positive, and technical content.</li>
                    </ul>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-extrabold text-secondary">The Influencer Circle Interaction Style</h3>
                    <ul className="list-disc pl-6 space-y-3">
                        <li><span className="font-bold">Reactions:</span> We randomize Like, Love, Congratulations, and Insightful reactions. We never use the &quot;Funny&quot; reaction to avoid potential offense.</li>
                        <li className="space-y-2">
                            <div><span className="font-bold">Neuro-Linguistic Comments:</span> We don&apos;t use &quot;nice work&quot; bots. Our AI reads your profile and post history to determine your unique &quot;Tone of Voice.&quot; It then generates two types of high-value comments:</div>
                            <ul className="list-disc pl-6 space-y-2">
                                <li><span className="font-bold">Informative:</span> Adds data and value to the post.</li>
                                <li><span className="font-bold">Interrogative:</span> Asks smart questions to compel the author and followers to engage.</li>
                            </ul>
                        </li>
                    </ul>
                    <p className="text-sm text-gray-600 italic">
                        Note: All comments are human-formatted. You can disable this feature, though it significantly reduces your engagement potential and lower your engagement by 10 engagements less in the platform.
                    </p>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-extrabold text-secondary">INSTAGRAM:</h3>
                    <h4 className="text-lg font-bold">Mastering the 2025 AI Systems</h4>
                    <p>
                        Instagram’s algorithm is notoriously harsh. In 2025, it has evolved into a set of AI-driven ranking systems tailored specifically for Feed, Reels, Stories, and Explore.
                    </p>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">The 10 Key Features We Trigger for Your Growth:</h4>
                        <ol className="list-decimal pl-6 space-y-3">
                            <li>
                                <div><span className="font-bold">Retention &amp; Watch Time (#1 Factor):</span> The AI tracks if viewers watch past 3 seconds.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We provide the initial views to signal high quality, pushing your video to a wider audience.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Sends per Reach (DM Shares):</span> DM shares are now more powerful than likes.</div>
                                <div className="text-sm text-gray-600 italic">How we work: Our ecosystem facilitates DM shares to signal high &quot;social value.&quot;</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Engagement Velocity:</span> Rapid interaction in the first hour fast-tracks your post.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We deliver humanized, fast engagement immediately after you post.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Relationship Strength:</span> Instagram looks at DM history and comment consistency.</div>
                                <div className="text-sm text-gray-600 italic">How we work: we exchange DMs and comments within our ecosystem to validate your profile &quot;closeness.&quot;</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Content Originality:</span> The AI penalizes reposts with watermarks.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We incentivize 3x daily posting and offer cost-effective assistance to ensure your content looks raw and original.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Save Rate:</span> High-intent signals like saves increase a post&apos;s longevity.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We use &quot;Cross-Saving&quot; (saving then releasing 3 days later) to build long-term momentum.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Keyword &amp; SEO Relevance:</span> The AI &quot;reads&quot; your text on screen via OCR.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We use specific OCR techniques so your content is automatically categorized for your target audience.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Interactive Features (Stories):</span> Every sticker tap counts as a micro-interaction.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We implement stickers and interactive icons to keep you at the front of the Story bar.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">Image &amp; Video Quality:</span> Low-res content is automatically downranked.</div>
                                <div className="text-sm text-gray-600 italic">How we work: We ensure only high-quality media is used to satisfy AI quality checks.</div>
                            </li>
                            <li>
                                <div><span className="font-bold">User Activity Patterns:</span> Matching format to user habits.</div>
                                <div className="text-sm text-gray-600 italic">How we work: Because our platform is 24/7, your account is always active and interacting with the specific formats your audience prefers.</div>
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-lg font-bold">The Final Result</h4>
                        <p>
                            You will see results on your page the same day. With consistent use (6 months+ on Elite plans), you can position yourself as a market influencer. Our process is fast, reliable, and entirely focused on healthy, professional growth.
                        </p>
                    </div>
                </section>

                <section className="space-y-6">
                    <h3 className="text-xl font-extrabold text-secondary">Frequently Asked Questions (FAQ)</h3>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">Safety &amp; Account Integrity</h4>
                        <ol className="list-decimal pl-6 space-y-4">
                            <li>
                                <div className="font-bold">Is using Influencer Circle safe? Will I get banned?</div>
                                <div>
                                    Yes, it is totally safe. We do not use &quot;fake&quot; engagement. Every interaction comes from a real, human-verified account within our ecosystem. All actions mimic natural browsing patterns (varying speeds, different times of day), which keeps your account well within the safety limits of LinkedIn and Instagram’s 2025 security protocols. On top of that we respect (and stay 20% bellow) the max amount of interactions your account can do per day.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Does Influencer Circle cause a &quot;Shadowban&quot;?</div>
                                <div>No. In 2025, &quot;Shadowbanning&quot; (reach restriction) is typically caused by:</div>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Using banned hashtags or repetitive spammy tags.</li>
                                    <li>Violating community guidelines (politics, adult content, etc.)</li>
                                    <li>Using low-quality automation that creates &quot;repetitive mechanical patterns.&quot;</li>
                                </ul>
                                <div className="mt-2">
                                    ViralMind avoids this by ensuring all interactions are high-quality, human-led, and contextually relevant. By boosting your &quot;Social Value&quot; and &quot;Watch Time,&quot; we actually help prevent shadowbans by showing the algorithm your content is highly desirable.
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">Security</h4>
                        <ol className="list-decimal pl-6 space-y-4" start={3}>
                            <li>
                                <div className="font-bold">Do you need my password? Do I need to share my id and password?</div>
                                <div className="mt-2 font-bold">Never. We do not require your id or password, it stays directly in Linkedin and Instagram!</div>
                                <div className="mt-2">
                                    We do not ask for your login ID or password. You link your account directly in our platform. Your credentials remain with the social networks (Linkedin and Instagram) — you log your social media account into our platform and it is all that is needed to start the cross-interactions.
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">How the Platform Works</h4>
                        <ol className="list-decimal pl-6 space-y-4" start={4}>
                            <li>
                                <div className="font-bold">What kind of content is allowed?</div>
                                <div>
                                    We maintain a &quot;Clean Ecosystem.&quot; We only accept content that is:
                                </div>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li>Technical / Corporate / Business-focused</li>
                                    <li>Positive and personal brand growth</li>
                                    <li>Educational or Entertaining (B2B/B2C)</li>
                                </ul>
                                <div className="mt-2">
                                    We strictly ban and block: Political propaganda, religious debates, gambling, alcohol, adult/sexy content, hate speech, weapons, or negative/moral attacks.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Are the comments generated by AI?</div>
                                <div>
                                    We use a Hybrid Neuro-Linguistic (human + AI model). Our AI analyzes your profile to understand your professional &quot;tone&quot; and reads your post for context. It then suggests a high-value comment (Informative or Interrogative) which is reviewed to ensure it sounds human. We avoid the typical &quot;AI look&quot; (excessive emojis, &quot;Ending with a provocation,&quot; or generic &quot;Great post!&quot;).
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Can I choose who interacts with my content?</div>
                                <div>
                                    On the Elite Plan, yes. You can select the geo-location and the specific market/niche you want your engagement to come from. This ensures that the people liking and commenting on your post are relevant to your business goals.
                                </div>
                                <div className="mt-2">
                                    If you DON’T want to interact with someone, just block them in your social media (we are building a black list of names in our system and will have it ready for you soon).
                                </div>
                            </li>
                        </ol>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-lg font-bold">Results &amp; Subscription</h4>
                        <ol className="list-decimal pl-6 space-y-4" start={7}>
                            <li>
                                <div className="font-bold">How quickly will I see results?</div>
                                <div>
                                    You will see a surge in likes, comments, and saves almost immediately after your post is submitted to the platform. Most users report a significant increase in profile visits and LinkedIn SSI points within the first 24 to 48 hours.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">What happens if I want to leave?</div>
                                <div>
                                    You are in full control. You can cancel your subscription at any time through our dashboard or sending us a message. Since we don&apos;t hold your password, you can also simply disconnect your account from the social media settings by change your password to instantly revoke access or send us a message.
                                </div>
                                <div className="mt-2">
                                    In the Elite plans, if you want to leave just send us the message and the billing will stop (no minimum time required)
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Why do you check content manually?</div>
                                <div>
                                    To protect our users. If we allowed &quot;spammy&quot; or &quot;low-quality&quot; content into our pool, the social media algorithms would start to devalue the interactions within our ecosystem. By manually verifying every post, we ensure that every interaction you receive comes from a high-authority, &quot;clean&quot; environment.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">If I want to cancelled my free or paid subscription, how do I do it? Is there a minimum time required to be in the platform?</div>
                                <div>
                                    You can cancel it anytime you want by doing so in our platform, sending us a message (website, platform, email or WhatsApp) or you can simply change your password that the platform disconnects automatically.
                                </div>
                                <div className="mt-2">
                                    If you are an Elite member you can cancel the integration and the payments at anytime and no future billing will be done to your account.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Can I use my Linkedin/ Instagram normally?</div>
                                <div>
                                    Yes, you can use your Linkedin and our Instagram normally. Our platform enhances your profile but it doesn’t change your usage pattern.
                                </div>
                            </li>
                            <li>
                                <div className="font-bold">Can my account get blocked from Linkedin/ Instagram?</div>
                                <div>
                                    No, it can not (and we never had one user blocked). Because we mimic human behavior in every form and engagement we never had a problem with users getting blocked.
                                </div>
                            </li>
                        </ol>
                    </div>
                </section>

                <section className="bg-gradient-to-br from-[#1A103C] to-[#2D1B6B] p-10 rounded-3xl text-white shadow-2xl space-y-4">
                    <h3 className="text-2xl font-bold text-center">The InfluencerCircle Safety &amp; Quality Guarantee!</h3>
                    <ul className="list-disc pl-6 space-y-2 text-gray-200">
                        <li><span className="font-bold text-white">Real People Only:</span> 100% of accounts in our ecosystem are verified humans. No bots, no fake profiles, and no phishing.</li>
                        <li><span className="font-bold text-white">Human-Verified Content:</span> Every post submitted for interaction is checked by a human. We maintain a &quot;Healthy Ecosystem&quot; and strictly ban politics, adult content, gambling, hate speech, or violence.</li>
                        <li><span className="font-bold text-white">Natural Behavior:</span> Our platform mimics human behavior—opening pages, scrolling, and clicking—so it remains invisible to &quot;bot detection&quot; systems.</li>
                        <li><span className="font-bold text-white">Full Control:</span> You can undo any interaction directly on the social media platform at any time.</li>
                        <li><span className="font-bold text-white">No time bound contract:</span> if you are an Elite Member you can cancel it anytime with no extra charge.</li>
                    </ul>
                </section>

                <section className="text-center">
                    <Link href="/app" className="btn-primary py-4 px-10 text-lg shadow-xl shadow-blue-500/20 inline-block">
                        Go to Platform
                    </Link>
                </section>

                <footer className="pt-8 border-t text-center text-sm text-gray-400">
                    <p>Contact: contact@influencercircle.net</p>
                </footer>
            </div>
        </section>
    );
}
