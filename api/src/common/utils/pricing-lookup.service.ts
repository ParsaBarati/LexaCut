import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Pricing Lookup Service
 * Provides VLOOKUP-like functionality for pricing data from database
 * Replaces Excel lookup tables (W:Z, W:Y ranges)
 */
@Injectable()
export class PricingLookupService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Lookup material by code
   * Replaces: VLOOKUP in Material sheet (W:Z range)
   */
  async getMaterialByCode(code: string) {
    return this.prisma.material.findUnique({
      where: { code, isActive: true },
    });
  }

  /**
   * Lookup material by name/description (handles Persian names)
   * Matches Persian material names from CSV to pricing table
   */
  async getMaterialByName(name: string) {
    if (!name) return undefined;
    
    const normalizedName = name.trim().toLowerCase();
    
    // Try exact match first on description or code
    let material = await this.prisma.material.findFirst({
      where: {
        OR: [
          { description: { contains: normalizedName, mode: 'insensitive' } },
          { code: { equals: normalizedName, mode: 'insensitive' } },
        ],
        isActive: true,
      },
    });
    
    if (material) return material;
    
    // Check persianNames array
    const materials = await this.prisma.material.findMany({
      where: { isActive: true },
    });
    
    for (const m of materials) {
      if (m.persianNames.some((pn: string) => 
        normalizedName.includes(pn.toLowerCase()) || 
        pn.toLowerCase().includes(normalizedName)
      )) {
        return m;
      }
    }
    
    // Fallback: return first MDF material or first material
    const fallback = await this.prisma.material.findFirst({
      where: {
        OR: [
          { description: { contains: 'mdf', mode: 'insensitive' } },
          { description: { contains: 'ام', mode: 'insensitive' } },
        ],
        isActive: true,
      },
    });
    
    return fallback || materials[0];
  }

  /**
   * Get all active materials
   */
  async getAllMaterials() {
    return this.prisma.material.findMany({
      where: { isActive: true },
      orderBy: { description: 'asc' },
    });
  }

  /**
   * Lookup edge banding by code
   * Replaces: VLOOKUP in BoreshKari sheet (W:Y range)
   */
  async getEdgeBandingByCode(code: string) {
    return this.prisma.edgeBanding.findUnique({
      where: { code, isActive: true },
    });
  }

  /**
   * Get all active edge banding options
   */
  async getAllEdgeBanding() {
    return this.prisma.edgeBanding.findMany({
      where: { isActive: true },
      orderBy: { description: 'asc' },
    });
  }

  /**
   * Lookup CNC operation by code
   */
  async getCNCOperationByCode(code: string) {
    return this.prisma.cNCOperation.findUnique({
      where: { code, isActive: true },
    });
  }

  /**
   * Get all active CNC operations
   */
  async getAllCNCOperations() {
    return this.prisma.cNCOperation.findMany({
      where: { isActive: true },
      orderBy: { description: 'asc' },
    });
  }

  /**
   * Lookup cutting operation by code
   */
  async getCuttingByCode(code: string) {
    // For now, using CNC operations for cutting
    return this.getCNCOperationByCode(code);
  }

  /**
   * Lookup fitting by code
   * Replaces: VLOOKUP in Fittings sheet (W:X range)
   */
  async getFittingByCode(code: string) {
    return this.prisma.fitting.findUnique({
      where: { code, isActive: true },
    });
  }

  /**
   * Get all active fittings
   */
  async getAllFittings() {
    return this.prisma.fitting.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });
  }

  /**
   * Lookup fitting by name (handles Persian names)
   * Matches Persian fitting names from components to pricing table
   */
  async getFittingByName(name: string) {
    if (!name) return undefined;
    
    const normalizedName = name.trim().toLowerCase();
    
    // Try exact match first on name or code
    const fitting = await this.prisma.fitting.findFirst({
      where: {
        OR: [
          { name: { contains: normalizedName, mode: 'insensitive' } },
          { code: { equals: normalizedName, mode: 'insensitive' } },
        ],
        isActive: true,
      },
    });
    
    return fitting;
  }

  /**
   * Get color by code (placeholder - colors can be added to DB later)
   */
  getColorByCode(code: string): string | undefined {
    const colorMap: Record<string, string> = {
      COL001: 'White',
      COL002: 'Black',
      COL003: 'Oak',
      COL004: 'Walnut',
    };
    return colorMap[code];
  }

  /**
   * Search materials by description
   */
  async searchMaterials(query: string) {
    return this.prisma.material.findMany({
      where: {
        description: { contains: query, mode: 'insensitive' },
        isActive: true,
      },
      orderBy: { description: 'asc' },
    });
  }

  /**
   * Get materials by category
   */
  async getMaterialsByCategory(category: string) {
    return this.prisma.material.findMany({
      where: {
        category,
        isActive: true,
      },
      orderBy: { description: 'asc' },
    });
  }
}
