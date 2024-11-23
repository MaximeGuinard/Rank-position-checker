import dotenv from 'dotenv';

dotenv.config();

export const config = {
  scrapingBeeApiKey: process.env.SCRAPINGBEE_API_KEY || '',
  defaultWaitTime: 5000,
  maxRetries: 3,
  retryDelay: 2000,
  timeout: 30000
};