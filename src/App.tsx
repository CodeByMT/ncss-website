import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Heart, Loader2, Sparkles, Megaphone, FileText } from "lucide-react";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomeView from "./components/HomeView";
import AboutView from "./components/AboutView";
import EventsView from "./components/EventsView";
import TeamView from "./components/TeamView";
import JoinView from "./components/JoinView";
import ContactView from "./components/ContactView";
import AdminView from "./components/AdminView";

import { EventItem, Announcement, TeamMember, JoinRequest, AdminEmail, BackendStatus } from "./types";
import { supabase } from "./lib/supabaseClient";
import { DEFAULT_SITE_SETTINGS, DEFAULT_PAGES_CONTENT } from "./lib/constants";

export default function App() {
  const getInitialTab = () => {
    const path = window.location.pathname.replace(/\/$/, "");
    const hash = window.location.hash;
    
    if (path === "/admin" || path.endsWith("/admin") || hash === "#admin" || hash.endsWith("admin")) {
      return "admin";
    }
    if (hash) {
      const tab = hash.replace("#", "").split("?")[0];
      if (["home", "about", "events", "team", "join", "contact"].includes(tab)) {
        return tab;
      }
    }
    const cleanPath = path.substring(1).split("?")[0];
    if (cleanPath && ["home", "about", "events", "team", "join", "contact"].includes(cleanPath)) {
      return cleanPath;
    }
    return "home";
  };

  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [loading, setLoading] = useState<boolean>(true);

  // Database States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<JoinRequest[]>([]);
  const [admins, setAdmins] = useState<AdminEmail[]>([]);
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [pagesContent, setPagesContent] = useState<Record<string, string>>({});
  const [backendStatus, setBackendStatus] = useState<BackendStatus>({
    provider: "supabase",
    supabaseConfigured: true
  });

  // Pull data directly from Supabase database
  const refreshData = async () => {
    try {
      // 1. Public parameters
      const [eventsRes, annsRes, teamRes, settingsRes, contentRes] = await Promise.all([
        supabase.from("events").select("*").order("date", { ascending: false }),
        supabase.from("announcements").select("*").order("created_at", { ascending: false }),
        supabase.from("team_members").select("*"),
        supabase.from("site_settings").select("*"),
        supabase.from("pages_content").select("*")
      ]);

      const eventsData = eventsRes.data || [];
      const annsData = annsRes.data || [];
      const teamData = teamRes.data || [];

      const settingsDict = { ...DEFAULT_SITE_SETTINGS };
      if (settingsRes.data) {
        settingsRes.data.forEach((item: any) => {
          if (item.key) {
            settingsDict[item.key] = item.value;
          }
        });
      }

      const contentDict = { ...DEFAULT_PAGES_CONTENT };
      if (contentRes.data) {
        contentRes.data.forEach((item: any) => {
          if (item.key) {
            contentDict[item.key] = item.value;
          }
        });
      }

      setEvents(eventsData as EventItem[]);
      setAnnouncements(annsData as Announcement[]);
      setTeam(teamData as TeamMember[]);
      setSiteSettings(settingsDict);
      setPagesContent(contentDict);

      // Try reading active login credentials directly from Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        const [requestsRes, adminsRes] = await Promise.all([
          supabase.from("join_requests").select("*").order("created_at", { ascending: false }),
          supabase.from("admins").select("*")
        ]);

        setJoinRequests((requestsRes.data || []) as JoinRequest[]);
        setAdmins((adminsRes.data || []) as AdminEmail[]);
      }
    } catch (err) {
      console.error("Critical error conducting direct Supabase synchronization", err);
    } finally {
      setLoading(false);
    }
  };

  // Perform initial mount fetching and subscribe to auth changes
  useEffect(() => {
    refreshData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refreshData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sync state whenever the currentTab becomes 'admin' to pull recent registries
  useEffect(() => {
    if (currentTab === "admin") {
      refreshData();
    }
  }, [currentTab]);

  // URL-Routing logic to support direct /admin URI pathname access
  useEffect(() => {
    const handleUrlRouting = () => {
      const path = window.location.pathname.replace(/\/$/, "");
      const hash = window.location.hash;
      if (path === "/admin" || path.endsWith("/admin") || hash === "#admin" || hash.endsWith("admin")) {
        setCurrentTab("admin");
      } else if (hash) {
        const tab = hash.replace("#", "").split("?")[0];
        if (["home", "about", "events", "team", "join", "contact"].includes(tab)) {
          setCurrentTab(tab);
        }
      } else {
        const cleanPath = path.substring(1).split("?")[0];
        if (cleanPath && ["home", "about", "events", "team", "join", "contact"].includes(cleanPath)) {
          setCurrentTab(cleanPath);
        }
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  // Update window address history coordinate dynamically
  useEffect(() => {
    const path = window.location.pathname;
    if (currentTab === "admin") {
      if (path !== "/admin" && !path.endsWith("/admin")) {
        window.history.pushState(null, "", "/admin");
      }
    } else {
      if (path === "/admin" || path.endsWith("/admin")) {
        window.history.pushState(null, "", "/");
      }
      if (currentTab !== "home") {
        window.location.hash = `#${currentTab}`;
      } else {
        if (window.location.hash) {
          window.history.replaceState(null, "", window.location.pathname);
        }
      }
    }
  }, [currentTab]);

  // Page Routing Switch
  const renderActiveTab = () => {
    switch (currentTab) {
      case "home":
        return <HomeView events={events} setCurrentTab={setCurrentTab} pagesContent={pagesContent} />;
      case "about":
        return <AboutView pagesContent={pagesContent} />;
      case "events":
        return <EventsView events={events} />;
      case "team":
        return <TeamView team={team} />;
      case "join":
        return <JoinView />;
      case "contact":
        return <ContactView siteSettings={siteSettings} />;
      case "admin":
        return (
          <AdminView
            events={events}
            announcements={announcements}
            team={team}
            joinRequests={joinRequests}
            admins={admins}
            backendStatus={backendStatus}
            refreshData={refreshData}
            siteSettings={siteSettings}
            pagesContent={pagesContent}
          />
        );
      default:
        return <HomeView events={events} setCurrentTab={setCurrentTab} pagesContent={pagesContent} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5EDD8] flex flex-col items-center justify-center text-[#1B2A4A] space-y-4" id="applet-loading-screen">
        <Loader2 className="w-10 h-10 text-[#1B2A4A] animate-spin" />
        <div className="text-center">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[#1B2A4A]">NIT Portal Sync</h2>
          <p className="text-xs text-[#1B2A4A]/70 mt-1 font-medium">Downloading database parameters...</p>
        </div>
      </div>
    );
  }

  const latestAnnouncement = announcements[0];

  return (
    <div className="flex flex-col min-h-screen bg-[#F5EDD8] text-[#1B2A4A] font-sans antialiased" id="ncss-applet-root">
      
      {/* 1. Global Announcement Ticker Banner */}
      {latestAnnouncement && (
        <div className="bg-[#EDE3CC] text-[#1B2A4A] py-2 px-4 text-center text-xs font-bold flex items-center justify-center gap-2 border-b border-[#D4C4A0] relative z-50">
          <Megaphone className="w-4 h-4 text-[#1B2A4A]/80 shrink-0" />
          <span className="truncate max-w-xl font-display uppercase tracking-wider font-extrabold pr-4 sm:pr-0">
            Bulletin: {latestAnnouncement.title}
          </span>
          <button 
            onClick={() => setCurrentTab("events")} 
            className="underline underline-offset-2 text-[#1B2A4A] hover:text-[#1B2A4A]/80 shrink-0 hidden sm:inline"
          >
            Read details
          </button>
        </div>
      )}

      {/* 2. Brand Responsive Header */}
      <Navbar 
        currentTab={currentTab} 
        setCurrentTab={setCurrentTab} 
        backendProvider={backendStatus.provider} 
      />

      {/* 3. Main Dynamic Portal space */}
      <main className="flex-grow py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            id={`tab-container-${currentTab}`}
          >
            {renderActiveTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 4. Elegant Footer */}
      <Footer setCurrentTab={setCurrentTab} />
    </div>
  );
}

