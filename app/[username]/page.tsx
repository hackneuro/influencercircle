import { notFound } from "next/navigation";
import type { ProfileRow } from "@/types/database";
import { getPublicProfile } from "@/services/profileService";
import { createClient } from "@supabase/supabase-js";
import HireCampaignButton from "@/components/HireCampaignButton";
import { 
  MapPin, 
  Linkedin, 
  Instagram, 
  Mail, 
  Phone, 
  FileText, 
  Globe, 
  CheckCircle, 
  Briefcase, 
  Target,
  Download,
  Calendar,
  User,
  Image as ImageIcon
} from "lucide-react";

type PageProps = {
  params: Promise<{
    username: string;
  }>;
};

type ProfileExtras = {
  tiktok_url?: string;
  x_url?: string;
  banner_url?: string;
  gallery_urls?: string[];
  expertise?: string;
};

async function getProfileExtras(profileId: string): Promise<ProfileExtras> {
  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: blob } = await supabaseAdmin.storage.from("profile-extras").download(`${profileId}.json`);
    if (!blob) return {};
    const text = await blob.text();
    const json = JSON.parse(text);
    return {
      tiktok_url: typeof json?.tiktok_url === "string" ? json.tiktok_url : "",
      x_url: typeof json?.x_url === "string" ? json.x_url : "",
      banner_url: typeof json?.banner_url === "string" ? json.banner_url : "",
      gallery_urls: Array.isArray(json?.gallery_urls) ? json.gallery_urls.map((u: any) => String(u || "")).filter(Boolean).slice(0, 5) : [],
      expertise: typeof json?.expertise === "string" ? json.expertise : ""
    };
  } catch {
    return {};
  }
}

function EliteBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-200">
      <CheckCircle className="h-3 w-3" />
      Elite Member
    </span>
  );
}

function RoleBadge({ role }: { role: string }) {
  if (role === 'influencer') {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
        Creator / Influencer
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </span>
  );
}

function PublicProfileView({ profile, extras }: { profile: ProfileRow; extras: ProfileExtras }) {
  const hasSocials = profile.linkedin_url || profile.instagram_url || profile.resume_url || extras.tiktok_url || extras.x_url;
  const hasLocation = profile.city || profile.state || profile.country;
  const locationString = [profile.city, profile.state, profile.country].filter(Boolean).join(", ");
  const howSeenOptions = ["executive", "influencer", "student", "beginner"];
  const howSeen = (profile.user_types || []).find((v) => howSeenOptions.includes(v));
  const howSeenLabel =
    howSeen === "executive" ? "Executive" :
    howSeen === "influencer" ? "Influencer" :
    howSeen === "student" ? "Student" :
    howSeen === "beginner" ? "Beginner" :
    "";

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      {/* Header / Cover Area */}
      <div className="h-48 md:h-64 bg-gradient-to-r from-slate-900 to-slate-800 w-full relative overflow-hidden">
        {extras.banner_url ? (
          <img src={extras.banner_url} alt="Banner" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}></div>
        )}
        <div className="absolute inset-0 bg-slate-900/40" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative">
        <div className="flex flex-col md:flex-row gap-6 items-start">
          
          {/* Profile Picture */}
          <div className="shrink-0 relative">
            <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white shadow-lg bg-white overflow-hidden">
              {profile.image ? (
                <img 
                  src={profile.image} 
                  alt={profile.name} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <img 
                  src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=400&fit=crop" 
                  alt="Default Profile" 
                  className="w-full h-full object-cover opacity-80"
                />
              )}
            </div>
            {profile.is_premium && (
               <div className="absolute bottom-2 right-2 bg-blue-600 text-white p-1.5 rounded-full border-2 border-white shadow-sm" title="Verified Elite Member">
                 <CheckCircle className="h-4 w-4" />
               </div>
            )}
          </div>

          {/* Header Info */}
          <div className="flex-1 pt-2 md:pt-32 space-y-2 text-center md:text-left">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <h1 className="text-3xl font-bold text-slate-900">{profile.name}</h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-2">
                    {profile.is_premium && <EliteBadge />}
                    {profile.role && <RoleBadge role={profile.role} />}
                  </div>
                </div>
                <p className="text-slate-500 font-medium">@{profile.username}</p>
                {locationString && (
                  <div className="flex items-center justify-center md:justify-start gap-1 text-slate-600 text-sm">
                    <MapPin className="h-4 w-4 shrink-0" />
                    {locationString}
                  </div>
                )}
                {howSeenLabel && (
                  <div className="text-slate-600 text-sm font-semibold">
                    {howSeenLabel}
                  </div>
                )}
              </div>

              {/* Action Buttons (Desktop) */}
              <div className="hidden md:flex flex-col gap-3 shrink-0">
                <HireCampaignButton
                  targetUsername={String(profile.username || "")}
                  targetName={profile.name}
                  targetProfileId={profile.id}
                />
                {profile.resume_url && (
                  <a 
                    href={profile.resume_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Action Buttons */}
        <div className="md:hidden mt-6 flex flex-col gap-3">
           <HireCampaignButton
             targetUsername={String(profile.username || "")}
             targetName={profile.name}
             targetProfileId={profile.id}
           />
           {profile.resume_url && (
              <a 
                href={profile.resume_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-semibold rounded-xl hover:bg-slate-800 transition-colors shadow-sm w-full"
              >
                <Download className="h-4 w-4" />
                Download CV
              </a>
            )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
          
          {/* Left Sidebar */}
          <div className="space-y-6">
            
            {/* Contact & Socials */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                Connect
              </h2>
              
              <div className="space-y-3">
                {profile.resume_url && (
                  <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                    <div className="bg-slate-900 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Download CV</span>
                      <span className="block text-xs text-slate-500">Resume / CV</span>
                    </div>
                  </a>
                )}
                {profile.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                    <div className="bg-[#0077b5] p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <Linkedin className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">LinkedIn</span>
                      <span className="block text-xs text-slate-500">Professional Profile</span>
                    </div>
                  </a>
                )}
                
                {profile.instagram_url && (
                  <a href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                    <div className="bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <Instagram className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">Instagram</span>
                      <span className="block text-xs text-slate-500">Social Portfolio</span>
                    </div>
                  </a>
                )}

                {extras.tiktok_url && (
                  <a href={extras.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                    <div className="bg-black p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M14 3v10.2a3.8 3.8 0 1 1-3-3.72V6.5c-.35-.07-.72-.1-1.1-.1A6.4 6.4 0 1 0 16.4 12V7.9c1.2.9 2.7 1.5 4.4 1.6V6.6c-2.1-.2-3.9-1.5-4.5-3.6H14Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">TikTok</span>
                      <span className="block text-xs text-slate-500">Short-form Content</span>
                    </div>
                  </a>
                )}

                {extras.x_url && (
                  <a href={extras.x_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group border border-transparent hover:border-slate-200">
                    <div className="bg-black p-2 rounded-lg text-white group-hover:scale-110 transition-transform">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M18.9 2H22l-7.6 8.7L23 22h-7l-5.5-7.2L4.2 22H1l8.2-9.4L1 2h7.2l5 6.6L18.9 2Zm-1.2 18h1.7L6.2 3.9H4.4L17.7 20Z" fill="currentColor" />
                      </svg>
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">X</span>
                      <span className="block text-xs text-slate-500">Updates & Threads</span>
                    </div>
                  </a>
                )}

                {profile.email && profile.show_email && (
                  <div className="flex items-center gap-3 p-3">
                    <div className="bg-slate-100 p-2 rounded-lg text-slate-600">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="overflow-hidden">
                      <span className="block text-sm font-semibold text-slate-900">Email</span>
                      <span className="block text-xs text-slate-500 truncate" title={profile.email}>{profile.email}</span>
                    </div>
                  </div>
                )}

                {profile.whatsapp && profile.show_phone && (
                  <div className="flex items-center gap-3 p-3">
                    <div className="bg-green-100 p-2 rounded-lg text-green-600">
                      <Phone className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="block text-sm font-semibold text-slate-900">WhatsApp</span>
                      <span className="block text-xs text-slate-500">{profile.whatsapp}</span>
                    </div>
                  </div>
                )}

                {!hasSocials && !profile.email && !profile.whatsapp && (
                  <p className="text-sm text-slate-500 italic">No public contact info.</p>
                )}
              </div>
            </section>

            {/* Details Card */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
               <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-orange-500" />
                Details
              </h2>
              
              <div className="space-y-4 text-sm">
                 {profile.region && (
                   <div>
                     <span className="block text-xs font-semibold text-slate-500 uppercase">Area</span>
                     <span className="text-slate-900">{profile.region}</span>
                   </div>
                 )}
                 {extras.expertise && (
                   <div>
                     <span className="block text-xs font-semibold text-slate-500 uppercase">Expertise</span>
                     <span className="text-slate-900">{extras.expertise}</span>
                   </div>
                 )}
                 {profile.average_content_price && profile.average_content_price > 0 && (
                   <div>
                     <span className="block text-xs font-semibold text-slate-500 uppercase">Avg. Content Price</span>
                     <span className="text-slate-900 font-medium">${profile.average_content_price} USD</span>
                   </div>
                 )}
                 <div>
                   <span className="block text-xs font-semibold text-slate-500 uppercase">Member Since</span>
                   <span className="text-slate-900 flex items-center gap-1">
                     <Calendar className="h-3 w-3 text-slate-400" />
                     {new Date(profile.created_at).toLocaleDateString()}
                   </span>
                 </div>
              </div>
            </section>

          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {extras.gallery_urls && extras.gallery_urls.length > 0 && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-4">
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-indigo-500" />
                  Photos
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {extras.gallery_urls.slice(0, 5).map((url, idx) => (
                    <div key={`${url}-${idx}`} className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
                      <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-28 object-cover" />
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {/* About Section */}
            <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="h-5 w-5 text-slate-400" />
                About Me
              </h2>
              <div className="prose prose-slate max-w-none">
                <p className="text-slate-600 leading-relaxed whitespace-pre-line">
                  {profile.about_yourself || profile.bio || "This user hasn't written a bio yet."}
                </p>
              </div>

              {/* Tags */}
              {(profile.tags && profile.tags.length > 0) && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="text-sm font-bold text-slate-900 mb-3">Skills & Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Objectives Section */}
            {(profile.objective || profile.market_objective || profile.location_objective) && (
              <section className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Target className="h-5 w-5 text-red-500" />
                  Professional Objectives
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.objective && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Primary Goal</span>
                      <span className="font-semibold text-slate-900">{profile.objective}</span>
                    </div>
                  )}
                  {profile.market_objective && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Market</span>
                      <span className="font-semibold text-slate-900">{profile.market_objective}</span>
                    </div>
                  )}
                  {profile.location_objective && (
                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 md:col-span-2">
                      <span className="block text-xs font-bold text-slate-400 uppercase mb-1">Target Location</span>
                      <span className="font-semibold text-slate-900">{profile.location_objective}</span>
                    </div>
                  )}
                </div>
              </section>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PublicProfilePage({ params }: PageProps) {
  const resolved = await params;
  const username = resolved.username.replace(/^@/, "");
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  if (!profile.is_public) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-100 p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <User className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Private Profile
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              The owner of this profile chose not to make it publicly visible.
            </p>
          </div>
        </div>
      </main>
    );
  }

  const extras = await getProfileExtras((profile as ProfileRow).id);
  return <PublicProfileView profile={profile as ProfileRow} extras={extras} />;
}
