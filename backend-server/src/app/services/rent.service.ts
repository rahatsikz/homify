import { Prisma } from "@prisma/client";
import prisma from "../../shared/prisma";
import { calculateDueAmount } from "../../helpers/calculation";
import { sendRentReminder } from "../../lib/rent-sms";

// Create rent
const createRent = async (payload: Prisma.RentCreateInput) => {
  const rent = await prisma.rent.create({
    data: payload,
    include: { Tenant: true },
  });

  // 2. send SMS
  sendRentReminder({
    to: rent.Tenant.mobile,
    month: rent.month,
    houseRent: rent.houseRent,
    waterBill: rent.waterBill,
    electricityBill: rent.electricityBill,
    gasBill: rent.gasBill,
    utilityBill: rent.utilityBill,
  })
    .then((res) => console.log("✅ SMS sent", res))
    .catch((err) => console.error("⚠️ SMS failed", err));

  return rent;
};

// Get all rents by tenant ID
const getRentsByTenantId = async (
  tenantId: string,
  month?: string,
  sortBy: string = "createdAt",
  sortOrder: "asc" | "desc" = "desc"
) => {
  const where: Prisma.RentWhereInput = {
    tenantId,
    ...(month
      ? {
          month: {
            contains: month,
            mode: Prisma.QueryMode.insensitive,
          },
        }
      : {}),
  };
  return prisma.rent.findMany({
    where,
    orderBy: { [sortBy]: sortOrder },
  });
};

// Get rent by ID
const getRentById = async (id: string) => {
  return prisma.rent.findUnique({ where: { id } });
};

// Update rent by ID
const updateRent = async (id: string, payload: Prisma.RentUpdateInput) => {
  return prisma.rent.update({ where: { id }, data: payload });
};

// Delete rent by ID
const deleteRent = async (id: string) => {
  return prisma.rent.delete({ where: { id } });
};

// Update payment status
const updatePaymentStatus = async (
  id: string,
  paymentStatus: "PAID" | "DUE" | "PARTIAL",
  paidAmount: number
) => {
  const rent = await prisma.rent.findUnique({ where: { id } });
  if (!rent) throw new Error("Rent not found");
  const dueAmount = calculateDueAmount({ ...rent, paidAmount });
  return prisma.rent.update({
    where: { id },
    data: {
      paymentStatus,
      paidAmount,
      dueAmount,
    },
  });
};

export const RentService = {
  createRent,
  getRentsByTenantId,
  getRentById,
  updateRent,
  deleteRent,
  updatePaymentStatus,
};
