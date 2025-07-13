import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api';
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const apiRes = await api.post('auth/login', body);

    if (apiRes.status !== 200) {
      return NextResponse.json(apiRes.data || { error: 'Login failed' }, { status: apiRes.status });
    }

    // ЗМІНА ТУТ: Додайте 'await' перед cookies()
    const cookieStore = await cookies();
    const setCookieHeader = apiRes.headers['set-cookie'];

    if (setCookieHeader) {
      const cookieArray = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];

      for (const cookieStr of cookieArray) {
        const parsedCookie = parse(cookieStr);

        const accessToken = parsedCookie.accessToken;
        const refreshToken = parsedCookie.refreshToken;

        const options: {
          expires?: Date;
          path?: string;
          maxAge?: number;
          secure?: boolean;
          httpOnly?: boolean;
          sameSite?: 'lax' | 'strict' | 'none';
        } = {
          expires: parsedCookie.Expires ? new Date(parsedCookie.Expires) : undefined,
          path: parsedCookie.Path || '/',
          maxAge: parsedCookie['Max-Age'] ? Number(parsedCookie['Max-Age']) : undefined,
          secure: parsedCookie.Secure === '',
          httpOnly: parsedCookie.HttpOnly === '',
          sameSite: (parsedCookie.SameSite as 'lax' | 'strict' | 'none') || undefined,
        };

        if (accessToken) {
          cookieStore.set('accessToken', accessToken, options);
        }
        if (refreshToken) {
          cookieStore.set('refreshToken', refreshToken, options);
        }
      }

      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    return NextResponse.json({ error: 'No cookies received from API' }, { status: 500 });
  } catch (error: any) {
    console.error('Error during login POST request:', error);

    if (error.response) {
      return NextResponse.json(error.response.data || { error: 'API Error' }, {
        status: error.response.status,
      });
    } else if (error.request) {
      return NextResponse.json({ error: 'No response from API' }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Request setup error' }, { status: 500 });
    }
  }
}
