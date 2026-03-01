import { Platform } from 'react-native';

const getBaseUrl = () => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8000/api';
    }
    return 'http://localhost:8000/api';
  }

  return 'https://your-production-url.com/api';
};

export const API_URL = getBaseUrl();

export const API_ENDPOINTS = {
  courses: `${API_URL}/courses/`,
  categories: `${API_URL}/categories/`,
  cart: `${API_URL}/cart/`,
  login: `${API_URL}/auth/login/`,
  register: `${API_URL}/auth/register/`,
};


console.log('🔗 API URL:', API_URL);