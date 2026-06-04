import React, { useState, useEffect } from "react";
import { 
  KeyRound, Eye, EyeOff, ShieldCheck, Database, Calendar, Megaphone, 
  Users, UserPlus, Heart, LogOut, Plus, Trash2, Edit3, Check, Loader2,
  FileSpreadsheet, Sparkles, Upload, CloudLightning
} from "lucide-react";
import { EventItem, Announcement, TeamMember, JoinRequest, AdminEmail, BackendStatus } from "../types";
import { supabase } from "../lib/supabaseClient";
import { DEFAULT_SITE_SETTINGS, DEFAULT_PAGES_CONTENT } from "../lib/constants";

interface AdminViewProps {
  events: EventItem[];
  announcements: Announcement[];
  team: TeamMember[];
  joinRequests: JoinRequest[];
  admins: AdminEmail[];
  backendStatus: BackendStatus;
  refreshData: () => Promise<void>;
  siteSettings?: Record<string, string>;
  pagesContent?: Record<string, string>;
}

const safeParseJson = async (res: Response, fallbackError: string) => {
  const contentType = res.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    const rawText = await res.text().catch(() => "");
    const cleanText = rawText.length > 200 ? rawText.substring(0, 200) + "..." : rawText;
    throw new Error(`Server returned non-JSON response (status ${res.status}): ${cleanText}`);
  }
  try {
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data?.error || fallbackError);
    }
    if (data && typeof data === "object" && data.success === false) {
      throw new Error(data.error || fallbackError);
    }
    if (data && typeof data === "object" && "success" in data && "data" in data) {
      return data.data;
    }
    return data;
  } catch (err: any) {
    throw new Error(err.message || fallbackError);
  }
};

export default function AdminView({
  events,
  announcements,
  team,
  joinRequests,
  admins,
  backendStatus,
  refreshData,
  siteSettings = {},
  pagesContent = {}
}: AdminViewProps) {
  // Authentication State
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("ncss_admin_token"));
  const [adminEmail, setAdminEmail] = useState<string | null>(() => localStorage.getItem("ncss_admin_email"));

  // Keep AdminView's authentication state aligned automatically with active Supabase session in real time
  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const uEmail = session.user.email || "";
        localStorage.setItem("ncss_admin_token", session.access_token);
        localStorage.setItem("ncss_admin_email", uEmail);
        setToken(session.access_token);
        setAdminEmail(uEmail);
      } else {
        localStorage.removeItem("ncss_admin_token");
        localStorage.removeItem("ncss_admin_email");
        setToken(null);
        setAdminEmail(null);
      }
    };
    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const uEmail = session.user.email || "";
        localStorage.setItem("ncss_admin_token", session.access_token);
        localStorage.setItem("ncss_admin_email", uEmail);
        setToken(session.access_token);
        setAdminEmail(uEmail);
      } else {
        localStorage.removeItem("ncss_admin_token");
        localStorage.removeItem("ncss_admin_email");
        setToken(null);
        setAdminEmail(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  // Dashboard Navigation
  const [activeTab, setActiveTab] = useState<"events" | "announcements" | "team" | "requests" | "admins" | "config" | "cms">("events");

  // CMS state bindings (initialized with defaults or loaded API values)
  const [cmsSettings, setCmsSettings] = useState<Record<string, string>>({});
  const [cmsContent, setCmsContent] = useState<Record<string, string>>({});

  useEffect(() => {
    if (siteSettings && Object.keys(siteSettings).length > 0) {
      setCmsSettings(prev => {
        if (Object.keys(prev).length === 0 || activeTab !== "cms") {
          return { ...DEFAULT_SITE_SETTINGS, ...siteSettings };
        }
        return prev;
      });
    }
  }, [siteSettings, activeTab]);

  useEffect(() => {
    if (pagesContent && Object.keys(pagesContent).length > 0) {
      setCmsContent(prev => {
        if (Object.keys(prev).length === 0 || activeTab !== "cms") {
          return { ...DEFAULT_PAGES_CONTENT, ...pagesContent };
        }
        return prev;
      });
    }
  }, [pagesContent, activeTab]);

  // Mutative Action States
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState("");
  const [actionError, setActionError] = useState("");

  // Mutative form states
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", image_url: "" });

  const [editingAnnId, setEditingAnnId] = useState<string | null>(null);
  const [annForm, setAnnForm] = useState({ title: "", content: "" });

  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamForm, setTeamForm] = useState({ name: "", role: "", image_url: "" });

  const [newAdminEmail, setNewAdminEmail] = useState("");

  // Image upload handles for events/team (Drag and Drop + selection)
  const [dragActive, setDragActive] = useState(false);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);

  // Auto-fill dates based on current system date
  useEffect(() => {
    if (!eventForm.date) {
      setEventForm(prev => ({ ...prev, date: new Date().toISOString().split("T")[0] }));
    }
  }, [eventForm]);

  // Handle administrator login directly via Supabase Auth + check whitelist admins table
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    
    const emailStr = loginEmail.trim().toLowerCase();
    
    if (!emailStr) {
      setLoginError("Please provide an email coordinate.");
      return;
    }
    if (!loginPassword) {
      setLoginError("Please provide a password.");
      return;
    }

    setLoginLoading(true);

    try {
      // 1. Authenticate with Supabase password credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailStr,
        password: loginPassword,
      });

      if (error || !data.user || !data.session) {
        throw new Error(error?.message || "Invalid administrative credentials");
      }

      // 2. Validate session email against whitelisted admins table
      const { data: adminRecord, error: adminErr } = await supabase
        .from("admins")
        .select("email")
        .eq("email", emailStr)
        .maybeSingle();

      if (adminErr) {
        await supabase.auth.signOut();
        throw new Error("Unable to check admins whitelist table: " + adminErr.message);
      }

      if (!adminRecord) {
        // Log out immediately if user is not a whitelisted administrator
        await supabase.auth.signOut();
        throw new Error(`Access Denied: ${emailStr} is not registered in the admins whitelist.`);
      }

      // Successful login
      const tokenVal = data.session.access_token;
      localStorage.setItem("ncss_admin_token", tokenVal);
      localStorage.setItem("ncss_admin_email", emailStr);
      setToken(tokenVal);
      setAdminEmail(emailStr);
      setLoginEmail("");
      setLoginPassword("");
      await refreshData();
    } catch (err: any) {
      setLoginError(err.message || "Failed to authenticate.");
    } finally {
      setLoginLoading(false);
    }
  };

  // Sign out helper
  const handleSignout = async () => {
    localStorage.removeItem("ncss_admin_token");
    localStorage.removeItem("ncss_admin_email");
    setToken(null);
    setAdminEmail(null);
    await supabase.auth.signOut();
  };

  // Drag and drop events
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent, type: "event" | "team") => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
 
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0], type);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "event" | "team") => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0], type);
    }
  };

  const processFile = (file: File, type: "event" | "team") => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const base64Str = event.target.result as string;
        setUploadPreview(base64Str);
        if (type === "event") {
          setEventForm(prev => ({ ...prev, image_url: base64Str }));
        } else {
          setTeamForm(prev => ({ ...prev, image_url: base64Str }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // --------------------------------------------------------------------------
  // DIRECT SUPABASE CRUD MUTATION TRIGGERS
  // --------------------------------------------------------------------------

  // Events CRUD
  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setActionLoading(true);

    try {
      if (editingEventId) {
        const { error } = await supabase
          .from("events")
          .update({
            title: eventForm.title.trim(),
            description: eventForm.description.trim(),
            date: eventForm.date,
            image_url: eventForm.image_url.trim()
          })
          .eq("id", editingEventId);

        if (error) throw new Error(error.message);
        setActionMessage("Campaign updated successfully!");
      } else {
        const { error } = await supabase
          .from("events")
          .insert([{
            id: `event-${Date.now()}`,
            title: eventForm.title.trim(),
            description: eventForm.description.trim(),
            date: eventForm.date,
            image_url: eventForm.image_url.trim()
          }]);

        if (error) throw new Error(error.message);
        setActionMessage("New campaign created successfully!");
      }

      setEditingEventId(null);
      setEventForm({ title: "", description: "", date: "", image_url: "" });
      setUploadPreview(null);
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Failed to commit events change.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteEvent = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this event campaign? This action is irreversible.")) return;
    setActionError("");
    setActionMessage("");

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      setActionMessage("Event deleted successfully.");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Delete error.");
    }
  };

  // Announcements CRUD
  const saveAnn = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setActionLoading(true);

    try {
      if (editingAnnId) {
        const { error } = await supabase
          .from("announcements")
          .update({
            title: annForm.title.trim(),
            content: annForm.content.trim()
          })
          .eq("id", editingAnnId);

        if (error) throw new Error(error.message);
        setActionMessage("Announcement updated successfully!");
      } else {
        const { error } = await supabase
          .from("announcements")
          .insert([{
            id: `ann-${Date.now()}`,
            title: annForm.title.trim(),
            content: annForm.content.trim(),
            created_at: new Date().toISOString().split("T")[0]
          }]);

        if (error) throw new Error(error.message);
        setActionMessage("Announcement posted successfully!");
      }

      setEditingAnnId(null);
      setAnnForm({ title: "", content: "" });
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Could not save announcement");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteAnn = async (id: string) => {
    if (!window.confirm("Verify you want to delete this bulletin announcement?")) return;
    setActionError("");

    try {
      const { error } = await supabase
        .from("announcements")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      setActionMessage("Announcement deleted.");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Team CRUD
  const saveTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setActionLoading(true);

    try {
      if (editingTeamId) {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: teamForm.name.trim(),
            role: teamForm.role.trim(),
            image_url: teamForm.image_url.trim()
          })
          .eq("id", editingTeamId);

        if (error) throw new Error(error.message);
        setActionMessage("Leadership roster synchronized!");
      } else {
        const { error } = await supabase
          .from("team_members")
          .insert([{
            id: `team-${Date.now()}`,
            name: teamForm.name.trim(),
            role: teamForm.role.trim(),
            image_url: teamForm.image_url.trim()
          }]);

        if (error) throw new Error(error.message);
        setActionMessage("Leadership roster synchronized!");
      }

      setEditingTeamId(null);
      setTeamForm({ name: "", role: "", image_url: "" });
      setUploadPreview(null);
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Error syncing team profiles.");
    } finally {
      setActionLoading(false);
    }
  };

  const deleteTeam = async (id: string) => {
    if (!window.confirm("Delete this staff/leader role profile from the direct roster?")) return;
    setActionError("");

    try {
      const { error } = await supabase
        .from("team_members")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      setActionMessage("Roster profile deleted.");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Join Requests delete
  const deleteJoinRequest = async (id: string) => {
    if (!window.confirm("Mark application request as resolved/completed and remove from log?")) return;
    setActionError("");

    try {
      const { error } = await supabase
        .from("join_requests")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      setActionMessage("Join request resolved & deleted from queue.");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Admin emails management
  const addAdminEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");

    const normalizedEmail = newAdminEmail.trim().toLowerCase();

    if (!normalizedEmail || !normalizedEmail.includes("@")) {
      setActionError("Please provide a valid administrative format.");
      return;
    }

    try {
      const { error } = await supabase
        .from("admins")
        .insert([{
          id: `adm-${Date.now()}`,
          email: normalizedEmail
        }]);

      if (error) throw new Error(error.message);
      setActionMessage("Admin email authorized!");
      setNewAdminEmail("");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Error adding administrator email.");
    }
  };

  const removeAdminEmail = async (id: string) => {
    if (!window.confirm("Confirm you want to revoke administrative credentials for this email address?")) return;
    setActionError("");

    try {
      if (admins.length <= 1) {
        throw new Error("Cannot delete the last remaining administrator from the system.");
      }

      const { error } = await supabase
        .from("admins")
        .delete()
        .eq("id", id);

      if (error) throw new Error(error.message);
      setActionMessage("Admin privilege revoked.");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message);
    }
  };

  // Save Site Configuration settings
  const saveCmsSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setActionLoading(true);

    try {
      const items = Object.entries(cmsSettings).map(([key, value]) => ({
        key,
        value: String(value)
      }));

      const { error } = await supabase
        .from("site_settings")
        .upsert(items);

      if (error) throw new Error(error.message);
      setActionMessage("Institutional contact configurations updated successfully!");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Error saving configurations.");
    } finally {
      setActionLoading(false);
    }
  };

  // Save Website Texts and Page Content
  const saveCmsContent = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionError("");
    setActionMessage("");
    setActionLoading(true);

    try {
      const items = Object.entries(cmsContent).map(([key, value]) => {
        const group_name = key.startsWith("about_") ? "about" : "home";
        return {
          key,
          value: String(value),
          group_name
        };
      });

      const { error } = await supabase
        .from("pages_content")
        .upsert(items);

      if (error) throw new Error(error.message);
      setActionMessage("Website visual titles, taglines, and statistic indices updated successfully!");
      await refreshData();
    } catch (err: any) {
      setActionError(err.message || "Error saving content.");
    } finally {
      setActionLoading(false);
    }
  };


  // --------------------------------------------------------------------------
  // RENDER SECURITY SCREEN FOR PRE-AUTHENTICATION
  // --------------------------------------------------------------------------
  if (!token || !adminEmail) {
    return (
      <div className="max-w-md mx-auto px-4 py-16" id="admin-login-screen">
        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-3xl p-8 shadow-sm space-y-6 text-[#1B2A4A]">
          
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-[#1B2A4A] rounded-2xl flex items-center justify-center mx-auto text-[#F5EDD8] shadow-sm">
              <KeyRound className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-sans font-extrabold text-[#1B2A4A] tracking-tight">Administrative Login</h2>
            <p className="text-xs text-[#1B2A4A]/80 font-sans font-semibold">
              Access the secure NIT CSS data syncing console.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-xl text-xs text-red-800 flex items-center gap-2 font-bold">
              <span>{loginError}</span>
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4" id="admin-login-form">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">Authorized Email</label>
              <input
                type="email"
                id="admin-auth-email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@ncss.nit"
                className="w-full px-4 py-3 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] font-semibold"
                required
              />
            </div>

            <div className="space-y-1 relative">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-[#1B2A4A] uppercase tracking-wider">Access Password</label>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="admin-auth-password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-[#D4C4A0] rounded-xl text-sm focus:outline-none focus:border-[#1B2A4A] focus:ring-1 focus:ring-[#1B2A4A] text-[#1B2A4A] bg-[#F5EDD8] font-semibold"
                required
              />
              <button
                type="button"
                id="btn-toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 bottom-3.5 text-[#1B2A4A]/50 hover:text-[#1B2A4A]"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              id="btn-admin-submit"
              className="w-full py-3.5 bg-[#1B2A4A] hover:bg-[#D4C4A0] text-[#F5EDD8] hover:text-[#1B2A4A] font-extrabold rounded-xl tracking-wide transition duration-200 cursor-pointer disabled:bg-[#D4C4A0]/50"
            >
              {loginLoading ? "Authenticating Session..." : "Authorize Access"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // AUTHENTICATED SYSTEM CONSOLE CONTROL BOARD
  // --------------------------------------------------------------------------
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="admin-dashboard-arena">
      
      {/* 1. Header with details and sign out */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[#D4C4A0]">
        <div className="space-y-1.5 text-[#1B2A4A]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#EDE3CC] rounded-lg text-[#1B2A4A] inline-block"><ShieldCheck className="w-5 h-5" /></span>
            <span className="text-[10px] uppercase font-mono tracking-widest font-extrabold text-[#1B2A4A] bg-[#EDE3CC] border border-[#D4C4A0] px-2.5 py-0.5 rounded-full">NCSS Console Authority</span>
          </div>
          <h1 className="text-3xl font-sans font-bold tracking-tight text-[#1B2A4A]">Administrative Control Panel</h1>
          <p className="text-xs text-[#1B2A4A]/80 font-sans flex items-center gap-1.5 font-semibold">
            Signed in as: <strong className="text-[#1B2A4A]">{adminEmail}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSignout}
            id="btn-admin-signout"
            className="px-4 py-2.5 bg-[#EDE3CC] hover:bg-[#D4C4A0] text-[#1B2A4A] text-xs font-bold rounded-xl border border-[#D4C4A0] transition flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            Lock Console
          </button>
        </div>
      </div>

      {/* 2. Global Feedback Notifications */}
      {(actionMessage || actionError) && (
        <div className="animate-fade-in" id="dashboard-global-feedback">
          {actionMessage && (
            <div className="p-3 bg-green-100 border border-green-200 rounded-2xl text-xs text-green-800 flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 text-green-700" />
              <span>{actionMessage}</span>
            </div>
          )}
          {actionError && (
            <div className="p-3 bg-red-100 border border-red-200 rounded-2xl text-xs text-red-800 flex items-center gap-2 font-bold">
              <span>{actionError}</span>
            </div>
          )}
        </div>
      )}

      {/* 3. Fast Stats Indicators Row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        
        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-4.5 shadow-2xs flex items-center gap-3 text-[#1B2A4A]">
          <Calendar className="w-5 h-5 text-[#1B2A4A] shrink-0" />
          <div>
            <span className="block text-xl font-bold font-mono text-[#1B2A4A]">{events.length}</span>
            <span className="block text-[10px] text-[#1B2A4A]/70 font-bold uppercase tracking-wide">Total Events</span>
          </div>
        </div>

        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-4.5 shadow-2xs flex items-center gap-3 text-[#1B2A4A]">
          <Megaphone className="w-5 h-5 text-[#1B2A4A] shrink-0" />
          <div>
            <span className="block text-xl font-bold font-mono text-[#1B2A4A]">{announcements.length}</span>
            <span className="block text-[10px] text-[#1B2A4A]/70 font-bold uppercase tracking-wide">Announcements</span>
          </div>
        </div>

        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-4.5 shadow-2xs flex items-center gap-3 text-[#1B2A4A]">
          <Users className="w-5 h-5 text-[#1B2A4A] shrink-0" />
          <div>
            <span className="block text-xl font-bold font-mono text-[#1B2A4A]">{team.length}</span>
            <span className="block text-[10px] text-[#1B2A4A]/70 font-bold uppercase tracking-wide">Staff Roster</span>
          </div>
        </div>

        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-4.5 shadow-2xs flex items-center gap-3 relative overflow-hidden text-[#1B2A4A]">
          <UserPlus className="w-5 h-5 text-[#1B2A4A] shrink-0" />
          <div>
            <span className="block text-xl font-bold font-mono text-[#1B2A4A]">{joinRequests.length}</span>
            <span className="block text-[10px] text-[#1B2A4A]/70 font-bold uppercase tracking-wide">Join Requests</span>
          </div>
          {joinRequests.length > 0 && (
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#1B2A4A] animate-pulse"></span>
          )}
        </div>

        <div className="bg-[#EDE3CC] border border-[#D4C4A0] rounded-2xl p-4.5 shadow-2xs flex items-center gap-3 col-span-2 md:col-span-1 text-[#1B2A4A]">
          <Database className="w-5 h-5 text-[#1B2A4A] shrink-0" />
          <div>
            <span className="block text-xs font-bold font-mono text-[#1B2A4A] capitalize">{backendStatus.provider} Database</span>
            <span className="block text-[10px] text-[#1B2A4A]/70 font-bold uppercase tracking-wide">Storage Mode</span>
          </div>
        </div>
      </div>

      {/* 4. Navigation Panel & Main Interface layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Drawer */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "events", label: "Manage Events", icon: <Calendar className="w-4 h-4" /> },
            { id: "announcements", label: "Announcements", icon: <Megaphone className="w-4 h-4" /> },
            { id: "team", label: "Leadership Team", icon: <Users className="w-4 h-4" /> },
            { id: "requests", label: "Join Registries", icon: <UserPlus className="w-4 h-4" />, badge: joinRequests.length },
            { id: "admins", label: "Manage Admins", icon: <ShieldCheck className="w-4 h-4" /> },
            { id: "cms", label: "Edit Site Texts & CMS", icon: <FileSpreadsheet className="w-4 h-4" /> },
            { id: "config", label: "Database Link", icon: <CloudLightning className="w-4 h-4" /> },
          ].map((item) => (
            <button
              key={item.id}
              id={`btn-dash-tab-${item.id}`}
              onClick={() => {
                setActiveTab(item.id as any);
                setActionError("");
                setActionMessage("");
              }}
              className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold tracking-wide transition-all duration-200 flex items-center justify-between cursor-pointer ${
                activeTab === item.id
                  ? "bg-[#1B2A4A] text-[#F5EDD8] shadow-sm font-bold"
                  : "bg-[#EDE3CC] hover:bg-[#D4C4A0]/20 text-[#1B2A4A]"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-[#1B2A4A] text-[#F5EDD8] border border-[#D4C4A0] font-mono rounded-full px-2 py-0.5 text-[10px] font-bold">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Panel Canvas */}
        <div className="lg:col-span-3 bg-[#EDE3CC] border border-[#D4C4A0] rounded-3xl p-6 sm:p-8 shadow-xs text-[#1B2A4A]">
          
          {/* TAB 1: MANAGE EVENTS */}
          {activeTab === "events" && (
            <div className="space-y-8" id="admin-panel-events">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-sans text-slate-900">
                  {editingEventId ? "Edit Campaign details" : "Register a New Event/Initiative"}
                </h3>
                {editingEventId && (
                  <button
                    onClick={() => {
                      setEditingEventId(null);
                      setEventForm({ title: "", description: "", date: "", image_url: "" });
                      setUploadPreview(null);
                    }}
                    className="text-xs text-rose-600 font-bold hover:underline"
                  >
                    Cancel Edit Mode
                  </button>
                )}
              </div>

              {/* Event Editor Form */}
              <form onSubmit={saveEvent} className="space-y-5" id="admin-event-editor-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Campaign Title</label>
                    <input
                      type="text"
                      id="event-form-title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="e.g., Beach Sanitation Camp"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Operation Date</label>
                    <input
                      type="date"
                      id="event-form-date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs text-slate-800"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700 font-sans">Campaign Description</label>
                  <textarea
                    id="event-form-desc"
                    value={eventForm.description}
                    onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    placeholder="Short write-up regarding target SDGs, student requirements, and physical locations."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-sans"
                    required
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-700 block">Poster Image Selection (Drag & Drop or Url)</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Drag and drop selection slot */}
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={(e) => handleDrop(e, "event")}
                      className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer min-h-[140px] transition-colors ${
                        dragActive ? "border-emerald-500 bg-emerald-50/20" : "border-slate-200 hover:border-slate-300"
                      }`}
                      id="event-drag-drop-zone"
                    >
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-[10px] text-slate-500 font-sans">
                        Drag & Drop or <span className="text-emerald-700 font-bold underline">Choose Poster</span>
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "event")}
                        className="hidden"
                        id="event-file-selector"
                      />
                      <label htmlFor="event-file-selector" className="absolute inset-0 cursor-pointer opacity-0 z-10"></label>
                    </div>

                    {/* Image URL text input alternative */}
                    <div className="space-y-3.5 flex flex-col justify-between">
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-400 font-mono block">OR ENTER STATIC URL</span>
                        <input
                          type="text"
                          id="event-form-image"
                          value={eventForm.image_url}
                          onChange={(e) => {
                            setEventForm(prev => ({ ...prev, image_url: e.target.value }));
                            setUploadPreview(e.target.value);
                          }}
                          placeholder="https://images.unsplash.com/your-image"
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-[11px]"
                        />
                      </div>

                      {uploadPreview && (
                        <div className="h-14 rounded-lg overflow-hidden border border-slate-100 flex items-center gap-2.5 p-1 bg-slate-50 animate-fade-in">
                          <img src={uploadPreview || null} alt="Preview" className="w-12 h-full object-cover rounded-md shrink-0" referrerPolicy="no-referrer" />
                          <span className="text-[10px] text-emerald-700 font-semibold truncate font-mono">Ready to commit!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-50 flex justify-end">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    id="btn-event-save-trigger"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    {editingEventId ? "Update Campaign Details" : "Publish Campaign Page"}
                  </button>
                </div>
              </form>

              {/* Read/Delete listing */}
              <div className="space-y-3.5 pt-4">
                <span className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Current Campaign Log entries</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20" id="admin-events-list">
                  {events.map((evt) => (
                    <div key={evt.id} className="p-4 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <img src={evt.image_url || null} alt="" className="w-10 h-10 object-cover rounded-lg shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <span className="block text-xs font-bold text-slate-900 leading-tight">{evt.title}</span>
                          <span className="block text-[10px] font-mono text-slate-400 mt-0.5">{evt.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            setEditingEventId(evt.id);
                            setEventForm({ title: evt.title, description: evt.description, date: evt.date, image_url: evt.image_url });
                            setUploadPreview(evt.image_url);
                          }}
                          className="p-1.5 bg-slate-50 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 rounded transition"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteEvent(evt.id)}
                          className="p-1.5 bg-slate-50 hover:bg-rose-100 text-slate-600 hover:text-rose-700 rounded transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE ANNOUNCEMENTS */}
          {activeTab === "announcements" && (
            <div className="space-y-8" id="admin-panel-announcements">
              <div className="pb-4 border-b border-secondary">
                <h3 className="text-lg font-bold font-sans text-slate-900">Post Announcement Bulletin</h3>
              </div>

              <form onSubmit={saveAnn} className="space-y-4" id="admin-ann-editor-form">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Bulletin Headline</label>
                  <input
                    type="text"
                    id="ann-form-title"
                    value={annForm.title}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Environmental Board collaborative drives open next week"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Announcement body / paragraphs</label>
                  <textarea
                    id="ann-form-content"
                    value={annForm.content}
                    onChange={(e) => setAnnForm(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    placeholder="Provide full bulletin coordinates. Supporting links can be pasted as text blocks."
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs"
                    required
                  ></textarea>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    id="btn-ann-save-trigger"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                    Commit Bulletin Post
                  </button>
                </div>
              </form>

              {/* Bulletin elements */}
              <div className="space-y-3 pt-4">
                <span className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Bulletin Log history</span>
                <div className="space-y-3" id="admin-ann-list">
                  {announcements.map((ann) => (
                    <div key={ann.id} className="p-4 border border-slate-100 rounded-2xl bg-white hover:shadow-2xs transition-shadow">
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span className="text-xs font-bold text-slate-900 block leading-snug">{ann.title}</span>
                        <button
                          onClick={() => deleteAnn(ann.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded transition shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-3 font-sans leading-relaxed">{ann.content}</p>
                      <span className="inline-block text-[9px] font-mono text-slate-400 mt-2">Posted on {ann.created_at}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: LEADERSHIP ROSTER */}
          {activeTab === "team" && (
            <div className="space-y-8" id="admin-panel-team">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-sans text-slate-900">Add leadership role profiles</h3>
              </div>

              <form onSubmit={saveTeam} className="space-y-4" id="admin-team-editor-form">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700">Official Leader Name</label>
                    <input
                      type="text"
                      id="team-form-name"
                      value={teamForm.name}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Sarah Ahmed"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-700 font-sans">Role / Position Title</label>
                    <input
                      type="text"
                      id="team-form-role"
                      value={teamForm.role}
                      onChange={(e) => setTeamForm(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="e.g., General Secretary"
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-700">Profile Image (Static URL or file upload)</label>
                  <input
                    type="text"
                    id="team-form-image"
                    value={teamForm.image_url}
                    onChange={(e) => setTeamForm(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Paste Unsplash link or load photo file"
                    className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                  <div className="pt-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "team")}
                      className="text-xs file:mr-2 file:py-1.5 file:px-3 file:border-0 file:text-[11px] file:text-white file:bg-emerald-600 file:rounded-md"
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-2 border-t border-slate-100">
                  <button
                    type="submit"
                    disabled={actionLoading}
                    id="btn-team-save-trigger"
                    className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                  >
                    Commit Leader Profile
                  </button>
                </div>
              </form>

              {/* Listing profiles */}
              <div className="space-y-3 pt-4">
                <span className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Leadership catalog Entries</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="admin-team-list">
                  {team.map((m) => (
                    <div key={m.id} className="p-3 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 bg-white">
                      <div className="flex items-center gap-2.5">
                        <img src={m.image_url || null} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                        <div>
                          <span className="block text-xs font-bold text-slate-900 leading-tight">{m.name}</span>
                          <span className="block text-[10px] text-emerald-800 font-semibold">{m.role}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteTeam(m.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIEW JOIN REQUESTS */}
          {activeTab === "requests" && (
            <div className="space-y-6" id="admin-panel-requests">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold font-sans text-slate-900">Student Signups & Join Registries</h3>
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-semibold">
                  Queue count: {joinRequests.length}
                </span>
              </div>

              <div className="space-y-4" id="admin-requests-list">
                {joinRequests.length > 0 ? (
                  joinRequests.map((req) => (
                    <div key={req.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/40 relative space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div>
                          <strong className="block text-xs text-slate-950 font-bold">{req.name}</strong>
                          <span className="block text-[10px] text-slate-500 mt-0.5 font-sans">
                            Dept: <strong className="text-slate-700">{req.department}</strong> | Email: <strong className="text-emerald-700">{req.email}</strong>
                          </span>
                        </div>
                        <button
                          onClick={() => deleteJoinRequest(req.id)}
                          className="px-2.5 py-1.5 bg-white border border-slate-200 text-[10px] text-emerald-700 font-semibold uppercase tracking-wider rounded-lg hover:bg-emerald-50 hover:text-emerald-700 transition shadow-2xs self-start sm:self-center"
                        >
                          Resolve & close
                        </button>
                      </div>
                      <div>
                        <span className="block text-[10px] uppercase tracking-widest font-mono text-slate-400 font-semibold mb-1">Interest / Skills Motivation:</span>
                        <p className="text-[11px] sm:text-xs text-slate-600 font-sans leading-relaxed whitespace-pre-line p-3 bg-white rounded-xl border border-slate-100 italic">
                          "{req.interest}"
                        </p>
                      </div>
                      <span className="block text-[9px] text-slate-400 font-mono">Submitted on {new Date(req.created_at).toLocaleString()}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-250 border-spacing-8">
                    <span className="text-slate-400 text-xs font-semibold font-sans">Queue is empty. No registration requests recorded currently.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 5: MANAGE ADMIN LIST */}
          {activeTab === "admins" && (
            <div className="space-y-6" id="admin-panel-admins-list">
              <div className="pb-4 border-b border-slate-100">
                <h3 className="text-lg font-bold font-sans text-slate-900">Authorize Administrator emails</h3>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-[11px] sm:text-xs text-emerald-950/90 leading-relaxed font-sans">
                Only email addresses explicitly cataloged in this table can login to the NCSS Dashboard, make updates, modify event bulletins, or register additional admin emails.
              </div>

              {/* Add admin email form */}
              <form onSubmit={addAdminEmail} className="flex gap-2 max-w-md" id="admin-add-form">
                <input
                  type="email"
                  id="target-new-admin-email"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                  placeholder="e.g., ahmed.cs@student.nit.edu"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  required
                />
                <button
                  type="submit"
                  id="btn-admin-add"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs whitespace-nowrap cursor-pointer"
                >
                  Authorize Email
                </button>
              </form>

              {/* Administrators list database */}
              <div className="space-y-2 pt-2">
                <span className="block text-xs uppercase font-mono tracking-wider font-bold text-slate-400">Current Administrative Officers</span>
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden shadow-3xs" id="admin-admins-list">
                  {admins.map((adm) => (
                    <div key={adm.id} className="p-3 flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors text-xs">
                      <span className="font-sans font-semibold text-slate-900">{adm.email}</span>
                      <button
                        onClick={() => removeAdminEmail(adm.id)}
                        className="text-slate-400 hover:text-rose-600 transition p-1 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* TAB 5.5: WEBSITE TEXTS & CMS CONFIGURATIONS */}
          {activeTab === "cms" && (
            <div className="space-y-8 animate-fade-in" id="admin-panel-cms-settings">
              <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-sans text-slate-900">CMS Section & Site Settings</h3>
                  <p className="text-xs text-slate-500 mt-1">Directly edit any general text element or metric index across the portal pages without writing code.</p>
                </div>
                <div className="text-[10px] bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-bold uppercase tracking-wider font-mono">
                  Fully Integrated fallbacks
                </div>
              </div>

              {/* SECTION A: SITE KEY CONTACTS */}
              <div className="space-y-4 border border-slate-100 rounded-3xl p-6 bg-slate-50/40">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="p-1.5 bg-emerald-150 text-emerald-700 rounded-lg text-xs font-bold leading-none shrink-0">1</span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">University Contacts & Coordinates</h4>
                </div>

                <form onSubmit={saveCmsSettings} className="space-y-4" id="cms-settings-subform">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Authorized Email</label>
                      <input
                        type="email"
                        value={cmsSettings.contact_email ?? ""}
                        onChange={(e) => setCmsSettings(prev => ({ ...prev, contact_email: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Telephone Coordinates</label>
                      <input
                        type="text"
                        value={cmsSettings.contact_phone ?? ""}
                        onChange={(e) => setCmsSettings(prev => ({ ...prev, contact_phone: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Instagram Handle</label>
                      <input
                        type="text"
                        value={cmsSettings.instagram_username ?? ""}
                        onChange={(e) => setCmsSettings(prev => ({ ...prev, instagram_username: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Societies consultation Hours</label>
                      <input
                        type="text"
                        value={cmsSettings.consultation_hours ?? ""}
                        onChange={(e) => setCmsSettings(prev => ({ ...prev, consultation_hours: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Societies Headquarters Location Address</label>
                    <input
                      type="text"
                      value={cmsSettings.contact_address ?? ""}
                      onChange={(e) => setCmsSettings(prev => ({ ...prev, contact_address: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300 transition-colors"
                  >
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Save University Coordinates & Contacts
                  </button>
                </form>
              </div>

              {/* SECTION B: HOMEPAGE TEXTS */}
              <div className="space-y-4 border border-slate-100 rounded-3xl p-6 bg-slate-50/40">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="p-1.5 bg-emerald-150 text-emerald-700 rounded-lg text-xs font-bold leading-none shrink-0">2</span>
                  <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Homepage Hero & Statistics</h4>
                </div>

                <form onSubmit={saveCmsContent} className="space-y-5" id="cms-content-subform">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Hero Spotlight Badge Tag</label>
                      <input
                        type="text"
                        value={cmsContent.home_hero_badge ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_hero_badge: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                    <div className="space-y-1 md:col-span-1">
                      <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Hero Primary Display Title</label>
                      <input
                        type="text"
                        value={cmsContent.home_hero_title ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_hero_title: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Hero Narrative Tagline Description</label>
                    <textarea
                      value={cmsContent.home_hero_tagline ?? ""}
                      onChange={(e) => setCmsContent(prev => ({ ...prev, home_hero_tagline: e.target.value }))}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                      rows={3}
                      required
                    />
                  </div>

                  {/* Quantitative Stats Counters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4.5 bg-white border rounded-2xl">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Lives Counter</label>
                      <input
                        type="text"
                        value={cmsContent.home_stats_lives ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_lives: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={cmsContent.home_stats_lives_label ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_lives_label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Drives Counter</label>
                      <input
                        type="text"
                        value={cmsContent.home_stats_completed ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_completed: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={cmsContent.home_stats_completed_label ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_completed_label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Active Volunteers</label>
                      <input
                        type="text"
                        value={cmsContent.home_stats_volunteers ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_volunteers: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={cmsContent.home_stats_volunteers_label ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_volunteers_label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">Sustainable Focus</label>
                      <input
                        type="text"
                        value={cmsContent.home_stats_sdg ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_sdg: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[11px] font-mono"
                        required
                      />
                      <input
                        type="text"
                        value={cmsContent.home_stats_sdg_label ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, home_stats_sdg_label: e.target.value }))}
                        className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-[10px]"
                        required
                      />
                    </div>
                  </div>

                  <hr className="border-slate-100" />

                  {/* ABOUT PAGE SECTIONS */}
                  <div className="space-y-4">
                    <h5 className="text-[11px] font-extrabold uppercase font-mono tracking-wider text-slate-400">About Page Context Content</h5>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Vision Statement Title</label>
                        <input
                          type="text"
                          value={cmsContent.about_vision_title ?? ""}
                          onChange={(e) => setCmsContent(prev => ({ ...prev, about_vision_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          required
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-slate-600">Mission Statement Title</label>
                        <input
                          type="text"
                          value={cmsContent.about_mission_title ?? ""}
                          onChange={(e) => setCmsContent(prev => ({ ...prev, about_mission_title: e.target.value }))}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Vision Statement text</label>
                      <textarea
                        value={cmsContent.about_vision_desc ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, about_vision_desc: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Mission Statement text</label>
                      <textarea
                        value={cmsContent.about_mission_desc ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, about_mission_desc: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        rows={2}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Mahatma Gandhi/Advisor Citation Quote</label>
                      <input
                        type="text"
                        value={cmsContent.about_quote_text ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, about_quote_text: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Citation Author Name</label>
                      <input
                        type="text"
                        value={cmsContent.about_quote_author ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, about_quote_author: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-bold text-slate-600">Why NCSS Exists Statement Text</label>
                      <textarea
                        value={cmsContent.about_exists_desc ?? ""}
                        onChange={(e) => setCmsContent(prev => ({ ...prev, about_exists_desc: e.target.value }))}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                        rows={2}
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 cursor-pointer disabled:bg-slate-300 transition-colors"
                  >
                    {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                    Save Page text Content Changes
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 6: DATABASE CONFIGURATION LINK GUIDES */}
          {activeTab === "config" && (
            <div className="space-y-6" id="admin-panel-config">
              <div className="pb-4 border-b border-secondary flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600 shrink-0" />
                <h3 className="text-lg font-bold font-sans text-slate-900 uppercase">Database connection Status</h3>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-slate-50 border rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className={`h-2.5 w-2.5 rounded-full ${backendStatus.supabaseConfigured ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                    <span>Provider mode: <strong className="uppercase">{backendStatus.supabaseConfigured ? "Supabase" : "Supabase Pending Setup"}</strong></span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed font-sans">
                    {backendStatus.supabaseConfigured 
                      ? "Connected successfully to live production Supabase Postgres databases. All writes and reads synchronize immediately in real time!" 
                      : "Supabase connection is pending. Please configure your environment variables (SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY) to activate your live database."
                    }
                  </p>
                </div>

                <div className="space-y-3.5">
                  <h4 className="text-sm font-bold text-slate-900">How to transition this portal to your production Supabase:</h4>
                  <ol className="list-decimal list-inside text-xs text-slate-600 space-y-2 font-sans pl-1">
                    <li>Create a professional account on <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline font-bold">Supabase (it-is 100% free)</a>.</li>
                    <li>Launch a New Project (e.g. named <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-600">ncss-nit-portal</code>).</li>
                    <li>Click on the SQL Editor menu in your project sidebar.</li>
                    <li>Open search or browse your root deployment workspace for the <strong className="text-slate-800">`/SUPABASE_SETUP.md`</strong> documentation file that this script created for you!</li>
                    <li>Copy and run the PostgreSQL table creation codes & row level security policies listed there.</li>
                    <li>Go to project settings, grab your Supabase connection strings, and specify these variables in your platform settings dashboard or <code className="bg-slate-100 px-1 rounded font-mono">.env</code>:</li>
                  </ol>
                  
                  <pre className="p-4 bg-slate-900 text-slate-200 rounded-xl text-[10px] font-mono leading-relaxed overflow-x-auto">
{`SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-anon-key..."
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key..."`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
