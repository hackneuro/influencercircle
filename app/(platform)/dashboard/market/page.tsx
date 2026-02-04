"use client";
import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, MapPin, CheckCircle, TrendingUp, Filter, Users, Heart, Linkedin, Instagram, Globe, ChevronDown, Briefcase, DollarSign, LayoutGrid, Camera, Lightbulb } from 'lucide-react';
import { CATEGORIES } from '@/lib/data';
import type { ProfileRow } from "@/types/database";
import { getInfluencers } from "@/services/marketplaceService";

export default function MarketPage() {
    const [influencers, setInfluencers] = useState<ProfileRow[]>([]);
    const [loadingInfluencers, setLoadingInfluencers] = useState(false);
    const [influencersError, setInfluencersError] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState("All");
    const [activeCountry, setActiveCountry] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [expertiseFilters, setExpertiseFilters] = useState<string[]>([]);
    const [appliedExpertiseFilters, setAppliedExpertiseFilters] = useState<string[]>([]);
    const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);

    const EXPERTISE_OPTIONS = ["All", "Creator", "Executive", "Advisor", "Investor"];

    useEffect(() => {
        let active = true;
        setLoadingInfluencers(true);
        setInfluencersError(null);
        getInfluencers()
            .then((data) => {
                if (!active) return;
                setInfluencers(data);
            })
            .catch((e: any) => {
                if (!active) return;
                setInfluencersError(e.message ?? "Failed to load influencers");
            })
            .finally(() => {
                if (!active) return;
                setLoadingInfluencers(false);
            });
        return () => {
            active = false;
        };
    }, []);

    const COUNTRIES = useMemo(
        () => [
            "All",
            ...Array.from(
                new Set(
                    influencers
                        .map(inf => inf.country || "")
                        .filter(Boolean)
                )
            ).sort()
        ],
        [influencers]
    );

    const toggleSelection = (id: string) => {
        if (selectedProfiles.includes(id)) {
            setSelectedProfiles(prev => prev.filter(p => p !== id));
        } else {
            if (selectedProfiles.length < 10) {
                setSelectedProfiles(prev => [...prev, id]);
            } else {
                alert("You can select up to 10 profiles.");
            }
        }
    };

    const filteredInfluencers = useMemo(
        () =>
            influencers.filter(inf => {
                const matchesCountry =
                    activeCountry === "All" || inf.country === activeCountry;
                const matchesSearch =
                    inf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    (inf.tags ?? []).some(c =>
                        c.toLowerCase().includes(searchQuery.toLowerCase())
                    );
                const roleTags: string[] = [];
                if (inf.role === "influencer") {
                    roleTags.push("Creator");
                }
                const matchesExpertise =
                    appliedExpertiseFilters.length === 0 ||
                    (inf.expertise || []).some((e: string) => appliedExpertiseFilters.includes(e));

                const matchesCategory =
                    activeCategory === "All" ||
                    (inf.tags ?? []).some(tag => tag === activeCategory);

                return matchesCategory && matchesCountry && matchesSearch && matchesExpertise;
            }),
        [influencers, activeCategory, activeCountry, searchQuery, appliedExpertiseFilters]
    );

    const toggleExpertise = (option: string) => {
        if (option === "All") {
            setExpertiseFilters([]);
            return;
        }
        setExpertiseFilters(prev =>
            prev.includes(option)
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const handleApplyExpertise = () => {
        setAppliedExpertiseFilters(expertiseFilters);
    };

    const getExpertiseIcon = (expertise: string, className: string = "h-4 w-4") => {
        switch (expertise) {
            case "All": return <LayoutGrid className={className} />;
            case "Creator": return <Camera className={className} />;
            case "Executive": return <Briefcase className={className} />;
            case "Advisor": return <Lightbulb className={className} />;
            case "Investor": return <DollarSign className={className} />;
            default: return <Users className={className} />;
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg">
                <p className="font-semibold">Funcionalidade não disponível para sua região.</p>
            </div>
            {/* Temporarily disabled per region lock */}
            {false && (
                <>
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Influencer Market</h1>
                    <p className="text-slate-500">Discover and partner with the world's best professional creators.</p>
                </div>
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search by name or category..."
                        className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all shadow-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/dashboard/market/campaign-opportunity" className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <Camera className="w-5 h-5" />
                    Post a content campaign opportunity
                </Link>
                <Link href="/dashboard/market/advisory-opportunity" className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <Lightbulb className="w-5 h-5" />
                    Post an Advisory opportunity
                </Link>
                <Link href="/dashboard/market/job-opportunity" className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                    <Briefcase className="w-5 h-5" />
                    Post a Job opportunity (fixed or temp)
                </Link>
            </div>

            {/* Filters Container */}
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {/* Expertise Filter */}
                <div className="mb-6 pb-6 border-b border-slate-200">
                    <label className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-3">
                        <Users className="h-4 w-4 text-blue-600" />
                        What Expertise are you looking for?
                    </label>
                    <div className="flex flex-wrap gap-4">
                        {EXPERTISE_OPTIONS.map((option) => {
                            const isSelected = option === "All" ? expertiseFilters.length === 0 : expertiseFilters.includes(option);
                            return (
                                <label key={option} className="flex items-center gap-2 cursor-pointer group">
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                                        {isSelected && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={isSelected}
                                        onChange={() => toggleExpertise(option)}
                                    />
                                    <span className={`text-sm font-medium transition-colors flex items-center gap-1.5 ${isSelected ? 'text-blue-900' : 'text-slate-600 group-hover:text-slate-900'}`}>
                                        {getExpertiseIcon(option, "h-3.5 w-3.5")}
                                        {option}
                                    </span>
                                </label>
                            );
                        })}
                    </div>

                    {/* Search Button for Expertise */}
                    <div className="mt-4">
                        <button
                            onClick={handleApplyExpertise}
                            className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
                        >
                            <Search className="w-4 h-4" />
                            Search with Expertise
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Category Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Filter className="h-4 w-4 text-blue-600" />
                            Category
                        </label>
                        <div className="relative group">
                            <select
                                value={activeCategory}
                                onChange={(e) => setActiveCategory(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer font-medium shadow-sm hover:border-blue-300"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>

                    {/* Country Dropdown */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
                            <Globe className="h-4 w-4 text-blue-600" />
                            Country
                        </label>
                        <div className="relative group">
                            <select
                                value={activeCountry}
                                onChange={(e) => setActiveCountry(e.target.value)}
                                className="w-full appearance-none bg-white border border-slate-200 text-slate-900 rounded-xl px-4 py-3 pr-10 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all cursor-pointer font-medium shadow-sm hover:border-blue-300"
                            >
                                {COUNTRIES.map(country => (
                                    <option key={country} value={country}>{country}</option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 pointer-events-none group-hover:text-blue-500 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Influencer Grid */}
            {loadingInfluencers && (
                <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">Loading influencers...</h3>
                        <p className="text-slate-500">Please wait while we load profiles from the network.</p>
                    </div>
                </div>
            )}
            {influencersError && !loadingInfluencers && (
                <div className="py-20 text-center space-y-4 bg-red-50 rounded-3xl border-2 border-dashed border-red-200">
                    <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-red-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-red-800">Failed to load influencers</h3>
                        <p className="text-red-600">{influencersError}</p>
                    </div>
                </div>
            )}
            {!loadingInfluencers && !influencersError && filteredInfluencers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-24">
                    {filteredInfluencers.map(inf => {
                        const isSelected = selectedProfiles.includes(inf.id);
                        return (
                            <div
                                key={inf.id}
                                onClick={() => toggleSelection(inf.id)}
                                className={`group relative bg-white rounded-3xl overflow-hidden border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col ${isSelected ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-slate-100'}`}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-square overflow-hidden shrink-0">
                                    <img
                                        src={inf.image || "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&auto=format&fit=crop&q=60"}
                                        alt={inf.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />

                                    {/* Top Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2 items-start">
                                        {inf.verified && (
                                            <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-slate-900 border border-slate-200/50 shadow-sm flex items-center gap-1 w-fit">
                                                <TrendingUp className="h-3 w-3 text-blue-600" />
                                                Elite Member
                                            </span>
                                        )}
                                    </div>

                                    {/* Selection Checkbox */}
                                    <div className="absolute top-4 right-4">
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-blue-600 border-blue-600' : 'bg-white/90 backdrop-blur border-slate-200'}`}>
                                            {isSelected && <CheckCircle className="h-5 w-5 text-white" />}
                                        </div>
                                    </div>

                                    {/* PUC Angels Badge - Bottom & Transparent */}
                                    {inf.isPucAngel && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-full px-4 flex justify-center items-center gap-1.5 z-10">
                                            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm flex items-center gap-1 w-fit whitespace-nowrap">
                                                <span className="text-yellow-400">🦋</span>
                                                PUC angels
                                            </span>
                                            <span className="bg-black/30 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white border border-white/20 shadow-sm flex items-center gap-1 w-fit whitespace-nowrap">
                                                <Users className="h-3 w-3 text-purple-400" />
                                                Socially Conscious
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Info section */}
                                <div className="p-5 space-y-4 flex-1 flex flex-col">
                                    <Link
                                        href={`/${inf.username}`}
                                        onClick={(e) => e.stopPropagation()}
                                        className="w-full bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm text-center block"
                                    >
                                        View Profile
                                    </Link>

                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-slate-900 text-lg leading-tight flex items-center gap-2">
                                                {inf.name}
                                                {inf.verified && <CheckCircle className="h-4 w-4 text-blue-500 fill-white" />}
                                                <span className="text-base">{inf.flag}</span>
                                            </h3>
                                            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">
                                                <span className="text-slate-400 text-[10px] font-medium mr-1 uppercase tracking-widest">START </span>
                                                {inf.price}
                                            </p>
                                        </div>
                                        {inf.expertise && (
                                            <div className="flex items-center gap-1 mb-2 flex-wrap">
                                                {inf.expertise.map((exp, idx) => (
                                                    <span key={idx} className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-md text-[10px] font-bold border border-indigo-100 flex items-center gap-1">
                                                        {getExpertiseIcon(exp, "h-3 w-3")}
                                                        {exp}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
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
                                                    {inf.stats?.linkedin.followers || "0"}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                                    <Heart className="h-3 w-3 text-red-400" />
                                                    {inf.stats?.linkedin.engagement || "0"}
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
                                                    {inf.stats?.instagram.followers || "0"}
                                                </div>
                                                <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                                    <Heart className="h-3 w-3 text-red-400" />
                                                    {inf.stats?.instagram.engagement || "0"}
                                                </div>
                                            </div>
                                        </div> */}
                                    </div>

                                    <div className="flex flex-col gap-2 pt-1">
                                        <div className="flex items-center gap-1 text-slate-400 text-xs font-medium">
                                            <MapPin className="h-3 w-3" />
                                            {inf.location}
                                        </div>
                                        <div className="flex flex-wrap gap-1.5">
                                            {(inf.categories || []).map((cat, idx) => (
                                                <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md border border-slate-200">
                                                    {cat}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-auto">
                                        {(inf.tags || []).map(tag => (
                                            <span key={tag} className="text-[9px] font-bold uppercase tracking-widest px-2 py-1 bg-slate-50 text-slate-400 rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="py-20 text-center space-y-4 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                        <Search className="h-8 w-8 text-slate-300" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-900">No creators found</h3>
                        <p className="text-slate-500">Try adjusting your search or filters to find more influencers.</p>
                    </div>
                    <button
                        onClick={() => { setActiveCategory("All"); setActiveCountry("All"); setSearchQuery(""); }}
                        className="btn btn-primary"
                    >
                        Clear all filters
                    </button>
                </div>
            )}
                </>
            )}

            {/* Selection Bar */}
            {false && selectedProfiles.length > 0 && (
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 shadow-[0_-4px_20px_-1px_rgba(0,0,0,0.1)] p-4 z-50 animate-in slide-in-from-bottom-full duration-300">
                    <div className="max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-6">
                        <div className="flex flex-col md:flex-row items-center gap-6 flex-1">
                            <div className="flex items-center gap-4 shrink-0">
                                <div className="bg-slate-900 text-white text-sm font-bold px-3 py-1 rounded-full">
                                    {selectedProfiles.length}
                                </div>
                                <span className="text-sm font-bold text-slate-700 whitespace-nowrap">
                                    profiles selected
                                </span>
                            </div>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed text-center md:text-left max-w-3xl">
                                Initiating contact is your first step toward a new opportunity. While there is no financial commitment at this stage, we value the professional integrity of our community. By reaching out, you signal a genuine intent to collaborate or hire, ensuring every conversation is purposeful and respected.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 shrink-0 justify-center">
                            <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20 font-bold">
                                Contact for Campaign
                            </button>
                            <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20 font-bold">
                                Contact for Advisory
                            </button>
                            <button className="btn bg-blue-600 hover:bg-blue-700 text-white border-transparent shadow-lg shadow-blue-500/20 font-bold">
                                Recruit (fixed or consultancy)
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
