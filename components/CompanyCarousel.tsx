"use client";

import { COMPANIES, MAJOR_BRANDS } from "@/lib/companies";
import { useEffect, useState } from "react";
import Image from "next/image";

// Helper to shuffle array
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Helper to split array into N chunks
function splitArray<T>(array: T[], chunks: number): T[][] {
  const result: T[][] = Array.from({ length: chunks }, () => []);
  array.forEach((item, index) => {
    result[index % chunks].push(item);
  });
  return result;
}

// Logo Mapping (mocking logos with generic placeholders or actual images if available)
// Since we don't have actual logo files for external companies, we use a styled text approach
// or a placeholder colored box with initials for "Major Brands".

function CompanyItem({ name }: { name: string }) {
  const isMajor = MAJOR_BRANDS.includes(name);

  if (isMajor) {
    // For major brands, show a "logo-like" item
    // Using a colored box with initials as a placeholder for the logo
    // and the name in bold color
    const initials = name.substring(0, 2).toUpperCase();
    // Deterministic color based on name length/char code to be consistent
    const colors = ["bg-blue-600", "bg-red-600", "bg-green-600", "bg-purple-600", "bg-orange-600", "bg-indigo-600"];
    const color = colors[name.length % colors.length];

    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-100 shadow-sm">
        <div className={`w-6 h-6 rounded flex items-center justify-center text-[10px] font-bold text-white ${color}`}>
          {initials}
        </div>
        <span className="font-bold text-slate-900 text-sm whitespace-nowrap">{name}</span>
      </div>
    );
  }

  return (
    <span className="text-slate-500 font-medium text-sm whitespace-nowrap hover:text-slate-800 transition-colors cursor-default">
      {name}
    </span>
  );
}

export default function CompanyCarousel() {
  const [rows, setRows] = useState<string[][]>([]);

  useEffect(() => {
    // Shuffle and split on mount to ensure hydration matches
    // Wait, hydration mismatch if random on client only.
    // We should use a seeded shuffle or just static split for consistency.
    // For now, let's just split the static list.
    const chunks = splitArray(COMPANIES, 7);
    setRows(chunks);
  }, []);

  if (rows.length === 0) return null;

  return (
    <div className="py-12 bg-slate-50/50 border-y border-slate-100 overflow-hidden space-y-4">
      <div className="text-center mb-8">
        <h2 className="text-lg font-bold text-slate-400 uppercase tracking-widest">Trusted by Professionals from</h2>
      </div>
      
      {rows.map((rowItems, index) => (
        <div 
          key={index} 
          className="marquee-container"
          style={{ 
            // Vary speed slightly for natural look
            // We use style for animation duration override if needed, 
            // but CSS class is cleaner. 
            // Let's alternate direction
          }}
        >
          <div className={`marquee-content ${index % 2 === 1 ? 'reverse' : ''}`} style={{ animationDuration: `${40 + index * 5}s` }}>
            {/* Render items twice for seamless loop */}
            {rowItems.map((company, i) => (
              <CompanyItem key={`${index}-${i}-1`} name={company} />
            ))}
            {rowItems.map((company, i) => (
              <CompanyItem key={`${index}-${i}-2`} name={company} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
