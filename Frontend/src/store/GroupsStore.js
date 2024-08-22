import { create } from "zustand";
import {
  fetchGroupById,
  fetchAllGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  removeInternFromGroup,
  fetchGroupsByDepartment,
  fetchGroupsByCollaboratorId,
  fetchGroupsByInternId,
} from '../Actions/GroupsActions';


const useGroupStore = create((set, get) => ({


  groups: [],

  fetchAllGroups: async () => {
    try {
      const groups = await fetchAllGroups();
      set({ groups });
      return groups;
    } catch (error) {
      console.error("Failed to fetch all groups:", error);
      throw error;
    }
  },

  addGroup: async (group) => {
    try {
      const createdGroup = await createGroup(group);
      set((state) => ({
        groups: [...state.groups, createdGroup],

      }));
      return createdGroup.id;
    } catch (error) {
      console.error("Failed to create group:", error);
      throw error;
    }
  },


  updateGroup: async (id, updatedGroup) => {
    try {
      const updated = await updateGroup(id, updatedGroup);
      set((state) => {
        const updatedGroups = state.groups.map((group) =>
          group.id === id ? updated : group
        );
        return { groups: updatedGroups };
      });
      return updated;
    } catch (error) {
      console.error("Failed to update group:", error);
      throw error;
    }
  },

  deleteGroup: async (id) => {
    try {
      await deleteGroup(id);
      set((state) => ({
        groups: state.groups.filter((group) => group.id !== id),
      }));
    } catch (error) {
      console.error("Failed to delete group:", error);
      throw error;
    }
  },

  fetchGroupById: async (id) => {
    try {
      const group = await fetchGroupById(id);
      set((state) => ({
        groups: [...state.groups.filter((g) => g.id !== group.id), group],
      }));
      return group;
    } catch (error) {
      console.error("Failed to fetch group by id:", error);
      throw error;
    }
  },

  // fetchGroupsByDepartment: (department) => {
  //   console.log("Department:", department)
  //   const { groups } = get();
  //   return groups.filter((group) => group.department === department);
  // },

  fetchGroupsByDepartment: async (department) => {

    try {
      const groups = await fetchGroupsByDepartment(department); // Use the API function
      set({ groups });
      return groups;
    } catch (error) {
      console.error('Failed to fetch groups by department:', error);
      throw error;
    }
  },

  fetchGroupsByCollaboratorId: async (collaboratorId) => {
    try {
      const groups = await fetchGroupsByCollaboratorId(collaboratorId);
      set({ groups });
      return groups;
    } catch (error) {
      console.error("Failed to fetch groups by collaborator ID:", error);
      throw error;
    }
  },

  fetchGroupsByInternId: async (internId) => {

    try {
      const groups = await fetchGroupsByInternId(internId);

      set({ groups });
      return groups;


    }
    catch (error) {
      console.error("Failed to fetch groups by intern ID:", error);
      throw error;
    }
  },

  removeInternFromGroup: async (groupId, internId) => {
    try {
      await removeInternFromGroup(groupId, internId);

      set((state) => {
        const updatedGroups = state.groups.map((group) => {
          if (group.id === groupId) {

            const internIds = Array.isArray(group.internIds) ? group.internIds : [];
            return {
              ...group,
              internIds: internIds.filter((id) => id !== internId),
            };
          }
          return group;
        });
        return { groups: updatedGroups };
      });
    } catch (error) {
      console.error("Failed to remove intern from group:", error);
      throw error;
    }
  },



}));;

export default useGroupStore; 