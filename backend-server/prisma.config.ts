import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Prisma will read connection string from the runtime
    url: process.env.DATABASE_URL!,
  },
});
