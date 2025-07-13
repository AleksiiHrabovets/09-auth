import axios from 'axios';
import type { Note } from '../../types/note';

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + '/api',
  withCredentials: true,
});

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
