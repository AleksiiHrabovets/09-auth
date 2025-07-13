import { NoteFormData } from '@/types/note';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NoteDraftStore = {
  draft: NoteFormData;
  setDraft: (note: NoteFormData) => void;
  clearDraft: () => void;
};

const initialDraft: NoteFormData = {
  title: '',
  content: '',
  tag: 'Todo',
};

export const useNoteDraftStore = create<NoteDraftStore>()(
  persist(
    (set) => ({
      draft: initialDraft,
      setDraft: (note: NoteFormData) => set(() => ({ draft: note })),
      clearDraft: () => set(() => ({ draft: initialDraft })),
    }),
    {
      name: 'note draft',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
