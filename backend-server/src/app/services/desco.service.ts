import prisma from "../../shared/prisma";

 function upsertReading(
  tenantId: string,
  data: { balance: number;  readingTime: string }
) {
  return prisma.descoReading.upsert({
    where: { tenantId },
    update: {
      balance: data.balance,
      readingTime: new Date(data.readingTime),
    },
    create: {
      tenantId,
      balance: data.balance,
      readingTime: new Date(data.readingTime),
    },
  });
}

// Retrieve the latest reading (for API)
 function getLatestReading(tenantId: string) {

  const reading = prisma.descoReading.findUnique({
    where: { tenantId },
    include: { tenant: true },
  });

  return reading;
}

export const DescoService = { upsertReading, getLatestReading };