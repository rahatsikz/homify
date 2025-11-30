import { Server } from 'http';
import app from './app';
import config from './config';

async function mainFunc() {
  const port = Number(config.port) || 5000;

  const server: Server = app.listen(port, '0.0.0.0', async () => {
    console.log(`🏠 Homify server is running in port No. ${port}
📶 Api root: ${config.local_ip}:${port}/api/v1`);
  });
}

mainFunc().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
