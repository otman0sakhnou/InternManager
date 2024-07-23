// utils/validation.js

export const validationSchemas = {
  name: {
    required: { value: true, message: "Name is required" },
    minLength: { value: 3, message: "Name must be at least 3 characters long" },
  },
  email: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Email is not valid",
    },
  },
  phone: {
    required: { value: true, message: "Phone number is required" },
    minLength: { value: 10, message: "Phone number must be at least 10 digits long" },
  },
  job: {
    required: { value: true, message: "Job role is required" },
  },
  department: {
    required: { value: true, message: "Department is required" },
  },
  organization: {
    required: { value: true, message: "Organization is required" },
  },
  employementDate: {
    required: { value: true, message: "Employment date is required" },
  },
  password: {
    required: { value: true, message: "Password is required" },
    minLength: { value: 6, message: "Password must be at least 6 characters long" },
  },
  confirmPassword: {
    required: { value: true, message: "Confirm password is required" },
  },
  internName: {
    required: { value: true, message: "Full Name is required" },
  },
  internEmail: {
    required: { value: true, message: "Email is required" },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email format",
    },
  },
  internPhone: {
    required: { value: true, message: "Phone number is required" },
    pattern: {
      value: /^[0-9]{10}$/, // Adjust this regex according to your phone number format
      message: "Invalid phone number format",
    },
  },
  // internBirthdate: {
  //   required: { value: true, message: "Birthdate is required" },
  //   validate: (value) => !dayjs(value).isAfter(dayjs()) || "Birthdate cannot be in the future",
  // },
  internGender: {
    required: { value: true, message: "Gender is required" },
  },
  institution: {
    required: { value: true, message: "Institution is required" },
  },
  level: {
    required: { value: true, message: "Level is required" },
  },
  specialization: {
    required: { value: true, message: "Specialization is required" },
  },
  yearOfStudy: {
    required: { value: true, message: "Year of study is required" },
    pattern: {
      value: /^\d{4}$/,
      message: "Year of study must be in the format yyyy (For example, 2024)",
    },
  },
  title: {
    required: { value: true, message: "Internship Title is required" },
  },
  department: {
    required: { value: true, message: "Department is required" },
  },
  startDate: {
    required: { value: true, message: "Start Date is required" },
  },
  endDate: {
    required: { value: true, message: "End Date is required" },
    validate: (value, values) =>
      dayjs(value).isAfter(dayjs(values.startDate)) || "End Date must be after Start Date",
  },
  // username: {
  //   required: { value: true, message: "Username is required" },
  // },
  // password: {
  //   required: { value: true, message: "Password is required" },
  //   pattern: {
  //     value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/,
  //     message:
  //       "Password must contain at least 8 characters, including one number, one uppercase, one lowercase letter, and one special character.",
  //   },
  // },
  // confirmPassword: {
  //   required: { value: true, message: "Confirm password is required" },
  //   validate: (value, values) => value === values.password || "Passwords do not match",
  // },
};

export const validate = (values, schema) => {
  // console.log("from validate")
  // console.log("Schema:", schema);
  // console.log("Values:", values);
  const errors = {};
  for (const [key, rules] of Object.entries(schema)) {
    if (!rules) {
      console.warn(`No rules for key: ${key}`);
      continue;
    }
    const value = values[key];
    if (rules.required?.value && !value) {
      errors[key] = rules.required.message;
    } else if (rules.minLength?.value && value.length < rules.minLength.value) {
      errors[key] = rules.minLength.message;
    } else if (rules.pattern?.value && !rules.pattern.value.test(value)) {
      errors[key] = rules.pattern.message;
    }
  }
  if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
};