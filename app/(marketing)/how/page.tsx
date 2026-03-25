import React from 'react';
import HowItWorksNew from '@/components/marketing/HowItWorksNew';

export const metadata = {
  title: 'How It Works',
  description: 'Learn how Influencer Circle uses human interaction and AI to boost your social media engagement on LinkedIn and Instagram.',
};

export default function HowPage() {
    return (
        <div className="pt-24">
            <HowItWorksNew />
        </div>
    );
}
