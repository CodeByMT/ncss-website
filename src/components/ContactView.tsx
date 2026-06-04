import React from "react";
import { Mail, Instagram, MapPin, Phone, Clock } from "lucide-react";

interface ContactViewProps {
  siteSettings?: Record<string, string>;
}

export default function ContactView({ siteSettings = {} }: ContactViewProps) {
  const settings = (key: string, defaultValue: string) => siteSettings[key] || defaultValue;

  const coordinates = [
    {
      title: "Electronic Support",
      detail: settings("contact_email", "ncss@nit.edu"),
      desc: "For general inquiries, collaborations, and partnership proposals.",
      icon: <Mail className="w-5 h-5 text-[#1B2A4A]" />
    },
    {
      title: "Instagram Handle",
      detail: settings("instagram_username", "@ncss.nit"),
      desc: "Follow our story updates, reels of active camps, and live campaigns.",
      icon: <Instagram className="w-5 h-5 text-[#1B2A4A]" />
    },
    {
      title: "Physical Coordinates",
      detail: settings("contact_address", "NIT Lahore Campus"),
      desc: "Student Societies block, National Institute of Technology Lahore.",
      icon: <MapPin className="w-5 h-5 text-[#1B2A4A]" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-6" id="contact-view-container">
      
      {/* Visual Header */}
      <div className="text-center space-y-3 max-w-xl mx-auto pb-8 border-b border-[#D4C4A0]">
        <span className="px-3 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold uppercase tracking-wider font-mono inline-block">
          Get In Touch
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#1B2A4A] font-display">
          Let's Strengthen Communities Together
        </h1>
        <p className="text-sm sm:text-base text-[#1B2A4A]/80 font-semibold font-sans leading-relaxed">
          Are you looking to co-author an SDG tree catalog, donate medical supplies, or arrange computing guides? Signal us here.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Coordination contacts list */}
        <div className="lg:col-span-5 space-y-6">
          {coordinates.map((val, idx) => (
            <div
              key={idx}
              className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-6 shadow-2xs hover:shadow-sm transition-shadow duration-300 flex items-start gap-4 hover:border-[#1B2A4A]"
              id={`contact-card-${idx}`}
            >
              <div className="p-3 bg-[#F5EDD8] border border-[#D4C4A0] rounded-xl shrink-0">
                {val.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-[#1B2A4A] text-base font-display">{val.title}</h3>
                <p className="text-sm text-[#1B2A4A] font-extrabold tracking-tight">{val.detail}</p>
                <p className="text-xs text-[#1B2A4A]/80 font-sans pt-1 leading-relaxed font-semibold">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Campus Coordinates box - styled in rich cream/beige */}
        <div className="lg:col-span-7 bg-[#EDE3CC] border border-[#D4C4A0] rounded-3xl p-8 sm:p-10 text-[#1B2A4A] relative overflow-hidden flex flex-col justify-between shadow-xs min-h-[385px] group hover:border-[#1B2A4A] transition-all duration-300">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4C4A0]/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="relative space-y-4 z-10">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#1B2A4A]/70 font-extrabold block">
              CAMPUS CO-ORDINATION HEADQUARTERS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-display text-[#1B2A4A]">
              National Institute of Technology
            </h2>
            <p className="text-xs sm:text-sm text-[#1B2A4A]/85 font-semibold font-sans max-w-xl leading-relaxed">
              We are headquartered at the Student Council Hub, central campus of NIT Lahore. Feel free to request secure consultation meetings with General Secretariat officers or our Faculty Advisor Prof. Irfan during weekly consultation blocks.
            </p>
          </div>

          <div className="relative z-10 pt-8 border-t border-[#D4C4A0]/65 flex flex-wrap gap-6 items-center justify-between text-xs text-[#1B2A4A]/80">
            <div className="flex items-center gap-2 font-bold text-[#1B2A4A]">
              <Phone className="w-4.5 h-4.5 text-[#1B2A4A] shrink-0" />
              <span>{settings("contact_phone", "+92 (42) 99250125")}</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#1B2A4A] bg-[#F5EDD8] border border-[#D4C4A0] rounded-full px-3 py-1.5 font-bold shadow-2xs">
              <Clock className="w-3.5 h-3.5 text-[#1B2A4A] shrink-0 animate-pulse" />
              Consultation: {settings("consultation_hours", "Mon - Fri (4:00 PM - 6:00 PM)")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
