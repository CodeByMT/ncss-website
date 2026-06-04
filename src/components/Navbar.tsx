import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export default function Navbar({ currentTab, setCurrentTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "events", label: "Events" },
    { id: "team", label: "Our Team" },
    { id: "join", label: "Join NCSS" },
    { id: "contact", label: "Contact Us" },
  ];

  const handleNavClick = (tabId: string) => {
    setCurrentTab(tabId);
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#E8D9BE] text-[#1B2A4A] border-b border-[#D4C4A0] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo Brand */}
          <div
            onClick={() => handleNavClick("home")}
            className="flex items-center gap-3 cursor-pointer group"
            id="nav-logo-brand"
          >
            <Logo className="h-12 w-auto transition-transform duration-300 group-hover:scale-104" inverse={false} />
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1" id="nav-desktop-links">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`btn-nav-desktop-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`px-4 py-2 rounded-lg text-sm font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                  currentTab === item.id
                    ? "bg-[#1B2A4A]/10 text-[#1B2A4A] border-b-2 border-[#1B2A4A] rounded-b-none pb-1.5"
                    : "text-[#1B2A4A]/80 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/40"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile hamburger menu */}
          <div className="flex md:hidden items-center gap-3">
            <button
              id="btn-nav-hamburger"
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-[#1B2A4A]/85 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/40 cursor-pointer"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#E8D9BE] border-b border-[#D4C4A0] px-4 py-4 space-y-2 animate-fade-in" id="nav-mobile-drawer">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`btn-nav-mobile-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`w-full text-left px-4 py-3 rounded-xl text-base font-bold tracking-wide transition-all ${
                currentTab === item.id
                  ? "bg-[#1B2A4A] text-[#F5EDD8]"
                  : "text-[#1B2A4A]/80 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/40"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}