import { NextRequest, NextResponse } from 'next/server';
import { api } from '../../api'; // Переконайтеся, що api.ts виправлено з baseURL
import { cookies } from 'next/headers';
import { parse } from 'cookie';

export async function POST(req: NextRequest) {
  // Додайте await до cookies()
  const cookieStore = await cookies();

  try {
    const body = await req.json();
    const apiRes = await api.post('auth/register', body);

    // Перевіряємо статус відповіді від вашого API
    if (apiRes.status !== 200 && apiRes.status !== 201) {
      // 200 OK або 201 Created для успішної реєстрації
      // Якщо API повернуло помилку (наприклад, 400 Bad Request, 409 Conflict), повертаємо її клієнту
      return NextResponse.json(apiRes.data || { error: 'Registration failed' }, {
        status: apiRes.status,
      });
    }

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
          path: parsedCookie.Path || '/', // Забезпечуємо шлях за замовчуванням
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

      // Реєстрація та отримання файлів cookie успішні
      return NextResponse.json(apiRes.data, { status: apiRes.status });
    }

    // Якщо заголовок set-cookie відсутній, але реєстрація була успішною (статус 200/201)
    // Це може бути допустимо, якщо токени не повертаються відразу після реєстрації,
    // або якщо користувач повинен потім увійти.
    return NextResponse.json(
      apiRes.data || { message: 'Registration successful, but no cookies received.' },
      { status: apiRes.status }
    );
  } catch (error: any) {
    // Обробка помилок Axios або інших помилок під час виконання запиту
    console.error('Error during registration POST request:', error);

    if (error.response) {
      // Сервер відповів зі статусом, що виходить за межі 2xx
      return NextResponse.json(error.response.data || { error: 'API Error' }, {
        status: error.response.status,
      });
    } else if (error.request) {
      // Запит був зроблений, але відповіді не надійшло
      return NextResponse.json({ error: 'No response from API' }, { status: 500 });
    } else {
      // Щось пішло не так під час налаштування запиту
      return NextResponse.json({ error: 'Request setup error' }, { status: 500 });
    }
  }
}
