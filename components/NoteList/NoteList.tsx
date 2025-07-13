import { type Note } from '@/types/note';
import css from './NoteList.module.css';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { removeNote } from '@/lib/api/clientApi';
import Link from 'next/link';

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  const deleteNote = useMutation({
    mutationFn: (id: string) => removeNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['Notes'],
      });
    },
  });
  return (
    <ul className={css.list}>
      {notes.map((note) => {
        return (
          <li key={note.id} className={css.listItem}>
            <h2 className={css.title}>{note.title}</h2>
            <p className={css.content}>{note.content}</p>
            <div className={css.footer}>
              <span className={css.tag}>{note.tag}</span>
              <Link className={css.link} href={`/notes/${note.id}`}>
                View details
              </Link>
              <button onClick={() => deleteNote.mutate(note.id.toString())} className={css.button}>
                Delete
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
