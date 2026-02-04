"use client";
import { Linkedin, Instagram, MessageSquare as WhatsApp, Target, User, ShoppingBag, Crown } from "lucide-react";
import Link from "next/link";

export default function DashboardNav() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-2 mb-4">
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/linkedin">
        <Linkedin className="h-5 w-5 text-blue-600" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">Linkedin<br />Controls/Stats</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/instagram">
        <Instagram className="h-5 w-5 text-pink-600" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">Instagram<br />Controls/Stats</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/messaging">
        <WhatsApp className="h-5 w-5 text-[#25D366]" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">Connected message<br />Controls/Stats</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/sales">
        <Target className="h-5 w-5 text-indigo-600" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight">Sales Controls<br />(Stats and Funnel)</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/profile">
        <User className="h-5 w-5 text-orange-600" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight text-orange-700">Profile ID Control</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/market">
        <ShoppingBag className="h-5 w-5 text-amber-600" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight text-amber-900">Influencer<br />Market</span>
      </Link>
      <Link className="btn btn-outline flex flex-col items-center gap-1 p-2 h-auto min-h-0" href="/dashboard/puc-angels">
        <Crown className="h-5 w-5 text-yellow-500" />
        <span className="text-[10px] font-bold uppercase tracking-tight text-center leading-tight text-yellow-700">
          PUC angels<br />Edu ONG Brazil <span className="text-base align-middle">🇧🇷</span>
        </span>
      </Link>
    </div>
  );
}
