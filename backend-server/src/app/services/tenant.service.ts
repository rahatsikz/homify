import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";

const createTenant = async (payload: Prisma.TenantCreateInput) => {
  const { sublet, ...tenantData } = payload;

  const tenant = await prisma.tenant.create({
    data: {
      ...tenantData,
      sublet: sublet
        ? {
            create: sublet as Prisma.SubletCreateWithoutTenantInput,
          }
        : undefined,
    },
    include: { sublet: true },
  });
  return tenant;
};

// Get all tenants
const getAllTenants = async (
  search?: string,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const where = search
    ? {
        OR: [
          { name: { contains: search, mode: Prisma.QueryMode.insensitive } },
          { email: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }
    : undefined;
  return prisma.tenant.findMany({ where, orderBy: { [sortBy]: sortOrder } });
};

// Get tenant by ID
const getTenantById = async (id: string) => {
  return prisma.tenant.findUnique({ where: { id } });
};

// Update tenant by ID
const updateTenant = async (id: string, payload: Prisma.TenantUpdateInput) => {
  return prisma.tenant.update({ where: { id }, data: payload });
};

// Delete tenant by ID
const deleteTenant = async (id: string) => {
  return prisma.tenant.delete({ where: { id } });
};

export const TenantService = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
};
