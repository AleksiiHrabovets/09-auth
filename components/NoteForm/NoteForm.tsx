'use client';
import { useState } from 'react';
import css from './NoteForm.module.css';
import { type NoteFormData } from '@/types/note';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { createNote } from '@/lib/api/clientApi';
import { useRouter } from 'next/navigation';
import * as Yup from 'yup';
import { useNoteDraftStore } from '@/lib/store/noteStore';
const NoteFormSchema = Yup.object().shape({
  title: Yup.string()
    .min(3, 'Too short title, min 3 symbols')
    .max(50, 'Too long title, max 50 symbols')
    .required('Title is required'),
  content: Yup.string().max(500, 'Too long content, max 500 symbols'),
  tag: Yup.string().oneOf(['Todo', 'Work', 'Personal', 'Meeting', 'Shopping']),
});

export default function NoteForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addNewNote = useMutation({
    mutationFn: (newNoteData: NoteFormData) => createNote(newNoteData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Notes'] });
      clearDraft();
      router.back();
      localStorage.removeItem('note draft');
    },
  });

  const { draft, setDraft, clearDraft } = useNoteDraftStore();

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setDraft({ ...draft, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrors({});
    const formData = new FormData(event.currentTarget);
    const values: NoteFormData = {
      title: formData.get('title') as string,
      content: formData.get('content') as string,
      tag: formData.get('tag') as 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping',
    };

    try {
      await NoteFormSchema.validate(values, { abortEarly: false });
      setIsSubmitting(true);
      addNewNote.mutate(values);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const newErrors: Record<string, string> = {};
        err.inner.forEach((error) => {
          if (error.path) {
            newErrors[error.path] = error.message;
          }
        });
        setErrors(newErrors);
      } else {
        console.error('Unexpected error:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className={css.form}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={draft?.title}
          className={css.input}
          onChange={handleChange}
        />
        {errors.title && <div className={css.error}>{errors.title}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          defaultValue={draft?.content}
          id="content"
          name="content"
          rows={8}
          className={css.textarea}
          onChange={handleChange}
        />
        {errors.content && <div className={css.error}>{errors.content}</div>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          defaultValue={draft?.tag}
          id="tag"
          name="tag"
          className={css.select}
          onChange={handleChange}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <div className={css.error}>{errors.tag}</div>}
      </div>

      <div className={css.actions}>
        <button type="button" onClick={() => router.back()} className={css.cancelButton}>
          Cancel
        </button>
        <button type="submit" className={css.submitButton}>
          {isSubmitting || (addNewNote.isPending && !addNewNote.isSuccess)
            ? 'Creating note...'
            : 'Create note'}
        </button>
      </div>
    </form>
  );
}
