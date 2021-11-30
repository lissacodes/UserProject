import * as Yup from "yup";

const registerFormValidation = () => {
  return Yup.object().shape({
    email: Yup.string()
      .email("Must be valid email.")
      .max(100)
      .required("Email field is required."),
    password: Yup.string()
      .min(8, "Minimum of 8 characters.")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
        "Must Contain  at least 8 Characters, one Uppercase, one lowercase, one Number and one special Character"
      )
      .required("Password field is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match.")
      .required("Confirm password field is required"),
  });
};
const loginValidation = () => {
  return Yup.object().shape({
    email: Yup.string().max(100).required("Email field is required."),
    password: Yup.string().required("Password field is required"),
  });
};
const contactFormValidation = () => {
  return Yup.object().shape({
    comments: Yup.string().required("Comments field is required"),
    firstAndLastName: Yup.string().required("First and Last name field is required"),
    email: Yup.string().max(100).required("Email field is required."),
    
  });
};

export default { registerFormValidation, loginValidation, contactFormValidation };
