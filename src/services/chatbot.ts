import axios from 'axios';

const API_URL = 'https://bgkkgwg48w08cg0owwowsc40.194.164.151.212.sslip.io/api';

export interface ChatResponse {
  answer: string;
  source: 'document' | 'ai_fallback';
  confidence?: number;
}

export const sendChatQuery = async (query: string): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(`${API_URL}/chat`, {
    query
  });
  return response.data;
};
