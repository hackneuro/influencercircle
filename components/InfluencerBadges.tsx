"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldCheck, TrendingUp, X, ChevronRight, Users } from "lucide-react";

type InfluencerBadgesProps = {
  isPucAngel?: boolean;
  verified?: boolean;
  highEngagement?: boolean;
};

const REGIONS = [
  { id: "usa", label: "USA" },
  { id: "brazil", label: "Brazil" },
  { id: "puc-angels", label: "PUC angels (Participants)" },
  { id: "europe", label: "Europe" },
  { id: "india", label: "India" },
  { id: "australia", label: "Australia" },
  { id: "rest-of-asia", label: "Rest of Asia" },
  { id: "colombia", label: "Colombia" },
  { id: "argentina", label: "Argentina" },
  { id: "mexico", label: "Mexico" },
  { id: "chile", label: "Chile" },
  { id: "latin-america", label: "Latin America" },
  { id: "other", label: "Other" },
];

export default function InfluencerBadges({ isPucAngel, verified, highEngagement }: InfluencerBadgesProps) {
  const router = useRouter();
  const [activeModal, setActiveModal] = useState<"puc" | "elite" | "high-engagement" | "socially-conscious" | null>(null);
  const [showRegionSelect, setShowRegionSelect] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEliteClick = () => {
    setActiveModal("elite");
    setShowRegionSelect(false);
  };

  const handleRegionSelect = (regionId: string) => {
    router.push(`/onboarding/elite-pricing?region=${regionId}`);
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 mt-2 mb-1">
        {isPucAngel && (
          <button
            onClick={() => setActiveModal("puc")}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left"
          >
            <Image
              src="/puc-angels-logo.svg"
              alt="PUC Angels"
              width={20}
              height={20}
              className="object-contain"
            />
            <span className="text-xs font-bold text-[#000080]">PUC Angels Participant</span>
          </button>
        )}
        {isPucAngel && (
          <button
            onClick={() => setActiveModal("socially-conscious")}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left"
          >
            <Users className="w-5 h-5 text-purple-600" />
            <span className="text-xs font-bold text-purple-900">Socially Conscious</span>
          </button>
        )}
        {verified && (
          <button
            onClick={handleEliteClick}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left"
          >
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold text-blue-900">Elite Member</span>
          </button>
        )}
        {highEngagement && (
          <button
            onClick={() => setActiveModal("high-engagement")}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity text-left"
          >
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-xs font-bold text-green-900">High Engagement Achiever</span>
          </button>
        )}
      </div>

      {/* Modal Overlay */}
      {activeModal && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div 
            className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>

            {/* PUC Angels Content */}
            {activeModal === "puc" && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Image
                    src="/puc-angels-logo.svg"
                    alt="PUC Angels"
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <h3 className="text-xl font-bold text-[#000080]">PUC Angels Participant</h3>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    This Badge shows that this Influencer is socially engaged and therefore can agregate a better image to campaigns. Not only he believes in a cause, he invest money into it.
                  </p>
                  <p className="font-medium text-gray-900">
                    Do you want to have this badge? Associate yourself to PUC angels (less then a lunch price per month) and help the mission of making the world a better place through education.
                  </p>
                  
                  <div className="flex flex-col gap-3 pt-2">
                    <button className="w-full bg-[#000080] text-white py-3 px-4 rounded-xl font-medium hover:bg-[#000060] transition-colors text-center">
                      Click here to donate (monthly donations)
                    </button>
                    <Link 
                      href="https://www.pucangels.org" 
                      target="_blank"
                      className="w-full bg-white border border-[#000080] text-[#000080] py-3 px-4 rounded-xl font-medium hover:bg-blue-50 transition-colors text-center"
                    >
                      Click here to learn more about their cause
                    </Link>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl mt-4">
                    <p className="mb-2 font-semibold text-gray-900">There is more than just donation, you can:</p>
                    <p className="text-xs leading-relaxed">
                      Mentor Startups, participate in social activities, submit your project for investment, get help on getting a job through Executive Impulse program. It is strongly in Brazil but it receives donation from all over the world.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Socially Conscious Content */}
            {activeModal === "socially-conscious" && (
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-purple-50 rounded-full">
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-purple-900">Socially Conscious</h3>
                </div>
                
                <div className="space-y-4 text-sm text-gray-600">
                  <p>
                    Welcome to the new age of Human kind, where everything is connected. 
                    Everything we do must be socially concious and we incentivize our participants to do the same.
                  </p>
                  <p>
                    This influencer is already donating to a social cause so that a piece of his earnings goes into helping the world. This is a human evolution and therefore, this influencer has a better image. If you want to do the same choose a Social Cause we have homologated:
                  </p>
                  
                  <button 
                    onClick={() => setActiveModal("puc")}
                    className="w-full text-left p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors border border-purple-100 group"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src="/puc-angels-logo.svg"
                        alt="PUC Angels"
                        width={24}
                        height={24}
                        className="object-contain"
                      />
                      <span className="font-bold text-[#000080]">PUC angels</span>
                    </div>
                    <p className="text-xs text-gray-600 group-hover:text-gray-900">
                      Donate less than a lunch value per month to heir cause - making the world better through education
                    </p>
                  </button>

                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <p className="mb-2">
                      Do you want to present another social cause so that we can homologate and offers to others?
                    </p>
                    <p>
                      Please send an email to <a href="mailto:social@hackneuro.com" className="text-purple-600 hover:underline font-medium">social@hackneuro.com</a> (all social cause must be approved to prevent deception).
                    </p>
                    <a 
                      href="mailto:social@hackneuro.com"
                      className="inline-block mt-2 text-xs font-bold text-purple-600 hover:text-purple-800 uppercase tracking-wide"
                    >
                      Send e-mail for more information
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Elite Member Content */}
                    {activeModal === "elite" && (
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-blue-50 rounded-full">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                          </div>
                          <h3 className="text-xl font-bold text-blue-900">Elite Member</h3>
                        </div>
                        
                        {!showRegionSelect ? (
                          <div className="space-y-6 text-sm text-gray-600">
                            <p>
                              Elite Members are offered first and, because they have a higher engagement level in our platform they intend to give better results to Brand and clients.
                            </p>
                            <p className="font-medium text-gray-900">
                              Start building your profile engagement now with the Elite Member format.
                            </p>
                            
                            <button 
                              onClick={() => setShowRegionSelect(true)}
                              className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                            >
                              Upgrade to Elite
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
                            <h4 className="font-semibold text-gray-900">Select your region</h4>
                            <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2">
                              {REGIONS.map((region) => (
                                <button
                                  key={region.id}
                                  onClick={() => handleRegionSelect(region.id)}
                                  className="flex items-center justify-between p-3 text-sm text-left border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors group"
                                >
                                  <span className="text-gray-700 group-hover:text-blue-700">{region.label}</span>
                                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500" />
                                </button>
                              ))}
                            </div>
                            <button 
                              onClick={() => setShowRegionSelect(false)}
                              className="text-xs text-gray-500 hover:text-gray-900 hover:underline mt-2"
                            >
                              Back
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* High Engagement Content */}
                    {activeModal === "high-engagement" && (
                      <div className="p-6 sm:p-8">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 bg-green-50 rounded-full">
                            <TrendingUp className="w-8 h-8 text-green-600" />
                          </div>
                          <h3 className="text-xl font-bold text-green-900">High Engagement Achiever</h3>
                        </div>
                        
                        <div className="space-y-6 text-sm text-gray-600">
                          <p>
                            This influencer/ creator, on more than one past campaigns, gave high engagement returns. Please note that all campaigns are also incetivized by our cross-engagement platform (ViralMind) but, on top of that, this Influencer gave very good results through his network.
                          </p>
                          
                          <button className="w-full bg-green-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-200">
                            Make a proposition for this Influencer
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>,
                document.body
              )}
    </>
  );
}
