import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4492';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Material types
export interface Material {
  id: string;
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  category: string;
  persianNames: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface EdgeBanding {
  id: string;
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CNCOperation {
  id: string;
  code: string;
  description: string;
  unit: string;
  unitPrice: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Fitting {
  id: string;
  code: string;
  name: string;
  unit: string;
  unitPrice: number;
  qtyPerFitting: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PricingConfig {
  id: string;
  name: string;
  overhead1: number;
  overhead2: number;
  overhead3: number;
  overhead4: number;
  contingency: number;
  profitMargin: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// API functions
export const materialsApi = {
  getAll: () => api.get<Material[]>('/api/v1/materials'),
  getOne: (id: string) => api.get<Material>(`/api/v1/materials/${id}`),
  create: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Material>('/api/v1/materials', data),
  update: (id: string, data: Partial<Omit<Material, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Material>(`/api/v1/materials/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/materials/${id}`),
  bulkCreate: (data: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>[]) =>
    api.post<{ count: number }>('/api/v1/materials/bulk', data),
};

export const edgeBandingApi = {
  getAll: () => api.get<EdgeBanding[]>('/api/v1/edge-banding'),
  getOne: (id: string) => api.get<EdgeBanding>(`/api/v1/edge-banding/${id}`),
  create: (data: Omit<EdgeBanding, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<EdgeBanding>('/api/v1/edge-banding', data),
  update: (id: string, data: Partial<Omit<EdgeBanding, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<EdgeBanding>(`/api/v1/edge-banding/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/edge-banding/${id}`),
  bulkCreate: (data: Omit<EdgeBanding, 'id' | 'createdAt' | 'updatedAt'>[]) =>
    api.post<{ count: number }>('/api/v1/edge-banding/bulk', data),
};

export const cncOperationsApi = {
  getAll: () => api.get<CNCOperation[]>('/api/v1/cnc-operations'),
  getOne: (id: string) => api.get<CNCOperation>(`/api/v1/cnc-operations/${id}`),
  create: (data: Omit<CNCOperation, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<CNCOperation>('/api/v1/cnc-operations', data),
  update: (id: string, data: Partial<Omit<CNCOperation, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<CNCOperation>(`/api/v1/cnc-operations/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/cnc-operations/${id}`),
  bulkCreate: (data: Omit<CNCOperation, 'id' | 'createdAt' | 'updatedAt'>[]) =>
    api.post<{ count: number }>('/api/v1/cnc-operations/bulk', data),
};

export const fittingsApi = {
  getAll: () => api.get<Fitting[]>('/api/v1/fittings'),
  getOne: (id: string) => api.get<Fitting>(`/api/v1/fittings/${id}`),
  create: (data: Omit<Fitting, 'id' | 'createdAt' | 'updatedAt'>) =>
    api.post<Fitting>('/api/v1/fittings', data),
  update: (id: string, data: Partial<Omit<Fitting, 'id' | 'createdAt' | 'updatedAt'>>) =>
    api.put<Fitting>(`/api/v1/fittings/${id}`, data),
  delete: (id: string) => api.delete(`/api/v1/fittings/${id}`),
  bulkCreate: (data: Omit<Fitting, 'id' | 'createdAt' | 'updatedAt'>[]) =>
    api.post<{ count: number }>('/api/v1/fittings/bulk', data),
};

export const pricingConfigApi = {
  getActive: () => api.get<PricingConfig>('/api/v1/pricing-config'),
  update: (data: Partial<Pick<PricingConfig, 'overhead1' | 'overhead2' | 'overhead3' | 'overhead4' | 'contingency' | 'profitMargin'>>) =>
    api.put<PricingConfig>('/api/v1/pricing-config', data),
};

