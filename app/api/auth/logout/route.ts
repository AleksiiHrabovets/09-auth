import { NextResponse } from 'next/server';
import { api } from '../../api'; // Переконайтеся, що api.ts виправлено з baseURL
import { cookies } from 'next/headers';

export async function POST() {
  // ЗМІНА ТУТ: Додайте 'await' перед cookies()
  const cookieStore = await cookies();

  try {
    const accessToken = cookieStore.get('accessToken')?.value;
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!accessToken && !refreshToken) {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.json({
        message: 'No active session tokens found, logged out successfully (local cleanup).',
      });
    }

    const apiRes = await api.post('auth/logout', null, {
      headers: {
        Cookie: `accessToken=${accessToken || ''}; refreshToken=${refreshToken || ''}`,
      },
    });

    if (apiRes.status === 200 || apiRes.status === 204) {
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.json({ message: 'Logged out successfully' });
    } else {
      console.error('Logout API responded with an error status:', apiRes.status, apiRes.data);
      cookieStore.delete('accessToken');
      cookieStore.delete('refreshToken');
      return NextResponse.json(
        { error: 'Logout failed on server side', details: apiRes.data },
        { status: apiRes.status }
      );
    }
  } catch (error: any) {
    console.error('Logout failed due to an error:', error);

    cookieStore.delete('accessToken');
    cookieStore.delete('refreshToken');

    if (error.response) {
      return NextResponse.json(error.response.data || { error: 'API Error during logout' }, {
        status: error.response.status,
      });
    } else if (error.request) {
      return NextResponse.json({ error: 'No response from API during logout' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Request setup error during logout' }, { status: 500 });
    }
  }
}
