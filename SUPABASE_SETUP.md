# Supabase PostgreSQL Database Setup Guide

Follow these single-step SQL instructions to configure your secure, recursive-free, and production-ready Supabase database for the **NIT Community Service Society (NCSS)** portal.

---

## 1. Complete Database SQL Schema and Policies
Go to your **Supabase Dashboard**, open your project, go to the **SQL Editor**, create a **New Query**, and paste the entire block of code below. Click **Run** to execute.

```sql
-- Disable target triggers for schema definition helper
SET statement_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

-- ----------------------------------------------------
-- 1. DROP EXISTING TABLES AND POLICIES FOR CLEAN SETUP
-- ----------------------------------------------------
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.announcements CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TABLE IF EXISTS public.join_requests CASCADE;
DROP TABLE IF EXISTS public.admins CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.pages_content CASCADE;

-- ----------------------------------------------------
-- 2. CREATE STANDARD SYSTEM TABLES (TEXT IDs ONLY)
-- ----------------------------------------------------
CREATE TABLE public.events (
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL,
    description text NOT NULL,
    date date NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.announcements (
    id text NOT NULL PRIMARY KEY,
    title text NOT NULL,
    content text NOT NULL,
    created_at date NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE public.team_members (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    role text NOT NULL,
    image_url text NOT NULL
);

CREATE TABLE public.join_requests (
    id text NOT NULL PRIMARY KEY,
    name text NOT NULL,
    email text NOT NULL,
    department text NOT NULL,
    interest text NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE public.admins (
    id text NOT NULL PRIMARY KEY,
    email text NOT NULL UNIQUE
);

CREATE TABLE public.site_settings (
    key text NOT NULL PRIMARY KEY,
    value text NOT NULL
);

CREATE TABLE public.pages_content (
    key text NOT NULL PRIMARY KEY,
    value text NOT NULL,
    group_name text NOT NULL
);

-- Enable Row Level Security (RLS) on all system tables
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages_content ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- 3. RESET AND GRANT PROPER ROLE PERMISSIONS
-- ----------------------------------------------------
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- ----------------------------------------------------
-- 4. INSERT ALT_SEED CORE STARTUP RECORDS
-- ----------------------------------------------------
INSERT INTO public.admins (id, email) VALUES
('adm-1', 'm.talha.ch006@gmail.com'),
('adm-2', 'admin@ncss.nit')
ON CONFLICT (email) DO NOTHING;

INSERT INTO public.events (id, title, description, date, image_url) VALUES
('event-1', 'SDG Clean Energy & Climate Action Drive', 'Campus-wide energy initiative delivering community programs on sustainable energy.', '2026-05-12', 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80'),
('event-2', 'Community Health & Wellness Medical Camp', 'Basic medical diagnostics, physiological mapping and hygiene kits distribution.', '2026-04-18', 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80'),
('event-3', 'Youth Literacy & Skill-Share Workshop', 'Volunteers teaching governent school kids digital literacy and distributing stationary.', '2026-03-05', 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.announcements (id, title, content, created_at) VALUES
('ann-1', 'NCSS Recruitments 2026: Join the Movement', 'Applications are open. Volunteer and make a social impact.', '2026-06-01'),
('ann-2', 'Partnership with National Environmental Board', 'Tree plantation drives targeting 5 zones. Registrations start Monday.', '2026-05-24')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.team_members (id, name, role, image_url) VALUES
('team-1', 'Prof. Dr. Irfan Malik', 'Faculty Advisor', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
('team-2', 'Sarah Ahmed', 'President', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
('team-3', 'Usman Tariq', 'Vice President (Admin)', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
('team-4', 'Ayesha Khan', 'Vice President (Operations)', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80'),
('team-5', 'Fahad Mahmood', 'General Secretary', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'),
('team-6', 'Zainab Rizwan', 'General Treasurer', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80')
ON CONFLICT (id) DO NOTHING;

-- ----------------------------------------------------
-- 5. RECURSION-FREE ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------

-- --- TABLE: public.admins ---
-- Allow SELECT for any authenticated session so users can check whitelist on login, completely recursive-free
CREATE POLICY "Admins Select for Authenticated" ON public.admins
    FOR SELECT TO authenticated USING (true);

-- Allow Insert, Update, and Delete only if the admin email matches active whitelist entry from user token
CREATE POLICY "Admins Insert for Admin Whitelist" ON public.admins
    FOR INSERT TO authenticated WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

CREATE POLICY "Admins Update for Admin Whitelist" ON public.admins
    FOR UPDATE TO authenticated USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins)) WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

CREATE POLICY "Admins Delete for Admin Whitelist" ON public.admins
    FOR DELETE TO authenticated USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.events ---
CREATE POLICY "Events Select for All" ON public.events
    FOR SELECT TO public USING (true);

CREATE POLICY "Events CRUD for Whitelist" ON public.events
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.announcements ---
CREATE POLICY "Announcements Select for All" ON public.announcements
    FOR SELECT TO public USING (true);

CREATE POLICY "Announcements CRUD for Whitelist" ON public.announcements
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.team_members ---
CREATE POLICY "Team Members Select for All" ON public.team_members
    FOR SELECT TO public USING (true);

CREATE POLICY "Team Members CRUD for Whitelist" ON public.team_members
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.join_requests ---
CREATE POLICY "Join Requests Public Insert" ON public.join_requests
    FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "Join Requests CRUD for Whitelist" ON public.join_requests
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.site_settings ---
CREATE POLICY "Site Settings Select for All" ON public.site_settings
    FOR SELECT TO public USING (true);

CREATE POLICY "Site Settings CRUD for Whitelist" ON public.site_settings
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));

-- --- TABLE: public.pages_content ---
CREATE POLICY "Pages Content Select for All" ON public.pages_content
    FOR SELECT TO public USING (true);

CREATE POLICY "Pages Content CRUD for Whitelist" ON public.pages_content
    FOR ALL TO authenticated
    USING (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins))
    WITH CHECK (auth.jwt() ->> 'email' IN (SELECT email FROM public.admins));
```

---

## 2. Storage Setup Notes
1. Navigate to **Storage** under your Supabase Project dashboard.
2. Create a public bucket with the name `ncss-images`.
3. Add a suitable policy to allow public select read access.
