import Constants from 'expo-constants';

// Pega o IP automaticamente a partir da URL do servidor do Expo
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];

const IP_DA_REDE = expoHost || '192.168.3.124'; // fallback manual
const PORTA = '3001';

export const API_BASE_URL = `http://${IP_DA_REDE}:${PORTA}/api`;

export const ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  CHAT: `${API_BASE_URL}/chat`,
};