import { create } from "zustand";
import { validate, validationSchemas } from "utils/validation";

const useValidationStore = create((set) => ({
  errors: {},
  setErrors: (newErrors) => set({ errors: newErrors }),
  validate: (values) => {
    const errors = validate(values, validationSchemas);
    set({ errors });
    return errors;
  },
  clearErrors: () => set({ errors: {} }),
}));

export default useValidationStore;
