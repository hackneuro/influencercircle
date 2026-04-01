"use client";

import { useState } from "react";
import { Send, Sparkles, Image as ImageIcon, Loader2, CheckCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/components/marketing/LanguageContext";

export default function LinkedinCreateContentPage() {
    const { t } = useLanguage();
    
    const [draft, setDraft] = useState("");
    const [finalContent, setFinalContent] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    
    const [searchQuery, setSearchQuery] = useState("");
    const [isSearching, setIsSearching] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const [isPosting, setIsPosting] = useState(false);

    const handleGenerateAI = async () => {
        if (!draft.trim()) {
            toast.error("Please enter some thoughts or draft text first.");
            return;
        }
        
        setIsGenerating(true);
        try {
            const res = await fetch("/api/ai/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: draft })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to generate content");
            
            setFinalContent(data.text);
            toast.success("Content generated successfully!");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSearchImages = async () => {
        if (!searchQuery.trim()) {
            toast.error("Please enter a search query.");
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(`/api/image-search?q=${encodeURIComponent(searchQuery)}`);
            const data = await res.json();
            
            if (!res.ok) throw new Error(data.error || "Failed to search images");
            
            setImages(data.images || []);
            if (data.images?.length === 0) {
                toast.info("No images found for that query.");
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSearching(false);
        }
    };

    const handlePostToLinkedIn = async () => {
        if (!finalContent.trim()) {
            toast.error("Please generate or write some final content before posting.");
            return;
        }

        setIsPosting(true);
        try {
            const res = await fetch("/api/linkedin/post", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    content: finalContent,
                    imageUrl: selectedImage
                })
            });
            
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to post to LinkedIn");
            
            toast.success("Successfully posted to LinkedIn!");
            setDraft("");
            setFinalContent("");
            setSelectedImage(null);
            setImages([]);
            setSearchQuery("");
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <main className="space-y-6 max-w-5xl mx-auto">
            <section className="bg-white rounded-2xl border border-slate-200 p-6">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Create LinkedIn Post</h1>
                <p className="text-slate-500">
                    Draft your ideas, let our AI polish them into an engaging post, search for the perfect image, and publish directly to LinkedIn.
                </p>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column: Content Generation */}
                <div className="space-y-6">
                    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                1. What do you want to talk about? (Draft)
                            </label>
                            <textarea
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                                placeholder="E.g., I want to talk about how AI is changing the marketing landscape, focusing on personalization..."
                                value={draft}
                                onChange={(e) => setDraft(e.target.value)}
                            />
                        </div>

                        <button
                            onClick={handleGenerateAI}
                            disabled={isGenerating || !draft.trim()}
                            className="btn w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <Loader2 className="h-5 w-5 animate-spin" /> : <Sparkles className="h-5 w-5" />}
                            <span>Make this content viral with the Super Agent</span>
                        </button>
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">
                                2. Final Post Content
                            </label>
                            <textarea
                                className="w-full border border-slate-200 rounded-xl px-4 py-3 min-h-[300px] focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
                                placeholder="Your AI-generated post will appear here. You can edit it before publishing."
                                value={finalContent}
                                onChange={(e) => setFinalContent(e.target.value)}
                            />
                        </div>
                    </section>
                </div>

                {/* Right Column: Image Search & Posting */}
                <div className="space-y-6">
                    <section className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
                        <label className="block text-sm font-bold text-slate-700">
                            3. Search for an Image (Google Images)
                        </label>
                        
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="Search images..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearchImages()}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleSearchImages}
                                disabled={isSearching || !searchQuery.trim()}
                                className="btn btn-outline flex items-center gap-2"
                            >
                                {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                                <span>Search</span>
                            </button>
                        </div>

                        {images.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mt-4 max-h-[400px] overflow-y-auto p-1">
                                {images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        onClick={() => setSelectedImage(img)}
                                        className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all aspect-video ${
                                            selectedImage === img ? 'border-blue-600 shadow-md scale-[1.02]' : 'border-transparent hover:border-slate-300'
                                        }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img src={img} alt={`Search result ${idx}`} className="w-full h-full object-cover" />
                                        {selectedImage === img && (
                                            <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                                                <CheckCircle className="h-8 w-8 text-white drop-shadow-md" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedImage && (
                            <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-3">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={selectedImage} alt="Selected" className="w-16 h-16 rounded-lg object-cover border border-blue-200" />
                                <div className="flex-1">
                                    <p className="text-sm font-semibold text-blue-900">Image Selected</p>
                                    <p className="text-xs text-blue-700 truncate mt-1">This image will be attached to your post.</p>
                                </div>
                                <button onClick={() => setSelectedImage(null)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">
                                    Remove
                                </button>
                            </div>
                        )}
                    </section>

                    <section className="bg-white rounded-2xl border border-slate-200 p-6">
                        <button
                            onClick={handlePostToLinkedIn}
                            disabled={isPosting || !finalContent.trim()}
                            className="btn w-full bg-[#0A66C2] hover:bg-[#004182] text-white font-bold py-4 text-lg rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
                        >
                            {isPosting ? (
                                <>
                                    <Loader2 className="h-6 w-6 animate-spin" />
                                    <span>Publishing to LinkedIn...</span>
                                </>
                            ) : (
                                <>
                                    <Send className="h-6 w-6" />
                                    <span>Post directly to LinkedIn</span>
                                </>
                            )}
                        </button>
                    </section>
                </div>
            </div>
        </main>
    );
}
