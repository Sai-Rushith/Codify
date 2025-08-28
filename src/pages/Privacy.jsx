import React, { useState } from "react";

// PrivacyPolicy.js
// Single-file React component (JS) using Tailwind CSS — black & white theme
// Drop into your project (e.g. src/components/PrivacyPolicy.js) and render: <PrivacyPolicy />

export default function PrivacyPolicy() {
  const [openIndex, setOpenIndex] = useState(0);

  const sections = [
    {
      title: "1. Introduction",
      body: `Codify ("we", "our", "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, enroll in courses, or otherwise use our services (the "Service"). By using the Service you agree to the collection and use of information in accordance with this policy.`
    },
    {
      title: "2. Effective Date",
      body: `This Privacy Policy is effective as of August 19, 2025. We may update this policy from time to time; material changes will be posted on this page with a revised effective date.`
    },
    {
      title: "3. Information We Collect",
      body: `We collect: (a) Information you provide directly such as name, email, billing details, and profile information; (b) Usage data such as pages visited, courses accessed, time spent, and device/browser information; (c) Payment information via third-party processors (we do not store full card numbers); and (d) Communications you send to us (support requests, feedback).`
    },
    {
      title: "4. How We Use Your Information",
      body: `We use collected information to: provide and maintain the Service, process payments, communicate updates and marketing (with opt-out), personalize content and recommendations, detect and prevent fraud, and comply with legal obligations.`
    },
    {
      title: "5. Cookies & Tracking",
      body: `We use cookies and similar technologies to operate the Service, remember preferences, and analyze usage. Third-party analytics and advertising providers may also use cookies. You can manage cookie settings in your browser; however, disabling certain cookies may affect functionality.`
    },
    {
      title: "6. Third-Party Services",
      body: `We use third-party service providers (e.g., payment processors, analytics, hosting) to perform functions on our behalf. These providers may process your personal data under their own privacy policies. We vet providers and require that they protect your data.`
    },
    {
      title: "7. Data Sharing & Disclosure",
      body: `We may disclose personal information to comply with legal obligations, enforce our terms, protect rights and safety, or with your consent. We do not sell personal information for monetary consideration.`
    },
    {
      title: "8. Data Retention",
      body: `We retain personal information for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods depend on the type of information and the reason for retention.`
    },
    {
      title: "9. Security",
      body: `We implement reasonable administrative, technical, and physical safeguards designed to protect personal information. However, no method of transmission or storage is completely secure — we cannot guarantee absolute security.`
    },
    {
      title: "10. Your Rights",
      body: `Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict processing of your personal information. For residents of certain regions (e.g., EU/EEA, UK, California), additional rights may apply (GDPR, CCPA). To exercise your rights, contact us at the email below.`
    },
    {
      title: "11. International Transfers",
      body: `Codify is operated from multiple jurisdictions. Personal data may be transferred and processed in countries different from your own. We take steps to ensure appropriate safeguards for transfers, such as standard contractual clauses where required.`
    },
    {
      title: "12. Children",
      body: `Our Service is not intended for children under 13. We do not knowingly collect personal data from children under the age of 13. If you believe we have collected such information, contact us and we will take steps to delete it.`
    },
    {
      title: "13. Changes to This Policy",
      body: `We may update this Privacy Policy. When we make significant changes, we will notify users via prominent notice on our site or by email. Continued use after changes indicates acceptance.`
    },
    {
      title: "14. Contact",
      body: `If you have questions or requests regarding this policy, contact: support@codify.example (replace with your support email).`
    }
  ];

  function toggle(index) {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-12 mt-14">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Privacy Policy</h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl">How Codify collects, uses, and safeguards your information.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-xs text-gray-400">Effective date</div>
              <div className="font-medium">August 19, 2025</div>
            </div>
            <button
              onClick={() => window.print()}
              className="px-4 py-2 border border-white/20 rounded-md text-sm hover:bg-white/5 transition"
            >
              Print
            </button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2">
            <div className="space-y-4">
              {sections.map((s, i) => (
                <article key={i} className="bg-white/5 border border-white/6 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => toggle(i)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between focus:outline-none"
                  >
                    <div>
                      <h3 className="text-lg font-semibold">{s.title}</h3>
                      <p className="mt-1 text-sm text-gray-300 line-clamp-2">{s.body}</p>
                    </div>
                    <div className={`ml-4 transform transition-transform ${openIndex === i ? "rotate-180" : ""}`}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </button>
                  <div className={`${openIndex === i ? "px-6 py-4" : "h-0 px-6"} transition-all duration-200 bg-black/40 text-gray-200`}
                    style={{ overflow: 'hidden' }}
                  >
                    {openIndex === i && (
                      <div className="prose prose-invert max-w-none text-sm leading-relaxed">
                        <p>{s.body}</p>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white text-black shadow-lg border border-white/10">
                <h4 className="text-lg font-bold">Quick summary</h4>
                <ul className="mt-3 text-sm space-y-2 text-black/70">
                  <li>• Effective date: Aug 19, 2025</li>
                  <li>• Data: Account, usage, payments</li>
                  <li>• Cookies: Used — can be managed</li>
                  <li>• Contact: support@codify.example</li>
                </ul>
                <div className="mt-5">
                  <button
                    onClick={() => window.print()}
                    className="w-full px-4 py-2 rounded-lg border border-black text-sm font-medium hover:bg-black/5 transition"
                  >
                    Print Policy
                  </button>
                </div>
              </div>

            <div className="p-5 rounded-2xl border border-white/6 bg-white/3">
  <h5 className="font-semibold">Customize this policy</h5>
  <p className="mt-2 text-sm text-gray-300">Request GDPR/CCPA clauses, cookie consent code, or region-specific wording. We’ll tailor it for you.</p>

</div>

            </div>
          </aside>
        </main>

        <footer className="mt-12 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Codify — All rights reserved.
        </footer>
      </div>
    </div>
  );
}
