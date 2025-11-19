export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  VIEWER = 'VIEWER'
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
}

export enum ProjectStatus {
  PLANNING = 'Planning',
  CONSTRUCTION = 'Construction',
  COMPLETED = 'Completed',
  FROZEN = 'Frozen'
}

export interface Project {
  id: string;
  name: string;
  city: string;
  status: ProjectStatus;
  totalBuildings: number;
  soldPercentage: number;
  revenue: number; // In millions
}

export interface Building {
  id: string;
  projectId: string;
  code: string; // e.g., "Lit-A"
  floors: number;
  totalApartments: number;
  soldPercentage: number;
  avgPricePerMeter: number;
  revenue: number;
}

export enum SaleStatus {
  BOOKED = 'Booked',
  CONTRACT = 'Contract',
  PAID = 'Paid',
  CANCELED = 'Canceled'
}

export interface Sale {
  id: string;
  clientName: string;
  projectId: string;
  buildingId: string;
  unitType: 'Studio' | '1BR' | '2BR' | '3BR' | 'Penthouse';
  status: SaleStatus;
  amount: number;
  date: string; // ISO Date
}

export interface KPI {
  totalProjects: number;
  totalBuildings: number;
  activeUnits: number;
  totalRevenue: number;
  dealsCount: number;
}

export interface TimelineEvent {
  id: string;
  saleId: string;
  date: string;
  stage: string; // Lead, Visit, Booking, Contract, Payment, Handover
  comment: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}