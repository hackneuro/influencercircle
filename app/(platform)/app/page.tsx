import { ArrowRight, Trophy, Users, ShieldCheck, BarChart3, PieChart, DollarSign, MapPin, TrendingUp, CheckCircle, Linkedin, Instagram, Heart } from "lucide-react";
import Link from "next/link";
import { INFLUENCERS } from "@/lib/data";

export default function HomePage() {
  // Randomly select 8 influencers to display
  const displayedInfluencers = [...INFLUENCERS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 8);

  return (
    <main className="space-y-10">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/graphy.png')" }} />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600" />
        <div className="relative p-8 md:p-12 lg:p-16">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-6 leading-tight">
              The Influencer Circle Platform (version 2.03). <span className="text-blue-600">Start growing your network today.</span>
            </h1>
            <div className="text-lg text-slate-600 space-y-5 leading-relaxed">
              <p className="font-medium">
                Strategic engagement, human-checked comments, and growth dashboards designed for professionals that want to stand out.
              </p>
              <p>
                Cross-Engagement that works and boosts your profile so you may become known in your market.
              </p>
              <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border border-slate-100 italic">
                <span className="text-blue-600 font-bold">💡</span>
                <p>A place where Brands can find you to help them promote a product/service.</p>
              </div>
              <p className="font-semibold text-slate-900 border-l-4 border-blue-600 pl-4">
                All in one place. What are you waiting for? Get in.
              </p>
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/onboarding" className="btn btn-primary px-8">
                Get Started for Free Now
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/onboarding" className="btn btn-outline px-8 transition-all hover:translate-y-[-2px]">
                Brand/ Campaign
              </Link>
              <Link href="/dashboard" className="btn btn-outline px-8 transition-all hover:translate-y-[-2px]">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Influencer Grid - HIDDEN FOR NOW */}
      {false && (
      <section>
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Executives/ Influencers already in the Circle</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {displayedInfluencers.map(inf => (
          <Link href="/onboarding" key={inf.id} className="group relative bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col">
            {/* Image Container */}
            <div className="relative aspect-square overflow-hidden shrink-0">
              <img
                src={inf.image}
                alt={inf.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Top Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {inf.verified && (
                  <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 border border-slate-200/50 shadow-sm flex items-center gap-1 w-fit">
                    <TrendingUp className="h-3 w-3 text-blue-600" />
                    Elite Member
                  </span>
                )}
              </div>

              {inf.verified && (
                <div className="absolute top-4 right-4">
                  <CheckCircle className="h-6 w-6 text-blue-500 fill-white drop-shadow-md" />
                </div>
              )}

              {/* PUC Angels Badge - Bottom & Transparent */}
              {inf.isPucAngel && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4 flex justify-center z-10">
                  <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm flex items-center gap-1 w-fit">
                    <span className="text-yellow-400">🦋</span>
                    PUC angels associate
                  </span>
                </div>
              )}
            </div>

            {/* Info section */}
            <div className="p-5 space-y-4 flex-1 flex flex-col">
              <div className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm text-center">
                View Profile
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
                  {inf.name}
                  <span className="text-base">{inf.flag}</span>
                </h3>
                <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                  <span className="text-slate-400 text-[10px] font-medium mr-1 uppercase tracking-widest">START </span>
                  {inf.price}
                </p>
              </div>

              {/* Platform Stats */}
              <div className="space-y-2">
                {/* LinkedIn */}
                <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#0077b5]/10 p-1.5 rounded-md">
                      <Linkedin className="h-3.5 w-3.5 text-[#0077b5]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">LinkedIn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Users className="h-3 w-3 text-slate-400" />
                      {inf.stats.linkedin.followers}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Heart className="h-3 w-3 text-red-400" />
                      {inf.stats.linkedin.engagement}
                    </div>
                  </div>
                </div>

                {/* Instagram */}
                {/* <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#E1306C]/10 p-1.5 rounded-md">
                      <Instagram className="h-3.5 w-3.5 text-[#E1306C]" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Instagram</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Users className="h-3 w-3 text-slate-400" />
                      {inf.stats.instagram.followers}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                      <Heart className="h-3 w-3 text-red-400" />
                      {inf.stats.instagram.engagement}
                    </div>
                  </div>
                </div> */}
              </div>

              <div className="flex items-center gap-1 text-slate-400 text-xs font-medium pt-1">
                <MapPin className="h-3 w-3" />
                {inf.location}
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {inf.tags.map(tag => (
                  <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
        </div>
      </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card p-6 border-l-4 border-blue-500">
          <div className="bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <Trophy className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">The only Guaranteed Success Platform</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            30 to 100+ Guaranteed Engagements (Likes/ Comments/ Saves) from verified real people's profile.
          </p>
        </div>
        <div className="card p-6 border-l-4 border-indigo-500">
          <div className="bg-indigo-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <Users className="h-6 w-6 text-indigo-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Cross Engagement Boost</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Real people engaging with your content and profile and you making strategical engagments to make your profile jump to the top.
          </p>
        </div>
        <div className="card p-6 border-l-4 border-slate-800">
          <div className="bg-slate-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-slate-900" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Secure: No password needed</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            You log in your LinkedIn directly on our platform and unlog whenever you want.
          </p>
        </div>
        <div className="card p-6">
          <div className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <BarChart3 className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">LInkedin SSI Tracking</h3>
          <p className="text-sm text-slate-500 leading-relaxed">Track Social Selling Index daily with growth insights.</p>
        </div>
        <div className="card p-6">
          <div className="bg-slate-50 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <PieChart className="h-6 w-6 text-slate-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Analytics</h3>
          <p className="text-sm text-slate-500 leading-relaxed">View profile and content performance summaries.</p>
        </div>
        <div className="card p-6 border-l-4 border-green-500 bg-green-50/30">
          <div className="bg-green-100 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
            <DollarSign className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-bold text-slate-900 mb-2">Earn money as an Influencer</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Brands/ Companies will access your profile and content and propose content sponsorships.
          </p>
        </div>
      </section>
    </main>
  );
}
