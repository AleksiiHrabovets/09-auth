'use client';
import { useRouter } from 'next/navigation';
import css from './SingInPage.module.css';
import { login, LoginRequest, getMe } from '@/lib/api/clientApi';
import { useState } from 'react';
import { useAuthStore } from '@/lib/store/authStore';

export default function Login() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (formData: FormData) => {
    try {
      const regData = Object.fromEntries(formData) as LoginRequest;
      const res = await login(regData);
      const user = await getMe();
      if (res.email) {
        setUser(user);
        router.push('/profile');
      } else if (res.message) {
        setError(res.message);
      } else {
        setError('Invalid email or password');
      }
    } catch {
      setError('Invalid email or password');
    }
  };

  return (
    <main className={css.mainContent}>
      <form className={css.form} action={handleSubmit}>
        <h1 className={css.formTitle}>Sign in</h1>

        <div className={css.formGroup}>
          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" className={css.input} required />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" className={css.input} required />
        </div>

        <div className={css.actions}>
          <button type="submit" className={css.submitButton}>
            Log in
          </button>
        </div>

        {error && <p className={css.error}>{error}</p>}
      </form>
    </main>
  );
}
