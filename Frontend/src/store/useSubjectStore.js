// src/store/useSubjectStore.js

import { createWithEqualityFn } from 'zustand/traditional';
import { getSubjectById, addSubject, removeSubject } from '../Actions/SubjectActions';

const useSubjectStore = createWithEqualityFn((set) => ({
  subjects: [],

  getSubject: async (id) => {
    try {
      console.log(`Fetching subject with ID: ${id}`);
      const subject = await getSubjectById(id);
      console.log(`Fetched subject:`, subject);
      return subject;
    } catch (error) {
      console.error('Failed to fetch subject:', error);
      return null;
    }
  },


  addSubject: async (subject) => {
    const newSubject = await addSubject(subject);
    set((state) => ({
      subjects: [...state.subjects, newSubject],
    }));
  },

  removeSubject: async (id) => {
    await removeSubject(id);
    set((state) => ({
      subjects: state.subjects.filter((subject) => subject.id !== id),
    }));
  },
}));

export default useSubjectStore;
