// load-env.js
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const envFilePath = path.join(__dirname, 'src', 'environments', 'env.ts');
const envContent = `export const env = {
  STRIPE_PUBLIC_KEY: '${process.env.STRIPE_PUBLIC_KEY}',
  STRIPE_SECRET_KEY: '${process.env.STRIPE_SECRET_KEY}'
};`;

fs.writeFileSync(envFilePath, envContent);
console.log('Environment variables loaded into env.ts');