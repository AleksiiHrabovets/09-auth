'use client';
import Image from 'next/image';
import css from './EditProfilePage.module.css';
import { useAuthStore } from '@/lib/store/authStore';
import { useRouter } from 'next/navigation';
import { editUser, type NewUserData, getMe } from '@/lib/api/clientApi';
import { useState } from 'react';

type NewName = {
  username: string;
};

export default function EditProfile() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const handleCancel = () => router.back();
  const [error, setError] = useState<boolean>(false);
  const avatarUrl = user ? user.avatar : '/avatar.webp';
  const handleSubmit = async (formData: FormData) => {
    const { username } = Object.fromEntries(formData) as NewName;
    try {
      if (user) {
        const newData: NewUserData = {
          email: user.email,
          username,
        };
        await editUser(newData);
        setError(false);
        const updatedUser = await getMe();
        setUser(updatedUser);
        router.push('/profile');
      }
    } catch {
      setError(true);
    }
  };
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <h1 className={css.formTitle}>Edit Profile</h1>

        <Image src={avatarUrl} alt="User Avatar" width={120} height={120} className={css.avatar} />

        <form className={css.profileInfo} action={handleSubmit}>
          <div className={css.usernameWrapper}>
            <label htmlFor="username">Username:</label>
            <input
              defaultValue={user?.username}
              id="username"
              type="text"
              name="username"
              className={css.input}
            />
          </div>

          <p>Email: {user?.email}</p>
          {error && <p className={css.error}>Something went wrong... please try again</p>}
          <div className={css.actions}>
            <button type="submit" className={css.saveButton}>
              Save
            </button>
            <button type="button" onClick={handleCancel} className={css.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
