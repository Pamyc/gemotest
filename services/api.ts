import { MOCK_PROJECTS, MOCK_BUILDINGS, MOCK_SALES, MOCK_TIMELINE, MOCK_USERS } from './mockData';
import { KPI, Project, Building, Sale, User, AuthState } from '../types';

// Simulating Async API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  auth: {
    login: async (email: string): Promise<AuthState> => {
      await delay(500);
      const user = MOCK_USERS.find(u => u.email === email) || MOCK_USERS[0]; // Default to admin if not found for demo
      return {
        user,
        token: 'mock-jwt-token-' + Date.now(),
        isAuthenticated: true
      };
    }
  },
  
  dashboard: {
    getKPI: async (): Promise<KPI> => {
      await delay(600);
      return {
        totalProjects: MOCK_PROJECTS.length,
        totalBuildings: MOCK_BUILDINGS.length,
        activeUnits: 450, // Mock calculated
        totalRevenue: MOCK_SALES.reduce((acc, s) => acc + s.amount, 0),
        dealsCount: MOCK_SALES.length
      };
    },
    getRevenueChartData: async () => {
      await delay(600);
      // Mock monthly data
      return Array.from({ length: 12 }, (_, i) => ({
        month: new Date(0, i).toLocaleString('default', { month: 'short' }),
        sales: Math.floor(Math.random() * 50),
        revenue: Math.floor(Math.random() * 10) + 2
      }));
    }
  },

  projects: {
    getAll: async (): Promise<Project[]> => {
      await delay(400);
      return MOCK_PROJECTS;
    }
  },

  buildings: {
    getAll: async (): Promise<Building[]> => {
      await delay(400);
      return MOCK_BUILDINGS;
    }
  },

  sales: {
    getAll: async (): Promise<Sale[]> => {
      await delay(500);
      return MOCK_SALES;
    }
  },

  timeline: {
    getAll: async () => {
      await delay(300);
      return MOCK_TIMELINE;
    }
  },

  admin: {
    getUsers: async (): Promise<User[]> => {
      await delay(300);
      return MOCK_USERS;
    }
  }
};