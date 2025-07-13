import axios from 'axios';
import type { Note } from '../../types/note';

// Перевірте, чи визначена змінна середовища. Якщо ні, використовуйте запасний варіант або викличте помилку.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  // Ви можете викинути помилку, щоб розробка не могла тривати з неправильною конфігурацією.
  // Або надати URL за замовчуванням для локальної розробки.
  // throw new Error('NEXT_PUBLIC_API_URL is not defined in environment variables.');
  console.warn('NEXT_PUBLIC_API_URL is not defined. Using a fallback URL for development.');
  // Для розробки можна використовувати localhost:
  // API_BASE_URL = 'http://localhost:3000'; // Розкоментуйте це, якщо вам потрібен локальний запасний варіант
  // Або викинути помилку, щоб переконатися, що вона встановлена в продакшені.
}

export const nextServer = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(Object.entries(params).filter(([_, value]) => value !== undefined));
};

export type GetNotesRequest = {
  params: {
    search?: string;
    tag?: string;
    page: number;
    perPage: number;
    sortBy?: string;
  };
  withCredentials?: boolean;
  headers?: {
    Cookie: string;
  };
};

export type GetNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export type ServerBoolResponse = {
  success: boolean;
};

export const getNotes = async (request: GetNotesRequest): Promise<GetNotesResponse> => {
  const { params, headers, withCredentials } = request;

  const response = await nextServer.get<GetNotesResponse>('/notes', {
    params: cleanParams(params),
    headers,
    withCredentials,
  });

  return response.data;
};
