import React from 'react';

/**
 * Code of Conduct
 *
 * This page outlines the standards for content and interactions on our platform,
 * respecting the laws of Brazil, the United States, and the European Union.
 * It is intended to be displayed as a dedicated page on the website.
 */
export default function CodeOfConduct() {
    return (
        <section className="max-w-4xl mx-auto p-6" id="code-of-conduct">
            <h1 className="text-3xl font-bold mb-4 text-primary">Code of Conduct</h1>

            <p className="mb-4">
                Our community is built on respect, safety, and compliance with applicable laws. By using this platform you agree to adhere to the following principles.
            </p>

            <h2 className="text-2xl font-semibold mt-6 mb-2 text-green-700">1. Respectful Content</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>No hate speech, harassment, or discrimination based on race, gender, sexual orientation, religion, nationality, or any protected characteristic.</li>
                <li>No violent or graphic content that glorifies harm or encourages illegal activities.</li>
                <li>No content that infringes on intellectual property rights (copyright, trademarks, patents).</li>
                <li>No defamation, false statements, or malicious rumors about individuals or organisations.</li>
                <li>No personal data or private information shared without explicit consent (GDPR, LGPD, CCPA compliance).</li>
            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2 text-red-700">2. Prohibited Interactions</h2>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Phishing, scamming or any attempt to deceive users for illegal gain.</li>
                <li>Gambling companies, content, messages and profile related is not accepted.</li>
                <li>Soliciting or distributing illegal substances, weapons, or services.</li>
                <li>Engaging in activities that violate local, federal, or international law, including but not limited to:
                    <ul className="list-disc list-inside ml-6">
                        <li>Brazil: Lei nº 12.965/2014 (Marco Civil da Internet) and Lei Geral de Proteção de Dados (LGPD).</li>
                        <li>USA: Communications Decency Act (Section 230), CAN‑SPAM Act, and state privacy statutes (e.g., CCPA).</li>
                        <li>EU: General Data Protection Regulation (GDPR) and ePrivacy Directive.</li>
                    </ul>
                </li>
                <li>Any form of sexual exploitation, child sexual abuse material, or content that is illegal under child protection laws.</li>

            </ul>

            <h2 className="text-2xl font-semibold mt-6 mb-2 text-blue-700">3. Enforcement</h2>
            <p className="mb-2">
                Violations may result in content removal, account suspension, or legal action where appropriate. Reports can be submitted via the "Contact Us" page.
            </p>
            <p className="mb-2">
                We reserve the right to modify this Code of Conduct at any time to reflect changes in law or community standards.
            </p>

            <footer className="mt-8 text-sm text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
            </footer>
        </section>
    );
}
