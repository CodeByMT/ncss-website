export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  image_url: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  image_url: string;
}

export interface JoinRequest {
  id: string;
  name: string;
  email: string;
  department: string;
  interest: string;
  created_at: string;
}

export interface AdminEmail {
  id: string;
  email: string;
}

export interface BackendStatus {
  provider: 'local' | 'supabase';
  supabaseConfigured: boolean;
  supabaseUrl?: string;
}
