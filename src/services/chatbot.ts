import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

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
