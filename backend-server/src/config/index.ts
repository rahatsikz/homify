import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  port: process.env.PORT,
  env: process.env.NODE_ENV,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUNDS,
  mail: process.env.MAIL_USER,
  mailPassword: process.env.MAIL_PASSWORD,
  local_ip: process.env.LOCAL_IP,
  github: {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    callback_url: process.env.GITHUB_CALLBACK_URL,
  },
  session_secret: process.env.SESSION_SECRET,
  jwt: {
    secret: process.env.JWT_SECRET_KEY || '',
    refresh_secret: process.env.JWT_REFRESH_SECRET || '',
    expiry_days: Number(process.env.JWT_EXPIRY_DAYS ?? 1),
    expiry_hours: Number(process.env.JWT_EXPIRY_HOURS ?? 0),
    refresh_expiry_days: Number(process.env.JWT_REFRESH_EXPIRY_DAYS ?? 1),
    refresh_expiry_hours: Number(process.env.JWT_REFRESH_EXPIRY_HOURS ?? 0),
  },
  sendLime: {
    apiKey: process.env.SENDLIME_API_KEY,
    apiSecret: process.env.SENDLIME_API_SECRET,
    sender: process.env.SENDLIME_SENDER,
  },
  netsmsBD_api_key: process.env.NETSMSBD_API_KEY,
  netsmsBD_sender_id: process.env.NETSMSBD_SENDER_ID,
};
