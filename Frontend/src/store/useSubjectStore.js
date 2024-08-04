import { createWithEqualityFn } from "zustand/traditional"

const useSubjectStore = createWithEqualityFn((set) => ({
  subjects: [],
  addSubject: (subject) => set((state) => ({
    subjects: [...state.subjects, subject],
  })),
  
  updateSubject: (id, updatedSubject) => set((state) => ({
    subjects: state.subjects.map((subject) =>
      subject.id === id ? { ...subject, ...updatedSubject } : subject
    ),
  })),
  
  removeSubject: (id) => set((state) => ({
    subjects: state.subjects.filter((subject) => subject.id !== id),
  })),

  getSubject: (id) => (state) => state.subjects.find((subject) => subject.id === id),
}));

export default useSubjectStore;
