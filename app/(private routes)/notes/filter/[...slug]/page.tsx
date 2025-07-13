import { fetchNotes } from '@/lib/api/serverApi';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface NotesProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateMetadata({ params }: NotesProps): Promise<Metadata> {
  const { slug } = await params;
  const category = slug[0];
  return {
    title: `Notehub - ${category}`,
    description: `Explore all notes in the ${category} category. Stay organized and easily find what matters most`,
    openGraph: {
      title: `Notehub - ${category}`,
      description: `Explore all notes in the ${category} category. Stay organized and easily find what matters most`,
      url: `https://09-auth-nu.vercel.app/notes/filter/${category}`,
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

export default async function Notes({ params }: NotesProps) {
  const { slug } = await params;
  const tag = slug[0] === 'All' ? undefined : slug[0];
  const response = await fetchNotes('', 1, tag);

  return <NotesClient initialResponse={response} tag={tag} />;
}
