import Image from 'next/image';
import css from './ProfilePage.module.css';
import Link from 'next/link';
import { type Metadata } from 'next';
import { getMe } from '@/lib/api/serverApi';

export async function generateMetadata(): Promise<Metadata> {
  const user = await getMe();
  return {
    title: `NoteHub - ${user.username}`,
    description:
      'Take notes, organize tasks, and collaborate effortlessly. Your all-in-one digital notebook.',
    icons: {
      icon: '/favicon.svg',
    },
    openGraph: {
      title: `NoteHub - ${user.username}`,
      description:
        'Take notes, organize tasks, and collaborate effortlessly. Your all-in-one digital notebook.',
      url: 'https://09-auth-nu.vercel.app/profile',
      siteName: 'NoteHub',
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: 'NoteHub',
        },
      ],
      type: 'article',
    },
  };
}

export default async function Profile() {
  const user = await getMe();
  const avatarUrl = user ? user.avatar : '/avatar.webp';
  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          <Image
            src={avatarUrl}
            alt="User Avatar"
            width={120}
            height={120}
            className={css.avatar}
          />
        </div>
        <div className={css.profileInfo}>
          <p>Username: {user?.username}</p>
          <p>Email: {user?.email}</p>
        </div>
      </div>
    </main>
  );
}
