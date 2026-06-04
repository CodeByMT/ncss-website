import React from "react";
import { Heart, Mail, Instagram, MapPin } from "lucide-react";
import Logo from "./Logo";

interface FooterProps {
  setCurrentTab: (tab: string) => void;
}

export default function Footer({ setCurrentTab }: FooterProps) {
  return (
    <footer className="bg-[#E8D9BE] text-[#1B2A4A]/80 border-t border-[#D4C4A0] py-16" id="footer-system">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Centered Logo block as requested */}
        <div className="flex flex-col items-center justify-center mb-12 text-center" id="footer-logo-center">
          <Logo className="h-16 w-auto mb-4" inverse={false} />
          <p className="text-xs font-bold tracking-widest text-[#1B2A4A]/60 uppercase font-mono">
            Serving Humanity. Strengthening Community.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 border-t border-[#D4C4A0]/65 pt-10">
          
          {/* Manifesto text */}
          <div className="md:col-span-6 space-y-4">
            <h4 className="text-[#1B2A4A] font-display font-extrabold text-sm uppercase tracking-wider">Our Manifesto</h4>
            <p className="text-sm text-[#1B2A4A]/85 leading-relaxed font-sans max-w-md">
              The NIT Community Service Society (NCSS) drives sustainable human support, emergency preparedness, wellness initiatives, and localized SDG-alignment programs for public welfare across NIT Lahore and surrounding community suburbs.
            </p>
          </div>

          {/* Quick Sitemap Links */}
          <div className="md:col-span-3">
            <h4 className="text-[#1B2A4A] font-display font-extrabold text-sm uppercase tracking-wider mb-5">Sitemap</h4>
            <ul className="space-y-3 text-sm" id="footer-sitemap-list">
              <li>
                <button onClick={() => setCurrentTab("home")} className="hover:text-[#1B2A4A] hover:underline transition-colors font-semibold text-[#1B2A4A]/80 cursor-pointer text-left">Home Landing</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("about")} className="hover:text-[#1B2A4A] hover:underline transition-colors font-semibold text-[#1B2A4A]/80 cursor-pointer text-left">About Mission</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("events")} className="hover:text-[#1B2A4A] hover:underline transition-colors font-semibold text-[#1B2A4A]/80 cursor-pointer text-left">Events & Campaigns</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("team")} className="hover:text-[#1B2A4A] hover:underline transition-colors font-semibold text-[#1B2A4A]/80 cursor-pointer text-left">Our Team</button>
              </li>
              <li>
                <button onClick={() => setCurrentTab("join")} className="hover:text-[#1B2A4A] hover:underline hover:bg-[#1B2A4A]/10 px-2 py-1 rounded transition-colors font-extrabold text-[#1B2A4A] cursor-pointer text-left">Join NCSS Society</button>
              </li>
            </ul>
          </div>

          {/* Contact Coordinates */}
          <div className="md:col-span-3">
            <h4 className="text-[#1B2A4A] font-display font-extrabold text-sm uppercase tracking-wider mb-5">Coordinates</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-2.5">
                <Mail className="w-4.5 h-4.5 text-[#1B2A4A] mt-0.5 shrink-0" />
                <a href="mailto:ncss@nit.edu" className="hover:text-[#1B2A4A] font-semibold transition-colors">ncss@nit.edu</a>
              </li>
              <li className="flex items-start gap-2.5">
                <Instagram className="w-4.5 h-4.5 text-[#1B2A4A] mt-0.5 shrink-0" />
                <a href="https://instagram.com/ncss.nit" target="_blank" rel="noopener noreferrer" className="hover:text-[#1B2A4A] font-semibold transition-colors">@ncss.nit</a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4.5 h-4.5 text-[#1B2A4A] mt-0.5 shrink-0" />
                <span className="leading-relaxed font-semibold">National Institute of Technology, Lahore (NIT Lahore Campus)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Horizontal Bar */}
        <div className="border-t border-[#D4C4A0]/65 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#1B2A4A]/60">
          <p>© {new Date().getFullYear()} NIT Community Service Society (NCSS). All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="font-mono text-[10px] tracking-widest uppercase font-extrabold text-[#1B2A4A]/70">NIT SOCIAL EMPOWERMENT PORTAL</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
