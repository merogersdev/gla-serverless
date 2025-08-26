import type { FormDataProps } from "../types";

export const validateForm = (formData: FormDataProps) => {
  let ready = false;
  const formInputs = Object.keys(formData);

  const emailRegex = /^[a-zA-Z0–9._%+-]+@[a-zA-Z0–9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  // formInputs.forEach((input) => {
  //   if (input === "email") {
  //     ready = emailRegex.test(formData[input]);
  //   } else if (input === "password") {
  //     ready = passwordRegex.test(formData[input]);
  //   } else if (input === "confirmPassword") {
  //     ready = passwordRegex.test(formData[input] || "");
  //   }
  // });

  if (formData.password === formData.confirmPassword) {
    ready = true;
  }

  return ready;
};
