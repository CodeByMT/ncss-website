import React from "react";
import { motion } from "motion/react";
import { 
  Heart, 
  Globe, 
  Award, 
  ArrowRight, 
  Calendar, 
  BookOpen, 
  Leaf, 
  Users 
} from "lucide-react";
import { EventItem } from "../types";

interface HomeViewProps {
  events: EventItem[];
  setCurrentTab: (tab: string) => void;
  pagesContent?: Record<string, string>;
}

export default function HomeView({ events, setCurrentTab, pagesContent = {} }: HomeViewProps) {
  // Helper to resolve CMS or fallback default string
  const content = (key: string, defaultValue: string) => pagesContent[key] || defaultValue;

  // Take up to 3 events as highlight
  const highlightEvents = Array.isArray(events) ? events.slice(0, 3) : [];

  const stats = [
    { 
      value: content("home_stats_lives", "4,500+"), 
      label: content("home_stats_lives_label", "Lives Guided / Guided Families"), 
      icon: <Heart className="w-5 h-5 text-[#1B2A4A]" />,
      tag: "Community Care"
    },
    { 
      value: content("home_stats_completed", "50+"), 
      label: content("home_stats_completed_label", "Drives & Camps Completed"), 
      icon: <Award className="w-5 h-5 text-[#1B2A4A]" />,
      tag: "Social Service"
    },
    { 
      value: content("home_stats_volunteers", "250+"), 
      label: content("home_stats_volunteers_label", "Active Society Members"), 
      icon: <Users className="w-5 h-5 text-[#1B2A4A]" />,
      tag: "Student Force"
    },
    { 
      value: content("home_stats_sdg", "100%"), 
      label: content("home_stats_sdg_label", "Sustainable Goal Aligned"), 
      icon: <Leaf className="w-5 h-5 text-[#1B2A4A]" />,
      tag: "UN SDG Core"
    },
  ];

  const sdgs = [
    { 
      num: "03",
      title: "SDG 3: Good Health & Well-being", 
      desc: "Providing basic physiological relief, professional rural health checkups, medical camps, and essential hygiene kit provisions.", 
      icon: <Heart className="w-5 h-5 text-[#1B2A4A]" />
    },
    { 
      num: "04",
      title: "SDG 4: Quality Student Education", 
      desc: "Delivering structural learning sessions, basic digital literacy drives, math tutoring workshops, and reading material campaigns.", 
      icon: <BookOpen className="w-5 h-5 text-[#1B2A4A]" />
    },
    { 
      num: "13",
      title: "SDG 13: Absolute Climate Action", 
      desc: "Managing neighborhood plantation drives, campus ecological campaigns, waste management grids, and environmental seminars.", 
      icon: <Leaf className="w-5 h-5 text-[#1B2A4A]" />
    },
    { 
      num: "17",
      title: "SDG 17: Partnerships for Cohesion", 
      desc: "Bridging corporate student boards, local welfare trusts, blood donor associations, and institutional state medical offices.", 
      icon: <Globe className="w-5 h-5 text-[#1B2A4A]" />
    }
  ];

  return (
    <div className="space-y-16 py-4" id="home-view-container">
      
      {/* 1. Hero Landing Space */}
      <section className="relative overflow-hidden bg-[#EDE3CC] border border-[#D4C4A0] text-[#1B2A4A] py-20 sm:py-24 px-6 sm:px-12 rounded-[2rem] shadow-md">
        {/* Subtle Warm Decorative background accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4C4A0]/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#E8D9BE]/30 rounded-full blur-3xl translate-y-16 -translate-x-16"></div>
        
        <div className="relative max-w-4xl mx-auto text-center space-y-8 z-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 bg-[#F5EDD8] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono"
          >
            <span className="flex h-2 w-2 rounded-full bg-[#1B2A4A] animate-pulse"></span>
            {content("home_hero_badge", "Serving Humanity. Strengthening Community.")}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] font-display text-[#1B2A4A]"
          >
            {content("home_hero_title", "NIT Community Service Society NCSS IMPACT")}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-[#1B2A4A]/85 font-sans leading-relaxed font-semibold"
          >
            {content("home_hero_tagline", "Join Lahore's premier student-led community action force. We bring engineers, thinkers, and volunteers together to solve real-world problems—from health clinics and ecological initiatives to teaching underrepresented girls and boys.")}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
          >
            <button
              onClick={() => setCurrentTab("join")}
              className="w-full sm:w-auto px-8 py-4 bg-[#1B2A4A] hover:bg-[#D4C4A0] text-[#F5EDD8] hover:text-[#1B2A4A] font-extrabold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group shadow-sm hover:scale-[1.01] cursor-pointer"
              id="btn-hero-join"
            >
              Apply To Join Us
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
            <button
              onClick={() => setCurrentTab("about")}
              className="w-full sm:w-auto px-8 py-4 bg-[#F5EDD8] hover:bg-[#EDE3CC] text-[#1B2A4A] font-extrabold rounded-xl transition-all duration-300 border border-[#D4C4A0] cursor-pointer"
              id="btn-hero-learn"
            >
              Explore Our Mission
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Stats Grid Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="home-stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-2">
            <div className="p-3 bg-[#F5EDD8] border border-[#D4C4A0]/60 rounded-full text-[#1B2A4A] mb-1">
              {stat.icon}
            </div>
            <div className="text-3xl font-extrabold text-[#1B2A4A] font-display">{stat.value}</div>
            <div className="text-xs font-bold text-[#1B2A4A]/70 font-sans tracking-wide uppercase">{stat.tag}</div>
            <div className="text-xs font-medium text-[#1B2A4A]/80 font-sans leading-relaxed">{stat.label}</div>
          </div>
        ))}
      </section>

      {/* 3. Core UN SDG Alignment Blocks */}
      <section className="max-w-7xl mx-auto space-y-12" id="home-sdgs-section">
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <span className="px-3.5 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono">
            Vision Blueprint
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#1B2A4A] font-display">
            {content("home_section_sdg_title", "Aligned with Sustainable Development")}
          </h2>
          <p className="text-sm sm:text-base text-[#1B2A4A]/80 font-semibold font-sans leading-relaxed">
            {content("home_section_sdg_desc", "Our initiatives are engineered systematically around the United Nations Sustainable Development Goals (SDGs), creating institutionalized micro-change.")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sdgs.map((sdg, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -5, borderColor: "#1B2A4A" }}
              transition={{ duration: 0.2 }}
              className="bg-[#EDE3CC] border border-[#D4C4A0] hover:border-[#1B2A4A] hover:bg-[#EDE3CC]/80 rounded-2xl p-6 transition-all duration-300 relative flex flex-col justify-between h-full group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="p-2.5 bg-[#F5EDD8] border border-[#D4C4A0] rounded-xl text-[#1B2A4A]">
                    {sdg.icon}
                  </div>
                  <span className="text-2xl font-extrabold font-mono text-[#1B2A4A]/30">
                    {sdg.num}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-[#1B2A4A] text-base group-hover:underline transition-colors font-display">
                    {sdg.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#1B2A4A]/80 font-semibold font-sans leading-relaxed">
                    {sdg.desc}
                  </p>
                </div>
              </div>
              <div className="pt-4 mt-4 border-t border-[#D4C4A0]/60 flex items-center justify-between text-xs text-[#1B2A4A] font-bold">
                <span>Direct Action Area</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#1B2A4A]" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Active Events Highlights Preview */}
      <section className="bg-[#EDE3CC] py-16 px-6 sm:px-10 border border-[#D4C4A0] rounded-[2rem]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mr-1">
            <div className="space-y-3">
              <span className="px-3.5 py-1 bg-[#F5EDD8] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono block w-fit">
                Direct Actions Currently Live
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#1B2A4A] tracking-tight font-display">
                Active Campaigns & Initiatives
              </h2>
            </div>
            <button
              onClick={() => setCurrentTab("events")}
              className="inline-flex items-center gap-1.5 text-[#1B2A4A] font-extrabold text-sm hover:underline group transition-colors cursor-pointer self-start sm:self-center"
            >
              See All Events & Campaigns
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {highlightEvents.length > 0 ? (
              highlightEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="bg-[#F5EDD8] rounded-2xl border border-[#D4C4A0] overflow-hidden hover:shadow-md transition-all duration-300 group flex flex-col h-full"
                >
                  <div className="h-48 overflow-hidden relative bg-[#E8D9BE]">
                    <img
                      src={evt.image_url || null}
                      alt={evt.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1.5 bg-[#F5EDD8]/95 rounded-full text-[10px] uppercase font-mono font-bold text-[#1B2A4A] tracking-wider flex items-center gap-1.5 border border-[#D4C4A0]">
                      <Calendar className="w-3.5 h-3.5 text-[#1B2A4A]" />
                      {evt.date}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-[#1B2A4A] text-lg sm:text-xl font-display transition-colors leading-snug">
                        {evt.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#1B2A4A]/80 line-clamp-3 font-sans leading-relaxed font-semibold">
                        {evt.description}
                      </p>
                    </div>
                    <button
                      onClick={() => setCurrentTab("events")}
                      className="text-[#1B2A4A] hover:underline text-xs font-extrabold flex items-center gap-1.5 pt-2 w-fit cursor-pointer group/btn"
                    >
                      Read full coordinates
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center py-12 bg-[#F5EDD8]/50 border border-dashed border-[#D4C4A0]/60 rounded-2xl text-[#1B2A4A]/60 font-sans font-bold">
                No active events loaded. Please add some events using the Admin system.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. Institutional Collaborations & Verified Records */}
      <section className="max-w-7xl mx-auto py-2">
        <div className="bg-[#EDE3CC] border border-[#D4C4A0] p-8 sm:p-14 rounded-[2rem] text-[#1B2A4A] flex flex-col lg:flex-row items-center justify-between gap-10 shadow-sm relative overflow-hidden">
          {/* Subtle Decorative elements */}
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-[#D4C4A0]/10 rounded-full blur-3xl translate-y-24 translate-x-12"></div>
          
          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="px-3.5 py-1 bg-[#F5EDD8] border border-[#D4C4A0] rounded-full text-xs font-bold font-mono text-[#1B2A4A] uppercase tracking-widest block w-fit">
              Sociological Volunteering Hour Tracker
            </span>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight font-display text-[#1B2A4A]">
              {content("home_certificate_title", "Earn Verified Social Service Hours")}
            </h3>
            <p className="text-sm sm:text-base text-[#1B2A4A]/85 font-semibold font-sans leading-relaxed">
              {content("home_certificate_desc", "Every NCSS volunteer receives formal, institutional certification recognized by the National Institute of Technology Lahore and partner international development bodies.")}
            </p>
          </div>
          <button
            onClick={() => setCurrentTab("join")}
            className="w-full lg:w-auto px-8 py-4 bg-[#1B2A4A] hover:bg-[#D4C4A0] text-[#F5EDD8] hover:text-[#1B2A4A] font-extrabold rounded-xl transition duration-300 shadow-sm hover:scale-[1.01] cursor-pointer text-center relative z-10"
          >
            Submit Join Form Now
          </button>
        </div>
      </section>
    </div>
  );
}
