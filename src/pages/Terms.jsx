import React, { useState } from "react";

// TermsAndConditions.js
// Single-file React component (JS) using Tailwind CSS — black & white theme
// Drop into your project (e.g. src/components/TermsAndConditions.js) and render: <TermsAndConditions />

export default function TermsAndConditions() {
  const [openIndex, setOpenIndex] = useState(0);

  const sections = [
    {
      title: "1. Introduction",
      body: `Welcome to Codify. These Terms & Conditions ("Terms") govern your access to and use of Codify's online learning platform, paid courses, and related services (collectively, the "Service"). By enrolling in any course or using the Service you agree to these Terms. If you do not agree, please do not enroll or use the Service.`
    },
    {
      title: "2. Effective Date",
      body: `These Terms are effective as of the date displayed at the top of this page. Codify may update the Terms from time to time; updated Terms will be posted to this page and the new version will be effective as of the posted date.`
    },
    {
      title: "3. Enrollment & Eligibility",
      body: `To enroll in paid courses you must provide accurate information, be at least 13 years old (or older if required by local law), and accept these Terms. You are responsible for maintaining the confidentiality of your account credentials.`
    },
    {
      title: "4. Payments, Fees & Refunds",
      body: `All course fees are clearly displayed at checkout and charged in the currency shown. Payments are processed through third-party payment providers. Refunds are considered on a per-course basis: if you request a refund within 7 calendar days of purchase and you have not accessed more than 10% of course content, Codify may, at its discretion, grant a full or partial refund. Special promotions, bundles, and subscription plans may have different refund policies which will be disclosed at purchase.`
    },
    {
      title: "5. Access & License",
      body: `Upon successful enrollment, Codify grants you a non-exclusive, non-transferable, revocable license to access course materials for personal, non-commercial use only. You may not reproduce, distribute, re-sell, or publish course content without Codify's prior written permission.`
    },
    {
      title: "6. Intellectual Property",
      body: `All course materials, UI, logos, trademarks and content provided by Codify are owned by Codify or its licensors and are protected by copyright, trademark, and other laws. Instructors may own rights to their original contributions; license terms for that content are described in course details.`
    },
    {
      title: "7. User Conduct",
      body: `You agree not to: (a) share your account credentials; (b) upload or transmit unlawful, abusive, or infringing content; (c) use the Service to attempt to harm, harass, or impersonate others; or (d) interfere with the normal operation of the Service. Violations may result in account suspension or termination.`
    },
    {
      title: "8. Certifications & Assessments",
      body: `If a course offers a certificate, it will be issued only after you meet the stated completion criteria. Codify or the course instructor reserves the right to revoke certificates obtained through fraud or other misconduct.`
    },
    {
      title: "9. Privacy",
      body: `Codify collects and processes personal data in accordance with its Privacy Policy. By using the Service you agree to the collection and use of information as described in the Privacy Policy.`
    },
    {
      title: "10. Warranties & Disclaimers",
      body: `The Service is provided "as is" and "as available". Codify makes no warranties, express or implied, regarding course outcomes, earnings, or job placement. While Codify strives for accurate course content, it does not warrant that content is error-free.`
    },
    {
      title: "11. Limitation of Liability",
      body: `To the maximum extent permitted by law, Codify and its affiliates will not be liable for indirect, incidental, consequential, or punitive damages arising out of your access to or use of the Service. The total liability of Codify for direct damages will not exceed the amount you paid for the course in the 12 months preceding the claim.`
    },
    {
      title: "12. Termination",
      body: `Codify may suspend or terminate accounts for violation of these Terms or suspicious activity. You may close your account by contacting support. Termination will not relieve you of obligations incurred prior to termination.`
    },
    {
      title: "13. Modification of Service",
      body: `Codify may update, modify, or discontinue features of the Service at any time without liability. We will try to notify users of major changes in advance.`
    },
    {
      title: "14. Governing Law",
      body: `These Terms are governed by the laws of the applicable jurisdiction displayed during checkout or as set forth in Codify’s legal notices. Any disputes will be resolved in the competent courts of that jurisdiction.`
    },
    {
      title: "15. Contact & Support",
      body: `If you have questions about these Terms or need support, contact: support@codify.example (replace with your support email).`
    }
  ];

  function toggle(index) {
    setOpenIndex(openIndex === index ? -1 : index);
  }

  return (
    <div className="min-h-screen bg-black text-white py-12 px-6 sm:px-12 mt-14">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8">
          <div>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">Terms & Conditions</h1>
            <p className="mt-2 text-sm text-gray-300 max-w-xl">Please read these terms carefully before enrolling in any paid course on Codify.</p>
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
          {/* Left: Accordion */}
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

          {/* Right: Summary Card */}
          <aside className="lg:col-span-1">
            <div className="sticky top-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white text-black shadow-lg border border-white/10">
                <h4 className="text-lg font-bold">Quick policy summary</h4>
                <ul className="mt-3 text-sm space-y-2">
                  <li>• Refund window: 7 days (see full policy)</li>
                  <li>• Access: Personal, non-transferable</li>
                  <li>• Certificates: Issued on completion</li>
                  <li>• Support: support@codify.example</li>
                </ul>

                <div className="mt-5 flex gap-3">
                  <button
                    onClick={() => window.print()}
                    className="flex-1 px-4 py-2 rounded-lg border border-black text-sm font-medium hover:bg-black/5 transition"
                  >
                    Print
                  </button>
                  <button
                    onClick={() => alert('Thanks — by continuing you accept the Terms (demo).')}
                    className="flex-1 px-4 py-2 rounded-lg bg-black text-white border border-black text-sm font-medium hover:opacity-95 transition"
                  >
                    Accept
                  </button>
                </div>
              </div>

              <div className="p-5 rounded-2xl border border-white/6 bg-white/3">
                <h5 className="font-semibold">Need to update these?</h5>
                <p className="mt-2 text-sm text-gray-300">Edit the <code className="bg-black/20 px-1 rounded">sections</code> array in this component to update titles or full text. Use your legal email for contact & policy links.</p>
              </div>

              <div className="p-5 rounded-2xl border border-white/6 bg-white/3">
                <h5 className="font-semibold">Customize</h5>
                <p className="mt-2 text-sm text-gray-300">Change colors by editing Tailwind classes. Replace `Codify` and support email with your details.</p>
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
