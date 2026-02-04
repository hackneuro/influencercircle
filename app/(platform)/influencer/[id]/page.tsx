import { INFLUENCERS } from "@/lib/data";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin,
  CheckCircle2,
  Star,
  Instagram,
  Linkedin,
  Share2,
  MessageCircle,
  ShieldCheck,
  Clock,
  Zap,
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Send,
  Briefcase,
  GraduationCap,
  Users,
  DollarSign,
  Camera,
  Lightbulb
} from "lucide-react";

import InfluencerBadges from "@/components/InfluencerBadges";
import ProfileActions from "@/components/ProfileActions";

// Helper to generate consistent dummy packages based on price
const getPackages = (basePrice: string) => {
  return [
    {
      id: 1,
      name: "Linkedin Package",
      price: "$50",
      description: "Professional exposure on LinkedIn network",
      features: [
        "1 Post: $50 USD",
        "1 Share: $30 USD",
        "Content stays up 60+ days"
      ],
      delivery: "2 days",
      popular: true
    },
    {
      id: 2,
      name: "Instagram Package",
      price: "$50",
      description: "Permanent feed exposure",
      features: [
        "1 Permanent Post: $50 USD",
        "1 Story Repost: $30 USD",
        "Reel: $50 USD",
        "Post stays up 60+ days"
      ],
      delivery: "2 days"
    },
    {
      id: 3,
      name: "Full Package",
      price: "$80",
      description: "Cross-platform maximum reach",
      features: [
        "Insta + LinkedIn Post: $80 USD",
        "1 Story in Instagram: $50 USD",
        "Instagram Reel: $50 USD",
        "Post stays up 60+ days"
      ],
      delivery: "3 days"
    }
  ];
};

// Helper to generate dummy portfolio images
const portfolioImages = [
  "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1611162618071-b39a2ec055fb?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80"
];

export async function generateStaticParams() {
  return INFLUENCERS.map((inf) => ({
    id: inf.id.toString(),
  }));
}

export default async function InfluencerProfile({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const influencer = INFLUENCERS.find((i) => i.id === Number(id));

  if (!influencer) {
    notFound();
  }

  const getExpertiseIcon = (expertise: string, className: string = "w-3 h-3") => {
    switch (expertise) {
      case "Creator": return <Camera className={className} />;
      case "Executive": return <Briefcase className={className} />;
      case "Advisor": return <Lightbulb className={className} />;
      case "Investor": return <DollarSign className={className} />;
      default: return <Users className={className} />;
    }
  };

  const packages = getPackages(influencer.price);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Navigation / Breadcrumb Placeholder */}
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/dashboard/market" className="text-gray-600 hover:text-gray-900 font-medium flex items-center gap-2">
            ← Back to Market
          </Link>
          <div className="flex gap-4">
            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-4 xl:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <Image
                  src={influencer.image}
                  alt={influencer.name}
                  fill
                  className="object-cover rounded-full border-4 border-white shadow-md"
                />
                {influencer.verified && (
                  <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full shadow-sm">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">{influencer.name}</h1>

                {/* Categories */}
                <div className="flex flex-wrap justify-center gap-1.5 mb-3">
                  {influencer.categories.map((cat) => (
                    <span key={cat} className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider rounded-md border border-blue-100">
                      {cat}
                    </span>
                  ))}
                </div>

                {influencer.expertise && (
                  <div className="flex justify-center flex-wrap gap-2 mb-2">
                    {influencer.expertise.map((exp, idx) => (
                      <span key={idx} className="bg-indigo-600 text-white px-3 py-0.5 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm">
                        {getExpertiseIcon(exp, "w-3 h-3")}
                        {exp}
                      </span>
                    ))}
                  </div>
                )}

                <p className="text-gray-500 text-sm mb-3 flex items-center justify-center gap-1">
                  <MapPin className="w-3 h-3" /> {influencer.location} {influencer.flag}
                </p>
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  {influencer.tags.map((tag) => (
                    <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-center border-t border-b border-gray-100 py-4 mb-6">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-lg">
                    <Linkedin className="w-4 h-4 text-[#0077b5]" />
                    {influencer.stats.linkedin.followers}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
                <div className="text-center border-l border-gray-100">
                  <div className="flex items-center justify-center gap-1 text-gray-900 font-bold text-lg">
                    <Instagram className="w-4 h-4 text-[#E1306C]" />
                    {influencer.stats.instagram.followers}
                  </div>
                  <div className="text-xs text-gray-500">Followers</div>
                </div>
              </div>

              <div className="space-y-3">
                <ProfileActions />
                <p className="text-xs text-center text-gray-400">
                  Response time: ~2 hours
                </p>
              </div>

              <div className="space-y-3 mt-6">
                {influencer.verified && (
                  <div className="p-3 bg-blue-50 rounded-xl flex items-center gap-3 border border-blue-100">
                    <div className="bg-white p-1.5 rounded-lg text-blue-600 shadow-sm">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-blue-900">Elite Member</h4>
                      <p className="text-[10px] text-blue-700 leading-tight">Verified Top Creator</p>
                    </div>
                  </div>
                )}

                {influencer.isPucAngel && (
                  <div className="p-3 bg-slate-900 rounded-xl flex items-center gap-3 text-white border border-slate-800 shadow-sm relative overflow-hidden">
                    <div className="bg-white/10 p-1.5 rounded-lg flex items-center justify-center">
                      <span className="text-sm">🦋</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">PUC Angels Associate</h4>
                      <p className="text-[10px] text-slate-400 leading-tight">Official Partner</p>
                    </div>
                    <div className="absolute top-0 right-0 p-1 bg-purple-600 rounded-bl-lg shadow-sm flex items-center justify-center" title="Socially Conscious">
                      <Users className="w-3 h-3 text-white" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-10">

            {/* Linkedin Profile Header Info */}
            <section className="bg-white rounded-2xl p-6 border border-gray-100 relative">
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{influencer.name}</h2>
                  <p className="text-gray-900 font-medium mt-1">Content Creator at Tech Innovations Inc.</p>
                  <InfluencerBadges
                    isPucAngel={influencer.isPucAngel}
                    verified={influencer.verified}
                    highEngagement={influencer.highEngagement}
                  />
                  <p className="text-gray-500 text-sm mt-1">{influencer.location}</p>
                  <div className="mt-3 flex items-center gap-1 text-sm text-gray-600">
                    <span className="font-semibold text-gray-900">Main topic of content:</span>
                    <span>Fintech Market and Education</span>
                  </div>
                </div>

                <div className="space-y-2 mt-2 md:mt-0 min-w-[200px]">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-8 h-8 p-1.5 bg-gray-100 text-gray-600 rounded" />
                    <span className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">Tech Innovations Inc.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-8 h-8 p-1.5 bg-gray-100 text-gray-600 rounded" />
                    <span className="text-sm font-semibold text-gray-900 hover:text-blue-600 cursor-pointer">Stanford University</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Packages Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" />
                Packages
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                When you click &quot;Book Now&quot;, your interest is sent only to the Influencer Circle
                team. We will review your request and contact you with the next steps; the influencer
                does not receive this email directly.
              </p>
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                {packages.map((pkg) => {
                  const email = "social@hackneuro.com";
                  const subject = encodeURIComponent(
                    `Influencer interest - ${influencer.name} - ${pkg.name}`
                  );
                  const body = encodeURIComponent(
                    `Hi Influencer Circle team,\n\nI would like to register my interest in ${influencer.name} for the package "${pkg.name}" (${pkg.price}). This message is for your internal review only; the influencer should not receive this email directly.\n\nPlease get in touch with me to discuss the next steps.\n\nBest regards,\n[Your name]\n[Organization]\n[Preferred contact channel]`
                  );
                  const emailHref = `mailto:${email}?subject=${subject}&body=${body}`;

                  return (
                    <div
                      key={pkg.id}
                      className={`bg-white rounded-2xl p-6 border transition-all hover:shadow-md cursor-pointer relative ${pkg.popular ? "border-black ring-1 ring-black shadow-sm" : "border-gray-200"
                        }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                          MOST POPULAR
                        </div>
                      )}
                      <h3 className="font-bold text-gray-900 mb-1">{pkg.name}</h3>
                      <div className="text-2xl font-bold text-gray-900 mb-3">{pkg.price}</div>
                      <p className="text-sm text-gray-500 mb-4 h-10">{pkg.description}</p>

                      <div className="space-y-2 mb-6">
                        {pkg.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center gap-1 text-xs text-gray-400 mb-4">
                        <Clock className="w-3 h-3" />
                        Delivery: {pkg.delivery}
                      </div>

                      <a
                        href={emailHref}
                        className={`w-full inline-flex items-center justify-center py-2.5 rounded-lg font-medium text-sm transition-colors ${pkg.popular
                            ? "bg-black text-white hover:bg-gray-800"
                            : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                          }`}
                      >
                        Book Now
                      </a>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Linkedin Portfolio Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Linkedin className="w-5 h-5 text-[#0077b5]" />
                Linkedin Portfolio
              </h2>
              <div className="space-y-4">
                {[0, 1].map((postIndex) => (
                  <div key={postIndex} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    {/* Header */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative w-10 h-10 shrink-0">
                        <Image
                          src={influencer.image}
                          alt={influencer.name}
                          fill
                          className="object-cover rounded-full"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-1">
                          <h3 className="text-sm font-semibold text-gray-900">{influencer.name}</h3>
                          <span className="text-gray-400 text-xs">• 1st</span>
                        </div>
                        <p className="text-xs text-gray-500">{influencer.categories[0]} Enthusiast • 2d • Edited</p>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="text-sm text-gray-800 mb-3 space-y-2">
                      <p>Excited to announce my latest partnership! 🚀</p>
                      <p>Working with innovative brands allows me to share the best tools and strategies with my network. The future of {influencer.categories.join(" & ")} is looking bright and I'm here for it.</p>
                      <p className="text-blue-600 font-medium">#{influencer.categories[0]} #Innovation #Growth</p>
                    </div>

                    {/* Image Placeholder */}
                    <div className="w-full h-64 bg-gray-100 rounded-lg mb-3 relative overflow-hidden border border-gray-100">
                      <Image
                        src={portfolioImages[postIndex]}
                        alt="Post content"
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium transition-colors">
                        <ThumbsUp className="w-4 h-4" />
                        <span className="hidden sm:inline">Like</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium transition-colors">
                        <MessageSquare className="w-4 h-4" />
                        <span className="hidden sm:inline">Comment</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium transition-colors">
                        <Share2 className="w-4 h-4" />
                        <span className="hidden sm:inline">Repost</span>
                      </button>
                      <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-50 px-2 py-1 rounded text-sm font-medium transition-colors">
                        <Send className="w-4 h-4" />
                        <span className="hidden sm:inline">Send</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Portfolio Section */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Instagram className="w-5 h-5 text-[#E1306C]" />
                Instagram Portfolio
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {portfolioImages.map((img, i) => (
                  <div key={i} className="aspect-[4/5] relative group overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={img}
                      alt={`Portfolio item ${i + 1}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                  </div>
                ))}
              </div>
            </section>

            {/* About Section */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About Me</h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p className="mb-4">
                  Hi! I'm {influencer.name}, a content creator based in {influencer.location}.
                  I specialize in {influencer.categories[0]} content and love helping brands tell their story through engaging social media campaigns.
                </p>
                <p>
                  With a strong following on LinkedIn, I focus on creating authentic content that resonates with my audience.
                  My engagement rates are consistently high because I only partner with brands I truly believe in.
                </p>
                <p className="mt-4 font-medium text-gray-900">
                  Let's create something amazing together!
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
