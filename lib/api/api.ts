import axios from 'axios';
import type { Note } from '../../types/note';

export const nextServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`,
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
