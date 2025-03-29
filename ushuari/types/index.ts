// types/index.ts
export type UserRole = "admin" | "organization" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  organizationId?: string;
}

export interface Case {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "resolved" | "rejected";
  createdAt: string;
  userId: string;
  organizationId?: string;
  audioUrl?: string;
  transcription?: string;
  priority: "low" | "medium" | "high" | "urgent";
}

export interface Organization {
  id: string;
  name: string;
  email: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  contactPerson: string;
  specialties?: string[];
}
