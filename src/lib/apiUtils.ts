import { 
  getMockDataForOrganization, 
  formatMockApiResponse, 
  mockApiDelay 
} from './mockData';

export interface ApiError {
  response?: {
    data?: {
      detail?: string;
      message?: string;
    };
    status?: number;
  };
  message?: string;
}

export const getErrorMessage = (error: ApiError): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error: ApiError): boolean => {
  return !error.response || error.response.status >= 500;
};

export const shouldUseMockData = (error: ApiError): boolean => {
  // Use mock data for network errors or when API is unavailable
  return isNetworkError(error) || 
         error.response?.status === 404 ||
         error.message?.includes('Network Error') ||
         error.message?.includes('ECONNREFUSED');
};

export const withMockFallback = async <T>(
  apiCall: () => Promise<T>,
  mockDataGenerator: () => any,
  options: {
    delay?: number;
    includeMetadata?: boolean;
  } = {}
): Promise<{ data: any; isMock: boolean }> => {
  try {
    const result = await apiCall();
    return { data: result, isMock: false };
  } catch (error) {
    console.warn('API call failed, falling back to mock data:', error);
    
    if (options.delay) {
      await mockApiDelay(options.delay);
    }
    
    const mockData = mockDataGenerator();
    const formattedData = options.includeMetadata 
      ? formatMockApiResponse(mockData)
      : mockData;
    
    return { data: { data: formattedData }, isMock: true };
  }
};

export const extractOrganizationId = (userData: any): number | null => {
  // Comprehensive list of possible fields where organization ID might be stored
  const possibleFields = [
    'organization_id',
    'org_id',
    'organization.id',
    'organizationId',
    'organization_profile_id',
    'profile_id',
    'company_id',
    'orgId'
  ];
  
  for (const field of possibleFields) {
    const value = getNestedValue(userData, field);
    if (value && (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value))))) {
      return Number(value);
    }
  }
  
  return null;
};

export const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : null;
  }, obj);
};

export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> => {
  let lastError: any;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt) + Math.random() * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
};

export const createApiErrorHandler = (
  fallbackData?: any,
  customErrorMessage?: string
) => {
  return (error: ApiError) => {
    const message = customErrorMessage || getErrorMessage(error);
    console.error('API Error:', error);
    
    if (fallbackData) {
      console.log('Using fallback data');
      return { data: fallbackData, error: message, isFallback: true };
    }
    
    throw new Error(message);
  };
};

export default {
  getErrorMessage,
  isNetworkError,
  shouldUseMockData,
  withMockFallback,
  extractOrganizationId,
  getNestedValue,
  retryWithBackoff,
  createApiErrorHandler
};