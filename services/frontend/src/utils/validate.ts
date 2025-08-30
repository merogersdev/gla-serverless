import type { FormDataProps } from "../types";

export const validateForm = (formData: FormDataProps) => {
  let ready = false;
  const formInputs = Object.keys(formData);

  const emailRegex = /^[a-zA-Z0–9._%+-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const nameRegex = /^[a-z ,.'-]+$/i;

  formInputs.forEach((input) => {
    switch (input) {
      case "givenName":
        ready = nameRegex.test(formData[input] || "");
        break;
      case "familyName":
        ready = nameRegex.test(formData[input] || "");
        break;
      case "email":
        ready = emailRegex.test(formData[input]);
        break;
      case "password":
        ready = passwordRegex.test(formData[input]);
        break;
      case "confirmPassword":
        ready = passwordRegex.test(formData[input] || "");
        break;

      default:
        ready = false;
    }
  });

  return ready;
};
