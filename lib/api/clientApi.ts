import { type GetNotesResponse, type GetNotesRequest, nextServer, ServerBoolResponse } from './api';
import type { Note, NoteFormData } from '../../types/note';
import { type User } from '@/types/user';
export type RegisterRequest = {
  email: string;
  password: string;
};

export type RegisterResponse = {
  email?: string;
  password?: string;
  message?: string;
};

export const register = async (data: RegisterRequest) => {
  const res = await nextServer.post<RegisterResponse>('/auth/register', data);
  return res.data;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  username?: string;
  email?: string;
  avatar?: string;
  message?: string;
};

export const login = async (data: LoginRequest) => {
  const res = await nextServer.post<LoginResponse>('/auth/login', data);
  return res.data;
};

export type LogoutResponse = {
  message?: string;
};

export const logout = async () => {
  const res = await nextServer.post<LogoutResponse>('/auth/logout');
  return res.data;
};

export const getMe = async () => {
  const res = await nextServer.get<User>('/users/me', {
    withCredentials: true,
  });
  return res.data;
};

export const checkSession = async () => {
  const res = await nextServer.get<ServerBoolResponse>('/auth/session', {
    withCredentials: true,
  });
  return res;
};

export async function fetchNotes(
  query: string,
  page: number,
  tag?: string | undefined
): Promise<GetNotesResponse> {
  const noteSearchParams: GetNotesRequest = {
    params: {
      page,
      perPage: 12,
      tag,
    },
    withCredentials: true,
  };
  if (query.trim() !== '') {
    noteSearchParams.params.search = query.trim();
  }
  const response = await nextServer.get<GetNotesResponse>('notes/', noteSearchParams);

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const response = await nextServer.get<Note>(`notes/${id}`, { withCredentials: true });
  console.log(response.data);

  return response.data;
}

export async function createNote(note: NoteFormData): Promise<Note> {
  const response = await nextServer.post<Note>('notes/', note);
  return response.data;
}

export async function removeNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`notes/${id}`, { withCredentials: true });
  return response.data;
}

export type NewUserData = {
  email: string;
  username: string;
};

export type NewUserDataResponse = {
  username: string;
  email: string;
  avatar: string;
};

export async function editUser(newData: NewUserData): Promise<NewUserDataResponse> {
  const response = await nextServer.patch<NewUserDataResponse>('users/me', newData, {
    withCredentials: true,
  });

  return response.data;
}
