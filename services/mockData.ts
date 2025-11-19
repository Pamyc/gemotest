import { Project, ProjectStatus, Building, Sale, SaleStatus, Role, User, TimelineEvent } from '../types';

// Mock Users
export const MOCK_USERS: User[] = [
  { id: '1', email: 'admin@proptech.com', name: 'Alice Admin', role: Role.ADMIN, avatarUrl: 'https://picsum.photos/200' },
  { id: '2', email: 'manager@proptech.com', name: 'Bob Manager', role: Role.MANAGER, avatarUrl: 'https://picsum.photos/201' },
];

// Mock Projects
export const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Sunrise Towers', city: 'New York', status: ProjectStatus.CONSTRUCTION, totalBuildings: 3, soldPercentage: 45, revenue: 12000000 },
  { id: 'p2', name: 'Green Valley', city: 'Austin', status: ProjectStatus.PLANNING, totalBuildings: 5, soldPercentage: 10, revenue: 2500000 },
  { id: 'p3', name: 'Harbor View', city: 'Miami', status: ProjectStatus.COMPLETED, totalBuildings: 2, soldPercentage: 98, revenue: 45000000 },
  { id: 'p4', name: 'Alpine Heights', city: 'Denver', status: ProjectStatus.CONSTRUCTION, totalBuildings: 4, soldPercentage: 60, revenue: 18000000 },
];

// Mock Buildings
export const MOCK_BUILDINGS: Building[] = [
  { id: 'b1', projectId: 'p1', code: 'Block A', floors: 20, totalApartments: 100, soldPercentage: 80, avgPricePerMeter: 12000, revenue: 8000000 },
  { id: 'b2', projectId: 'p1', code: 'Block B', floors: 20, totalApartments: 100, soldPercentage: 10, avgPricePerMeter: 12500, revenue: 1000000 },
  { id: 'b3', projectId: 'p3', code: 'North Tower', floors: 40, totalApartments: 200, soldPercentage: 99, avgPricePerMeter: 15000, revenue: 30000000 },
  { id: 'b4', projectId: 'p4', code: 'Phase 1', floors: 5, totalApartments: 50, soldPercentage: 100, avgPricePerMeter: 8000, revenue: 5000000 },
];

// Generate Mock Sales
const generateSales = (count: number): Sale[] => {
  const sales: Sale[] = [];
  const statuses = Object.values(SaleStatus);
  const types = ['Studio', '1BR', '2BR', '3BR', 'Penthouse'] as const;
  
  for (let i = 0; i < count; i++) {
    const project = MOCK_PROJECTS[Math.floor(Math.random() * MOCK_PROJECTS.length)];
    sales.push({
      id: `s${i}`,
      clientName: `Client ${i + 1}`,
      projectId: project.id,
      buildingId: 'b1', // Simplified
      unitType: types[Math.floor(Math.random() * types.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      amount: Math.floor(Math.random() * 500000) + 100000,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString()
    });
  }
  return sales.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_SALES = generateSales(150);

// Timeline Events
export const MOCK_TIMELINE: TimelineEvent[] = [
  { id: 't1', saleId: 's1', date: new Date().toISOString(), stage: 'Booking', comment: 'Deposit received' },
  { id: 't2', saleId: 's2', date: new Date(Date.now() - 86400000).toISOString(), stage: 'Visit', comment: 'Showroom visit completed' },
  { id: 't3', saleId: 's3', date: new Date(Date.now() - 172800000).toISOString(), stage: 'Contract', comment: 'Sent for signing' },
];