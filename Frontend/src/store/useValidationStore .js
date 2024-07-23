import { createWithEqualityFn } from "zustand/traditional"
import { validate, validationSchemas } from "utils/validation";

const useValidationStore = createWithEqualityFn((set) => ({
  errors: {},
  setErrors: (newErrors) => set({ errors: newErrors }),
  validate: (values, step) => {
    const schema = validationSchemas[`step${step}`];
    const errors = validate(values, schema);
    set({ errors });
    return errors;
  },
  clearErrors: () => set({ errors: {} }),
}));

export default useValidationStore;
