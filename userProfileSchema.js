import * as Yup from "yup";

const userProfileSchema = Yup.object().shape({
  givenName: Yup.string()
    .min(2, "Minimum 2 characters required.")
    .max(100, "Maximum 100 characters allowed.")
    .required("This field is required."),
  surnames: Yup.string()
    .min(2, "Minimum 2 characters required.")
    .max(100, "Maximum 100 characters allowed.")
    .required("This field is required."),
  avatarUrl: Yup.string()
    .url("Must be a valid url.")
    .max(255, "Maximum URL length is 255 characters.")
    .nullable(),
});

export { userProfileSchema };
