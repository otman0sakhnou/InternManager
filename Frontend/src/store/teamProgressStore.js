import { getTeamProgressBySubject } from "Actions/SubjectActions";
import toast from "react-hot-toast";
import { createWithEqualityFn } from "zustand/traditional";



const teamProgressStore = createWithEqualityFn((set) => ({
  teamProgress: [],
  loading: false,
  error: null,

  fetchTeamProgress: async (subjectId, groupId) => {
    set({ teamProgress: null, loading: true });
    try {
      const res = await getTeamProgressBySubject(subjectId, groupId);
      set({ teamProgress: res, loading: false });
      console.log("data of subjects: ", res);
    } catch (err) {
      toast.error("Failed to get team progress");
      console.log(err);
    }
  },
  clearTeamProgress: () => {
    set({ teamProgress: null, error: null });
  }
}));
export default teamProgressStore;