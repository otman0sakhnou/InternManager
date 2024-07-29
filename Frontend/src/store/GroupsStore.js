import { create } from "zustand";
const useGroupStore = create((set, get) => ({
  groups: {},
  addGroup: (department, group) =>
    set((state) => {
      const updatedGroups = {
        ...state.groups,
        [department]: [...(state.groups[department] || []), group],
      };

      return {
        groups: updatedGroups,
      };
    }),

  updateGroup: (id, updatedGroup) =>
    set((state) => {
      console.log("Current groups:", state.groups); // Debugging

      const updatedGroups = { ...state.groups };

      // Remove the old group from its department
      for (const department in updatedGroups) {
        updatedGroups[department] = updatedGroups[department].filter(
          (group) => Number(group.id) !== Number(id)
        );
      }

      // Add the updated group to its new department
      if (updatedGroup.department) {
        if (!updatedGroups[updatedGroup.department]) {
          updatedGroups[updatedGroup.department] = [];
        }
        updatedGroups[updatedGroup.department].push(updatedGroup);
      }

      console.log("Updated groups:", updatedGroups); // Debugging
      return { groups: updatedGroups };
    }),

  deleteGroup: (id) =>
    set((state) => {
      const updatedGroups = Object.keys(state.groups).reduce((acc, department) => {
        acc[department] = state.groups[department].filter((group) => group.id !== id);
        return acc;
      }, {});

      return { groups: updatedGroups };
    }),
  getGroupById: (id) => {
    const { groups } = get();
    console.log("Groups:", groups);
    console.log("Looking for group with ID:", id);

    const groupId = Number(id);

    for (const department of Object.keys(groups)) {
      console.log("Checking department:", department);
      const group = groups[department].find((group) => {
        console.log("Checking group ID:", group.id);
        return Number(group.id) === groupId;
      });
      if (group) {
        console.log("Found group:", group);
        return group;
      }
    }

    console.log("Group not found");
    return null;
  },
}));
export default useGroupStore;
