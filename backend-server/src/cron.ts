import cron from 'node-cron';
import axios from 'axios';
import https from 'https';
import { TenantService } from './app/services/tenant.service';
import { DescoService } from './app/services/desco.service';
import { sendLowBalanceAlert } from './lib/electric-sms';
import { Tenant } from '@prisma/client';

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

const LOW_BALANCE_THRESHOLD = parseFloat(process.env.LOW_BALANCE_THRESHOLD || '60');

async function checkAndUpsertForTenant(tenant: {
  id: string;
  name: string;
  accountNo: string;
  meterNo: string;
  mobile: string;
}) {
  const url =
    `https://prepaid.desco.org.bd/api/unified/customer/getBalance` +
    `?accountNo=${tenant.accountNo}&meterNo=${tenant.meterNo}`;
  try {
    const res = await axios.get(url, { httpsAgent });
    // Validate response structure
    if (!res.data || typeof res.data.data !== 'object' || res.data.data === null) {
      console.error(`❌ [${tenant.name}] No valid data returned`, res.data);
      return;
    }
    const data = res.data.data;

    // Check required fields
    if (typeof data.balance !== 'number' || typeof data.readingTime !== 'string') {
      console.error(`❌ [${tenant.name}] Incomplete data fields`, data);
      return;
    }
    await DescoService.upsertReading(tenant.id, data);

    if (data.balance < LOW_BALANCE_THRESHOLD) {
      await sendLowBalanceAlert({ to: tenant.mobile, balance: data.balance });
    }

    console.log(
      `✅ [${tenant.name}] Upserted reading ${data.readingTime}: balance=${data.balance}`,
    );
  } catch (err: any) {
    console.error(`❌ [${tenant.name}] Upsert failed:`, err.message || err);
  }
}

async function runAll() {
  console.log('🔄 [Cron] Starting DESCO checks…', new Date().toISOString());
  const tenants = await TenantService.getAllTenants();
  const mappedTenants = tenants.map((t: Tenant) => ({
    id: t.id,
    name: t.name,
    accountNo: t.descoAccountNo ?? '',
    meterNo: t.electricityMeter ?? '',
    mobile: t.mobile,
  }));
  await Promise.all(mappedTenants.map(checkAndUpsertForTenant));
  console.log('✅ [Cron] All tenants processed.');
}

// Schedule: every day at 00:05
cron.schedule('0 10 * * *', runAll);

// Optional: run immediately on startup
// runAll();
