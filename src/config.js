require('dotenv').config();
const fs = require('fs');
const path = require('path');

function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 3000,
  db: {
    host: required('shoptrack-mysql-shoptrack-api.l.aivencloud.com'),
    port: Number(process.env.DB_PORT || 3306),
    user: required('avnadmin'),
    password: required('AVNS_zLERZlzcDW6VnmTIr98'),
    database: required('defaultdb'),
    // Aiven requires TLS. We want to verify with the project CA when available.
    ssl: buildSslConfig(),
  },
};

function buildSslConfig() {
  const caPath = process.env.DB_SSL_CA;
  if (caPath && fs.existsSync(path.resolve(caPath))) {
    return {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.resolve(caPath), 'utf8'),
    };
  }

  // Fallback: still use TLS, but do not verify the certificate chain.
  // We want to downloading a ca.pem (We will do this later).
  if (process.env.DB_SSL === 'true' || process.env.DB_SSL === '1') {
    return { rejectUnauthorized: false };
  }

  // TODO: (optional) Local MySQL without SSL
  return undefined;
}

module.exports = config;