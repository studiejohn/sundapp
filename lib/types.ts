export type PropertyType =
  | 'villa'
  | 'lejlighed'
  | 'rækkehus'
  | 'andelsbolig'
  | 'landejendom'
  | 'sommerhus';

export type EnergyLabel = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';

export interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  postalCode: string;
  price: number;
  monthlyPayment: number;
  type: PropertyType;
  area: number;
  landArea?: number;
  rooms: number;
  bathrooms: number;
  yearBuilt: number;
  energyLabel: EnergyLabel;
  images: string[];
  description: string;
  features: string[];
  daysOnMarket: number;
  agent: {
    name: string;
    company: string;
    phone: string;
  };
}

export interface SwipeRecord {
  propertyId: string;
  liked: boolean;
  timestamp: number;
}

export interface UserPreferences {
  minPrice: number;
  maxPrice: number;
  minRooms: number;
  maxRooms: number;
  types: PropertyType[];
  minArea: number;
  maxArea: number;
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  minPrice: 0,
  maxPrice: 10_000_000,
  minRooms: 1,
  maxRooms: 10,
  types: ['villa', 'lejlighed', 'rækkehus', 'andelsbolig', 'landejendom', 'sommerhus'],
  minArea: 0,
  maxArea: 500,
};

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  villa: 'Villa',
  lejlighed: 'Lejlighed',
  rækkehus: 'Rækkehus',
  andelsbolig: 'Andelsbolig',
  landejendom: 'Landejendom',
  sommerhus: 'Sommerhus',
};

export const ENERGY_COLORS: Record<EnergyLabel, string> = {
  A: '#1a7c3e',
  B: '#4caf50',
  C: '#8bc34a',
  D: '#ffeb3b',
  E: '#ff9800',
  F: '#f44336',
  G: '#b71c1c',
};
