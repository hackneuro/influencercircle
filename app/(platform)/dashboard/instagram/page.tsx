import { TrendingUp, Users, Eye, BarChart2, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import UnlogInstagramButton from "@/components/UnlogInstagramButton";

export default function InstagramDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
        <p className="font-semibold">Funcionalidade não disponível para sua região.</p>
      </div>
        {/* Instagram features temporarily disabled */}
      {false && ( <>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold flex-1">
          Create content
        </button>

        <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold flex-1">
          Send us a Content to increase engagement
        </button>
        <div className="group relative flex-1">
          <button className="w-full btn bg-blue-600 hover:bg-blue-700 text-white border-transparent font-bold">
            Turn on Radar
          </button>
          <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-3 bg-slate-900 text-white text-xs rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 text-center shadow-xl">
            if you are a local business monitor the location target and engage with post in your area to increase sales/ followers to your Instagram
            <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end items-center">
            <UnlogInstagramButton />
        </div>
      </div>

      {/* Profile Header */}
      <div className="card p-6">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-pink-100 shrink-0">
            <Image
              src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&q=80"
              alt="Profile"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <h1 className="text-2xl font-bold text-slate-900">fernandoscdias</h1>
              <div className="flex gap-6 text-sm">
                <div className="text-center md:text-left">
                  <span className="font-bold text-slate-900">623</span> posts
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold text-slate-900">15.1K</span> followers
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold text-slate-900">809</span> following
                </div>
              </div>
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Fernando Dias</h2>
              <p className="text-slate-600">Fundador e Presidente Institucional da <span className="text-blue-600">@pucangels</span></p>
              <p className="text-slate-600">Educação é o melhor caminho para evoluir o mundo!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Account Insights */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900">Account insights</h3>
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Eye className="w-4 h-4" />
              <span>Views 1,136</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Accounts reached 145</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Followers</span>
                    <span className="font-medium text-slate-900">41.9%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-pink-500 h-2 rounded-full" style={{ width: '41.9%' }}></div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm mt-4">
                    <span className="text-slate-600">Non-followers</span>
                    <span className="font-medium text-slate-900">58.1%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '58.1%' }}></div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">By content type (All)</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Posts</span>
                    <span className="font-bold text-slate-900">88.0%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-slate-600">Stories</span>
                    <span className="font-bold text-slate-900">12.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Followers Engagement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-pink-50 rounded-lg">
                    <span className="text-slate-600">Posts</span>
                    <span className="font-bold text-pink-700">73.8%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-pink-50 rounded-lg">
                    <span className="text-slate-600">Stories</span>
                    <span className="font-bold text-pink-700">26.2%</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Non-followers Engagement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-slate-600">Posts</span>
                    <span className="font-bold text-blue-700">90%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                    <span className="text-slate-600">Stories</span>
                    <span className="font-bold text-blue-700">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Growth Stats */}
        <div className="card p-6 bg-gradient-to-br from-pink-500 to-orange-500 text-white">
          <h3 className="text-lg font-bold mb-6">Growth</h3>
          <div className="text-4xl font-bold mb-2">15,128</div>
          <div className="text-white/80 text-sm mb-8">Total Followers</div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-sm font-medium">From yesterday</span>
              <div className="flex items-center gap-1 font-bold text-green-300">
                <TrendingUp className="w-4 h-4" />
                +5%
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-sm font-medium">From one week</span>
              <div className="flex items-center gap-1 font-bold text-green-300">
                <TrendingUp className="w-4 h-4" />
                +20%
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <span className="text-sm font-medium">From one month</span>
              <div className="flex items-center gap-1 font-bold text-green-300">
                <TrendingUp className="w-4 h-4" />
                +150%
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Content */}
        <div className="card p-6 lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Top content based on views</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="aspect-[9/16] relative bg-slate-100 rounded-xl overflow-hidden group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=600&fit=crop&q=80"
                alt="Top content 1"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white font-medium">Image 01</span>
                <span className="text-white/80 text-xs block">Dec 23</span>
              </div>
            </div>
            <div className="aspect-[9/16] relative bg-slate-100 rounded-xl overflow-hidden group cursor-pointer">
              <Image
                src="https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400&h=600&fit=crop&q=80"
                alt="Top content 2"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <span className="text-white font-medium">Image 02</span>
                <span className="text-white/80 text-xs block">Dec 25</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Interactions Board */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">Interactions Board</h3>
              <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">16 Interactions</span>
            </div>

            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Audience Split</h4>
                <div className="flex gap-2">
                  <div className="flex-1 p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-slate-900">56.3%</div>
                    <div className="text-xs text-slate-500">Followers</div>
                  </div>
                  <div className="flex-1 p-3 bg-slate-50 rounded-lg text-center">
                    <div className="text-lg font-bold text-slate-900">43.8%</div>
                    <div className="text-xs text-slate-500">Non-followers</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">By Content</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-pink-500"></div>
                      <span className="text-sm text-slate-600">Posts</span>
                    </div>
                    <span className="font-bold text-slate-900">68.8%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-pink-500 h-1.5 rounded-full" style={{ width: '68.8%' }}></div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <span className="text-sm text-slate-600">Stories</span>
                    </div>
                    <span className="font-bold text-slate-900">31.3%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: '31.3%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Active Times */}
          <div className="card p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Most active times</h3>
            <div className="space-y-3">
              {[
                { time: '12a', count: 1251, pct: 90 },
                { time: '3a', count: 1386, pct: 99 },
                { time: '6a', count: 1358, pct: 97 },
                { time: '9a', count: 1399, pct: 100 },
                { time: '12p', count: 1370, pct: 98 },
                { time: '3p', count: 777, pct: 55 },
                { time: '6p', count: 730, pct: 52 },
                { time: '9p', count: 290, pct: 20 },
              ].map((item) => (
                <div key={item.time} className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-500 w-6">{item.time}</span>
                  <div className="flex-1 bg-slate-100 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-pink-500 to-orange-500 h-2 rounded-full opacity-80" 
                      style={{ width: `${item.pct}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 w-10 text-right">{item.count.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <a 
          href="https://www.instagram.com/accounts/insights/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn btn-outline gap-2"
        >
          More on Instagram Insights <ArrowRight className="w-4 h-4" />
        </a>
      </div>
      </> )}
    </div>
  );
}
