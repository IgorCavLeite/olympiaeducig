import { Platform } from 'react-native';
import Constants from 'expo-constants';

const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

// Se for Web (navegador), usa localhost. Se for celular (Expo Go), usa o IP de rede local.
const IP_DA_REDE = Platform.OS === 'web' 
  ? 'localhost' 
  : (expoHost || '10.0.0.200');
const PORTA = '3001';

export const API_BASE_URL = `http://${IP_DA_REDE}:${PORTA}/api`;

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  CHAT: `${API_BASE_URL}/chat`,
  CONQUISTAS: `${API_BASE_URL}/conquistas`,
  AUTH: `${API_BASE_URL}/auth`,
  QUIZ: `${API_BASE_URL}/quiz`,
};