import type { FormDataProps } from "../types";

export const emailRegex = /^[a-zA-Z0–9._%+-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}$/;
export const passwordRegex =
  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
export const nameRegex = /^[a-z ,.'-]+$/i;

export const validateForm = (formData: FormDataProps) => {
  let ready = false;
  const formInputs = Object.keys(formData);

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
