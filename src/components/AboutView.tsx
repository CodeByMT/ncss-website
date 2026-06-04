import React from "react";
import { motion } from "motion/react";
import { Heart, ShieldCheck, Users, Sparkles, Sprout, Star, Milestone, Compass } from "lucide-react";

interface AboutViewProps {
  pagesContent?: Record<string, string>;
}

export default function AboutView({ pagesContent = {} }: AboutViewProps) {
  const content = (key: string, defaultValue: string) => pagesContent[key] || defaultValue;

  const values = [
    {
      title: "Service (Humanity First)",
      desc: "Delivering direct support, physiological relief, and developmental assistance to rural or under-resourced families.",
      icon: <Heart className="w-5 h-5 text-[#1B2A4A]" />
    },
    {
      title: "Collaboration & Trust",
      desc: "Partnering across student bodies, healthcare councils, and environmental boards to build highly efficient distribution lines.",
      icon: <Users className="w-5 h-5 text-[#1B2A4A]" />
    },
    {
      title: "Wellness & Safety",
      desc: "Organizing professional diagnostic camps, distributing sanitization modules, and spreading ecological security parameters.",
      icon: <ShieldCheck className="w-5 h-5 text-[#1B2A4A]" />
    },
    {
      title: "Sustainability (SDGs)",
      desc: "Engineering long-term impact strictly modeled on United Nations Sustainable Development Goals.",
      icon: <Sprout className="w-5 h-5 text-[#1B2A4A]" />
    }
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-6" id="about-view-container">
      
      {/* Vision & Mission Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-12 xl:col-span-7 space-y-6">
          <span className="px-3.5 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono block w-fit">
            {content("about_hero_tag", "Our Core Pillars")}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-display text-[#1B2A4A] tracking-tight leading-tight">
            {content("about_hero_title", "Empowering Campus and Surrounding Human Communities")}
          </h1>
          <p className="text-sm sm:text-base text-[#1B2A4A]/80 font-sans leading-relaxed font-semibold">
            {content("about_hero_desc", "The NIT Community Service Society (NCSS) is a premier institutional body at NIT Lahore dedicated to fostering a solid mindset of voluntary civic stewardship among engineering students.")}
          </p>
          <div className="border-l-4 border-[#1B2A4A] pl-4 py-3.5 italic text-[#1B2A4A]/80 text-sm font-sans bg-[#EDE3CC]/80 rounded-r-2xl border-y border-r border-[#D4C4A0] shadow-2xs">
            "{content("about_quote_text", "The best way to find yourself is to lose yourself in the service of others.")}" — <span className="font-bold text-[#1B2A4A]">{content("about_quote_author", "Mahatma Gandhi")}</span>
          </div>
        </div>

        {/* Vision Card panel */}
        <div className="lg:col-span-12 xl:col-span-5 space-y-6">
          {/* THE VISION (Navy theme converted to Cream) */}
          <div className="bg-[#EDE3CC] border border-[#D4C4A0] text-[#1B2A4A] rounded-2xl p-8 space-y-4 shadow-sm relative overflow-hidden group hover:border-[#1B2A4A] transition-all duration-300">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#D4C4A0]/10 rounded-full blur-xl"></div>
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#1B2A4A]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#1B2A4A] block font-extrabold">THE VISION</span>
            </div>
            <h3 className="text-xl font-bold font-display text-[#1B2A4A]">
              {content("about_vision_title", "Sovereign Social Responsibility")}
            </h3>
            <p className="text-xs sm:text-sm text-[#1B2A4A]/85 font-sans leading-relaxed font-semibold">
              {content("about_vision_desc", "We envision cultivating a class of globally conscious engineers and scholars who leverage intellectual methodologies to directly resolve urgent global issues in ecological sustainability, primary literacy, and healthcare deprivation.")}
            </p>
          </div>

          {/* THE MISSION (White with green subtle trace, converted to Cream) */}
          <div className="bg-[#EDE3CC] border border-[#D4C4A0] text-[#1B2A4A] rounded-2xl p-8 space-y-4 shadow-xs relative overflow-hidden group hover:shadow-sm transition-all duration-300">
            <div className="flex items-center gap-2">
              <Milestone className="w-4 h-4 text-[#1B2A4A]" />
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#1B2A4A] block font-extrabold">THE MISSION</span>
            </div>
            <h3 className="text-xl font-bold text-[#1B2A4A] font-display">
              {content("about_mission_title", "Immediate Local Actions")}
            </h3>
            <p className="text-xs sm:text-sm text-[#1B2A4A]/85 font-sans leading-relaxed font-semibold">
              {content("about_mission_desc", "To host localized healthcare diagnostics, rural youth tech-training programs, public food assistance structures, and environmental hygiene modules that alleviate suffering immediately, while fostering civic leadership skills in students.")}
            </p>
          </div>
        </div>
      </section>

      {/* Society Purpose Statement */}
      <section className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="max-w-4xl space-y-4">
          <span className="px-3 py-1 bg-[#F5EDD8] border border-[#D4C4A0] rounded-full text-xs font-bold text-[#1B2A4A] uppercase tracking-widest block w-fit">
            {content("about_exists_tag", "Objective at NIT")}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1B2A4A] font-display">
            {content("about_exists_title", "Why NCSS Exists")}
          </h2>
          <p className="text-sm sm:text-base text-[#1B2A4A]/85 leading-relaxed font-sans font-semibold">
            {content("about_exists_desc", "Through organized coordination and support from the National Institute of Technology Lahore faculty boards, NCSS provides students with structured avenues to contribute back to society. Instead of unstructured volunteering, NCSS drives calculated campaigns with measurable targets—ensuring corporate-level execution in altruistic undertakings.")}
          </p>
        </div>
      </section>

      {/* Values Grid */}
      <section className="space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#EDE3CC] border border-[#D4C4A0] rounded-full text-xs font-bold text-[#1B2A4A] font-mono">
            <Star className="w-3.5 h-3.5 text-[#1B2A4A]" />
            Core Values
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1B2A4A] font-display">The Principles We Strive For</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-[#EDE3CC] border border-[#D4C4A0] text-[#1B2A4A] rounded-2xl p-6 shadow-2xs flex items-start gap-4 hover:border-[#1B2A4A] transition-colors duration-300 group"
            >
              <div className="p-3 bg-[#F5EDD8] border border-[#D4C4A0] rounded-xl shrink-0 mt-1">
                {val.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="font-extrabold text-[#1B2A4A] text-base font-display group-hover:underline transition-colors">
                  {val.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#1B2A4A]/80 font-sans leading-relaxed font-semibold">{val.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
