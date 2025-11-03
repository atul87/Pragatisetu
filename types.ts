
export type Theme = 'light' | 'dark';
export type Language = 'en' | 'hi';

export type UserRole = 'citizen' | 'admin';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
}

export const CATEGORIES = [
  "Roads & Potholes",
  "Water Supply & Leakage",
  "Garbage & Waste Disposal",
  "Street Lights",
  "Public Parks & Recreation",
  "Sewage & Drainage",
  "Illegal Construction",
  "Public Transport",
  "Other"
] as const;

export type IssueCategory = typeof CATEGORIES[number];

export const STATUSES = [
  'Submitted',
  'Acknowledged',
  'In Progress',
  'Resolved',
  'Rejected'
] as const;

export type IssueStatus = typeof STATUSES[number];

export type Priority = 'Low' | 'Medium' | 'High';

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: IssueCategory;
  status: IssueStatus;
  priority: Priority;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  imageUrl?: string;
  submittedBy: string;
  submittedDate: string;
  lastUpdated: string;
  assignedTo?: string;
  upvotes: number;
}

export type CitizenView = 'dashboard' | 'report-issue' | 'track-issues';
export type AdminView = 'dashboard' | 'manage-issues' | 'reports' | 'map-view';
export type View = CitizenView | AdminView;

export interface Translations {
  [key: string]: {
    en: string;
    hi: string;
  };
}