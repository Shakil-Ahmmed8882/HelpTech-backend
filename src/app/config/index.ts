import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUND,
  reset_pass_ui_link: process.env.reset_pass_ui_link,
  store_id: process.env.STORE_ID,
  store_passwd: process.env.STORE_PASSWD,
  is_live: process.env.IS_LIVE,
  server_url: process.env.SERVER_URL,
  client_url: process.env.CLIENT_URL,
  
};
