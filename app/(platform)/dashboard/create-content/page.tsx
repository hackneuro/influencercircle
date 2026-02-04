"use client";
import { useState } from "react";
import { Send, Sparkles, Upload, AlertCircle, CheckCircle, Calendar, FileText, Video } from "lucide-react";

export default function CreateContentPage() {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [files, setFiles] = useState<{ [key: number]: File | null }>({
        1: null,
        2: null,
        3: null,
        4: null
    });
    const [message, setMessage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showSchedule, setShowSchedule] = useState(false);
    const [scheduleDate, setScheduleDate] = useState("");

    const MAX_CHARS = 2000;
    const RECOMMENDED_MIN = 1000;
    const RECOMMENDED_MAX = 1500;

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, slot: number) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [slot]: e.target.files![0] }));
        }
    };

    const handleSubmit = async (type: "direct" | "ai" | "automate" | "schedule" | "revise") => {
        setLoading(true);
        setMessage(null);

        // Simulating API call
        setTimeout(() => {
            setLoading(false);
            if (type === "direct") {
                setMessage("Content submitted successfully! It will be reviewed and posted.");
            } else if (type === "schedule") {
                const date = new Date(scheduleDate).toLocaleString();
                setMessage(`Content scheduled successfully for ${date}!`);
                setShowSchedule(false);
            } else if (type === "automate") {
                setMessage("Content sent to Super Agent AI for full automation! Sit back and relax.");
            } else if (type === "revise") {
                setMessage("Content sent to Super Agent AI for revision! We will polish it for you.");
            } else {
                setMessage("Content submitted to Super Agent AI! We will review and enhance it before posting.");
            }
        }, 1500);
    };

    const renderFilePreview = (file: File | null, slot: number) => {
        if (file) {
            return (
                <div className="flex flex-col items-center text-green-600">
                    {file.type.includes('pdf') ? (
                        <FileText className="h-8 w-8 mb-2" />
                    ) : file.type.includes('video') ? (
                        <Video className="h-8 w-8 mb-2" />
                    ) : (
                        <CheckCircle className="h-8 w-8 mb-2" />
                    )}
                    <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
                    <span className="text-xs text-slate-400 mt-1">Click to change</span>
                </div>
            );
        }
        return (
            <div className="flex flex-col items-center text-slate-400">
                <Upload className="h-8 w-8 mb-2" />
                <span className="text-sm font-medium">Upload Image, Video or PDF File**</span>
                <span className="text-xs mt-1">PNG, JPG, PDF, MP4</span>
            </div>
        );
    };

    return (
        <main className="space-y-6">
            <section className="card p-6">
                <h1 className="text-2xl font-semibold mb-2">Create Content</h1>
                <p className="text-sm text-ic-subtext">
                    Create your content and post it directly via our platform for integration.
                </p>
            </section>

            <section className="card p-6 space-y-6">
                {/* Title Field */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Title
                    </label>
                    <input
                        type="text"
                        className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors"
                        placeholder="Enter a catchy title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>

                {/* Post Body Field */}
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">
                        Post Content (text, hashtags and links)
                    </label>
                    <div className="relative">
                        <textarea
                            className="w-full border border-slate-200 rounded-lg px-4 py-3 min-h-[300px] focus:border-blue-500 outline-none transition-colors resize-y"
                            placeholder="Write your post content here..."
                            value={body}
                            onChange={(e) => {
                                if (e.target.value.length <= MAX_CHARS) {
                                    setBody(e.target.value);
                                }
                            }}
                        />
                        <div className="absolute bottom-3 right-3 text-xs text-slate-400 bg-white/80 px-2 py-1 rounded">
                            {body.length} / {MAX_CHARS}
                        </div>
                    </div>
                    <div className="flex items-start gap-2 mt-2 text-xs text-slate-500">
                        <AlertCircle className="h-4 w-4 text-blue-500 shrink-0" />
                        <span>
                            <strong>Pro Tip:</strong> For best engagement, we recommend keeping your post between <strong>{RECOMMENDED_MIN}</strong> and <strong>{RECOMMENDED_MAX}</strong> characters.
                        </span>
                    </div>
                </div>

                {/* File Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[1, 2, 3, 4].map((slot) => (
                        <div key={slot} className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*,video/*,application/pdf"
                                onChange={(e) => handleFileChange(e, slot)}
                            />
                            {renderFilePreview(files[slot as 1|2|3|4], slot)}
                        </div>
                    ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 border-t border-slate-100">
                    <div className="flex flex-col md:flex-row gap-4 justify-end mb-4">
                        {message && (
                            <div className="flex-1 flex items-center text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">{message}</span>
                            </div>
                        )}

                        <button
                            onClick={() => handleSubmit("direct")}
                            disabled={loading || !title || !body}
                            className="btn px-6 py-3 bg-slate-800 text-white hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
                        >
                            <Send className="h-4 w-4" />
                            Post
                        </button>

                        <button
                            onClick={() => handleSubmit("revise")}
                            disabled={loading || !title || !body}
                            className="btn px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            <Sparkles className="h-4 w-4" />
                            Revise my content with Super Agent AI*
                        </button>

                        <button
                            onClick={() => handleSubmit("automate")}
                            disabled={loading || !title || !body}
                            className="btn px-6 py-3 bg-purple-600 text-white hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold shadow-md hover:shadow-lg transition-all"
                        >
                            <Sparkles className="h-4 w-4" />
                            Automate Content with Super Agent AI*
                        </button>

                        <div className="relative">
                            <button
                                onClick={() => setShowSchedule(!showSchedule)}
                                disabled={loading || !title || !body}
                                className="btn px-6 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 font-bold"
                            >
                                <Calendar className="h-4 w-4" />
                                Schedule Content (build calendar)
                            </button>
                            {showSchedule && (
                                <div className="absolute bottom-full right-0 mb-2 p-4 bg-white rounded-xl shadow-xl border border-slate-200 min-w-[300px] z-10">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Select Date & Time</label>
                                    <input
                                        type="datetime-local"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:border-blue-500"
                                        value={scheduleDate}
                                        onChange={(e) => setScheduleDate(e.target.value)}
                                        min={new Date().toISOString().slice(0, 16)}
                                    />
                                    <button
                                        onClick={() => handleSubmit("schedule")}
                                        disabled={!scheduleDate}
                                        className="w-full btn btn-primary py-2 text-sm text-white font-bold disabled:opacity-50"
                                    >
                                        Confirm Schedule
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {/* Explanatory Text */}
                    <div className="space-y-1 text-xs text-slate-500 italic">
                        <p>* Super AgentAI is a higher AI form developed by <a href="https://hackneuro.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">HackNeuro</a> and it can give a content 5x more engagement</p>
                        <p>** PDF file is best use for carrossel type of post</p>
                    </div>
                </div>
            </section>
        </main>
    );
}
