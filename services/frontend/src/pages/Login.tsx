import { FormEvent, useState } from "react";

import Form from "../components/form/Form";
import Input from "../components/input/Input";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
    console.log(formData);
  };

  return (
    <div>
      <Form>
        <Input
          name="email"
          id="email"
          onChange={handleChange}
          value={formData.email}
        />
        <Input
          name="password"
          id="password"
          onChange={handleChange}
          value={formData.password}
        />
        <Input
          name="confirmPassword"
          id="confirmPassword"
          onChange={handleChange}
          value={formData.confirmPassword}
        />
      </Form>
    </div>
  );
}
