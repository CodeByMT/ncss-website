import React from "react";
import { Users, GraduationCap, ShieldCheck, Heart } from "lucide-react";
import { TeamMember } from "../types";

interface TeamViewProps {
  team: TeamMember[];
}

export default function TeamView({ team }: TeamViewProps) {
  // Categorize standard seeded members or fallback sorting
  const faculty = team.filter((m) => m.role.toLowerCase().includes("faculty") || m.role.toLowerCase().includes("advisor"));
  const coreExecs = team.filter((m) => m.role.toLowerCase().includes("president") && !m.role.toLowerCase().includes("vice"));
  const vicePresidents = team.filter((m) => m.role.toLowerCase().includes("vice president"));
  const managers = team.filter((m) => 
    !m.role.toLowerCase().includes("faculty") && 
    !m.role.toLowerCase().includes("advisor") && 
    !m.role.toLowerCase().includes("president") &&
    !m.role.toLowerCase().includes("vice president")
  );

  const renderMemberCard = (m: TeamMember) => (
    <div
      key={m.id}
      className="bg-[#EDE3CC] rounded-2xl border border-[#D4C4A0] overflow-hidden hover:shadow-md transition-all duration-300 group p-6 flex flex-col items-center text-center relative"
      id={`team-card-${m.id}`}
    >
      {/* Decorative vertical colored pill inside card */}
      <div className="absolute top-0 inset-x-0 h-1.5 bg-[#1B2A4A]"></div>

      <div className="w-28 h-28 rounded-full overflow-hidden relative border-4 border-[#F5EDD8] bg-[#F5EDD8] mb-5 shrink-0 shadow-xs group-hover:scale-102 transition-all duration-300">
        <img
          src={m.image_url || null}
          alt={m.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500"
        />
      </div>
      <div className="space-y-1.5 flex-grow">
        <h4 className="font-bold text-[#1B2A4A] tracking-tight text-base sm:text-lg font-display">
          {m.name}
        </h4>
        <p className="inline-flex px-3 py-1 bg-[#F5EDD8] text-[#1B2A4A] text-[10px] font-extrabold uppercase tracking-widest rounded-full leading-none border border-[#D4C4A0]">
          {m.role}
        </p>
      </div>

      <div className="w-full h-px bg-[#D4C4A0]/60 my-4"></div>
      <p className="text-[10px] uppercase font-mono tracking-widest text-[#1B2A4A]/60 font-bold">NIT Lahore Committee</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto space-y-16 py-6" id="team-view-container">
      
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3 pb-8 border-b border-[#D4C4A0]">
        <span className="px-3.5 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono inline-block">
          Advisory & Committee
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1B2A4A] tracking-tight">
          Our Society Leadership
        </h1>
        <p className="text-sm sm:text-base text-[#1B2A4A]/80 font-semibold font-sans leading-relaxed">
          Meet the officers, volunteers, and faculty mentors guiding community service drives across Lahore and surrounding community suburbs.
        </p>
      </div>

      {/* 1. Academic Mentorship Column */}
      {faculty.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-2 justify-center">
            <GraduationCap className="w-5 h-5 text-[#1B2A4A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] font-display tracking-tight">
              Faculty Advisory Board
            </h2>
          </div>
          <div className="flex justify-center flex-wrap gap-8">
            {faculty.map((m) => (
              <div key={m.id} className="max-w-[280px] w-full">
                {renderMemberCard(m)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 2. Core Presidential Offices */}
      {coreExecs.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-2 justify-center">
            <ShieldCheck className="w-5 h-5 text-[#1B2A4A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] font-display tracking-tight">
              Presidential Office
            </h2>
          </div>
          <div className="flex justify-center flex-wrap gap-8">
            {coreExecs.map((m) => (
              <div key={m.id} className="max-w-[280px] w-full">
                {renderMemberCard(m)}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 3. Vice Presidents */}
      {vicePresidents.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-2 justify-center">
            <Users className="w-5 h-5 text-[#1B2A4A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] font-display tracking-tight">
              Vice Presidents
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {vicePresidents.map((m) => renderMemberCard(m))}
          </div>
        </section>
      )}

      {/* 4. Society Secretariat / Treasury Controllers */}
      {managers.length > 0 && (
        <section className="space-y-8">
          <div className="flex items-center gap-2 justify-center">
            <Heart className="w-5 h-5 text-[#1B2A4A]" />
            <h2 className="text-xl sm:text-2xl font-bold text-[#1B2A4A] font-display tracking-tight">
              General Committee Officers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {managers.map((m) => renderMemberCard(m))}
          </div>
        </section>
      )}
    </div>
  );
}
