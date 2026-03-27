import axios from 'axios';
import { chatbotApiUrl } from '../config/api';

export interface ChatResponse {
  answer: string;
  source: 'document' | 'ai_fallback';
  confidence?: number;
}

export const sendChatQuery = async (query: string): Promise<ChatResponse> => {
  const response = await axios.post<ChatResponse>(chatbotApiUrl('/api/chat'), {
    query
  });
  return response.data;
};
