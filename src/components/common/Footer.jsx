import React from "react";
import {Link} from "react-router-dom"

// FooterPage.js
// Single-file React component (JS) using Tailwind CSS — black & white theme
// Drop into your project (e.g. src/pages/FooterPage.js) and render it for a full-page demo.

export default function FooterPage() {
 

  return (
    <div >
        
              <footer className="border-t border-white/6">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-white/70">© {new Date().getFullYear()} Codify — Learn more, pay less.</div>
          <div className="flex items-center gap-4 text-white/70 text-sm">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
