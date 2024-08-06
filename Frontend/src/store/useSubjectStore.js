import { createWithEqualityFn } from "zustand/traditional"

const useSubjectStore = createWithEqualityFn((set) => ({
  subjects :[
    {
      id: "1",
      name: "Project A",
      type: "Project",
      description: "This is the description for Project A.",
      steps: [
        { description: "Initial planning" },
        { description: "Design phase"},
      ],
    },
    {
      id: "2",
      name: "Training B",
      type: "Training",
      description: "This is the description for Training B.",
      steps: [
        { description: "Introduction to the training"},
        { description: "Practical exercises"},
      ],
    },
  ],
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
