import { create } from "zustand";

const useGroupStore = create((set, get) => ({
  idCounter: 1627903200000, // Initialize with a value that ensures uniqueness, or use a more sophisticated approach

  groups: [],

  addGroup: (group) => {
    let newId;
    set((state) => {
      newId = state.idCounter + 1; // Increment ID counter for new group
      return {
        groups: [...state.groups, { ...group, id: newId }],
        idCounter: newId, // Update ID counter
      };
    });
    return newId;
  },

  updateGroup: (id, updatedGroup) => {
    console.log(id, updatedGroup);
    set((state) => {
      const updatedGroups = state.groups.map((group) =>
        group.id === id ? { ...group, ...updatedGroup } : group
      );

      return { groups: updatedGroups };
    });
  },
  deleteGroup: (id) =>
    set((state) => ({
      groups: state.groups.filter((group) => group.id !== id),
    })),

  getGroupById: (id) => {
    const { groups } = get();
    //the id from the param is received as string
    return groups.find((group) => group.id === Number(id)) || null;
  },

  getGroupsByDepartment: (department) => {
    const { groups } = get();
    return groups.filter((group) => group.department === department);
  },

  getGroupsByCollaboratorId: (collaboratorId) => {
    const { groups } = get();
    return groups.filter((group) => group.collaborator === collaboratorId.id);
  },

  getGroupsByInternId: (internId) => {
    const { groups } = get(); // Ensure get() returns the correct groups array

    // Filtering groups that contain an intern with the specified internId
    return groups.filter((group) =>
      group.stagiaires.some(
        (intern) => intern.id === internId.id
      )
    );
  },

  // Method to remove an intern from a specific group
  removeInternFromGroup: (groupId, internId) =>
    set((state) => {
      const updatedGroups = state.groups.map((group) => {
        if (group.id === groupId) {
          return {
            ...group,
            stagiaires: group.stagiaires.filter((intern) => intern.id !== internId),
          };
        }
        return group;
      });

      return { groups: updatedGroups };
    }),
}));

export default useGroupStore;
