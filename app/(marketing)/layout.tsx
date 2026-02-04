"use client";

import React from "react";
import Footer from "@/components/Footer";
import Header from "@/components/marketing/Header";
import { ViewProvider } from "@/components/marketing/ViewContext";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
    return (
        <ViewProvider>
            <div className="min-h-screen bg-background relative overflow-hidden">
                {/* Abstract Background Elements */}
                <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
                <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

                <Header />

                <main className="container mx-auto px-4 pt-24 pb-12 relative z-10">
                    {children}
                </main>

                <Footer />
            </div>
        </ViewProvider>
    );
}
