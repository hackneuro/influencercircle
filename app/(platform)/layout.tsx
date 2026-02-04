import UpgradeCta from "@/components/UpgradeCta";
import Footer from "@/components/Footer";
import Link from "next/link";
import AccountStatusBadge from "@/components/AccountStatusBadge";

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <div className="brand-bar">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4 md:gap-6">
                            <div className="h-10 md:h-14 w-auto overflow-hidden flex items-center justify-center">
                                <img src="/logo-full.jpg" alt="Influencer Circle" className="h-full w-full object-contain" />
                            </div>
                            <div className="h-8 w-[1px] bg-slate-200" />
                            <div className="h-10 md:h-14 w-auto overflow-hidden flex items-center justify-center">
                                <img src="/viralmind-logo.jpg" alt="ViralMind" className="h-full w-full object-contain" />
                            </div>
                            <div className="hidden lg:block">
                                <h1 className="text-white font-bold text-lg leading-tight">The Influencer Circle Platform <span className="block text-xs font-normal opacity-80">(version 2.03)</span></h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-4 md:gap-6">
                            <nav className="flex items-center gap-2 md:gap-3">
                                <Link href="/" className="nav-link text-sm md:text-base px-2 py-1">Home</Link>
                                <Link href="/login" className="nav-link text-sm md:text-base px-2 py-1 font-medium text-slate-700 hover:text-blue-600">Login</Link>
                                <Link href="/app" className="btn btn-outline text-sm md:text-base py-1.5 md:py-2">App</Link>
                                <Link href="/onboarding" className="nav-link text-sm md:text-base px-2 py-1">Onboarding</Link>
                                <Link href="/dashboard" className="btn btn-primary text-sm md:text-base py-1.5 md:py-2">Dashboard</Link>
                            </nav>
                            <div className="hidden md:block">
                                <AccountStatusBadge />
                            </div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <UpgradeCta />
                    </div>
                </div>
            </div>
            <div className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">{children}</div>
            <Footer />
        </>
    );
}
