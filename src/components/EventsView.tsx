import React, { useState } from "react";
import { Calendar, Search, MapPin } from "lucide-react";
import { EventItem } from "../types";

interface EventsViewProps {
  events: EventItem[];
}

export default function EventsView({ events }: EventsViewProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "upcoming" | "past">("all");

  const todayStr = new Date().toISOString().split("T")[0];

  const safeEvents = Array.isArray(events) ? events : [];

  const filteredEvents = safeEvents.filter((evt) => {
    // Search filter
    const matchesSearch =
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase());

    // Date dynamic categorization
    if (filterType === "upcoming") {
      return matchesSearch && evt.date >= todayStr;
    } else if (filterType === "past") {
      return matchesSearch && evt.date < todayStr;
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6" id="events-view-container">
      
      {/* Header and Filter Action Grid */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-8 border-b border-[#D4C4A0]">
        <div className="space-y-3">
          <span className="px-3 py-1 bg-[#EDE3CC] text-[#1B2A4A] border border-[#D4C4A0] rounded-full text-xs font-bold tracking-wider uppercase font-mono block w-fit">
            Social Action Matrix
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-[#1B2A4A] tracking-tight">
            Events & Volunteering Campaigns
          </h1>
          <p className="text-sm sm:text-base text-[#1B2A4A]/80 font-semibold max-w-xl font-sans leading-relaxed">
            Browse through our active social welfare calendars, ongoing fundraising profiles, and historically logged service reports.
          </p>
        </div>

        {/* Filter Selection Tabs (Sleek cream/navy Pill Layout) */}
        <div className="flex items-center bg-[#EDE3CC] p-1 rounded-xl border border-[#D4C4A0] text-xs font-bold self-start lg:self-end">
          <button
            id="btn-filter-all"
            onClick={() => setFilterType("all")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              filterType === "all" 
                ? "bg-[#1B2A4A] text-[#F5EDD8] shadow-xs" 
                : "text-[#1B2A4A]/80 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/30"
            }`}
          >
            All Actions ({safeEvents.length})
          </button>
          <button
            id="btn-filter-upcoming"
            onClick={() => setFilterType("upcoming")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              filterType === "upcoming" 
                ? "bg-[#1B2A4A] text-[#F5EDD8] shadow-xs" 
                : "text-[#1B2A4A]/80 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/30"
            }`}
          >
            Upcoming Active
          </button>
          <button
            id="btn-filter-past"
            onClick={() => setFilterType("past")}
            className={`px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
              filterType === "past" 
                ? "bg-[#1B2A4A] text-[#F5EDD8] shadow-xs" 
                : "text-[#1B2A4A]/80 hover:text-[#1B2A4A] hover:bg-[#D4C4A0]/30"
            }`}
          >
            Past Archives
          </button>
        </div>
      </div>

      {/* Modern Search Row */}
      <div className="flex items-center gap-3 bg-[#EDE3CC] border border-[#D4C4A0] focus-within:border-[#1B2A4A] focus-within:ring-1 focus-within:ring-[#1B2A4A] transition-all rounded-xl px-4 py-3 shadow-2xs max-w-md">
        <Search className="w-5 h-5 text-[#1B2A4A]/60 shrink-0" />
        <input
          type="text"
          id="event-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search campaigns, healthcare aid, tree plant..."
          className="w-full bg-transparent border-none text-sm text-[#1B2A4A] font-semibold placeholder-[#1B2A4A]/50 focus:outline-none"
        />
      </div>

      {/* Target Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((evt) => {
            const isUpcoming = evt.date >= todayStr;
            return (
              <div
                key={evt.id}
                id={`event-card-${evt.id}`}
                className="bg-[#EDE3CC] rounded-2xl border border-[#D4C4A0] overflow-hidden hover:shadow-md hover:border-[#1B2A4A] transition-all duration-300 flex flex-col h-full group"
              >
                {/* Poster image container */}
                <div className="h-56 overflow-hidden relative bg-[#E8D9BE]">
                  <img
                    src={evt.image_url || null}
                    alt={evt.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  />
                  
                  {/* Status Overlay Badge */}
                  <div className="absolute top-4 right-4">
                    <span className={`px-2.5 py-1 text-[9px] font-extrabold tracking-widest uppercase rounded-full shadow-md border ${
                      isUpcoming 
                        ? "bg-[#1B2A4A] border-[#D4C4A0] text-[#F5EDD8]" 
                        : "bg-[#F5EDD8]/95 border-[#D4C4A0] text-[#1B2A4A]"
                    }`}>
                      {isUpcoming ? "Active Campaign" : "Archived Record"}
                    </span>
                  </div>

                  {/* Date Overlay */}
                  <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-[#F5EDD8]/95 border border-[#D4C4A0] rounded-lg text-xs text-[#1B2A4A] font-bold tracking-wide font-sans flex items-center gap-1.5 shadow-sm">
                    <Calendar className="w-3.5 h-3.5 text-[#1B2A4A]" />
                    {evt.date}
                  </div>
                </div>

                {/* Event Details and Info */}
                <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-[#1B2A4A] text-lg sm:text-xl font-display transition-colors leading-snug">
                      {evt.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#1B2A4A]/80 leading-relaxed font-sans font-semibold">
                      {evt.description}
                    </p>
                  </div>

                  {/* Action/Location marker */}
                  <div className="pt-4 border-t border-[#D4C4A0]/65 flex items-center justify-between text-xs text-[#1B2A4A]/70">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#1B2A4A]" />
                      <span className="font-bold text-[#1B2A4A]/80">Lahore Circle Suburbs</span>
                    </div>
                    <span className="font-mono text-[9px] text-[#1B2A4A]/80 bg-[#F5EDD8] px-2 py-1 rounded border border-[#D4C4A0]">
                      REF: {evt.id.replace("event-", "NCSS-")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-3 text-center py-20 bg-[#EDE3CC] border border-dashed border-[#D4C4A0] rounded-2xl" id="events-empty-state">
            <span className="block text-[#1B2A4A]/60 text-sm font-bold">No results match your criteria. Try adjusting filters or searches.</span>
          </div>
        )}
      </div>
    </div>
  );
}
