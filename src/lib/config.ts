export const APP_CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://versity-bck.onrender.com/api',
  USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true' || process.env.NODE_ENV === 'development',
  MOCK_DELAY: parseInt(process.env.NEXT_PUBLIC_MOCK_DELAY || '1000'),
  ENABLE_LOGGING: process.env.NODE_ENV === 'development'
};