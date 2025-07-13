import { cookies } from 'next/headers';
import { type GetNotesResponse, type GetNotesRequest, nextServer, ServerBoolResponse } from './api';
import { type Note } from '@/types/note';
import { type User } from '@/types/user';

export async function fetchNotes(
  query: string,
  page: number,
  tag?: string | undefined
): Promise<GetNotesResponse> {
  const cookieStore = await cookies();
  const noteSearchParams: GetNotesRequest = {
    params: {
      page,
      perPage: 12,
      tag,
    },
    headers: {
      Cookie: cookieStore.toString(),
    },
  };
  if (query.trim() !== '') {
    noteSearchParams.params.search = query.trim();
  }
  const response = await nextServer.get<GetNotesResponse>('notes/', noteSearchParams);

  return response.data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieStore = await cookies();
  const response = await nextServer.get<Note>(`notes/${id}`, {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });

  return response.data;
}

export const getMe = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res.data;
};

export const checkServerSession = async () => {
  const cookieStore = await cookies();
  const res = await nextServer.get<ServerBoolResponse>('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};
