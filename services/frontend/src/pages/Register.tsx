import { FormEvent, useState } from "react";

import Form, { FormSeparator } from "../components/form/Form";
import Input from "../components/form/input/Input";
import Label from "../components/form/label/Label";
import { MiniContainer } from "../components/container/Container";
import { H1 } from "../components/typography/Typography";
import Button from "../components/button/Button";
import { FaEnvelope, FaUserPlus } from "react-icons/fa6";

import { validateForm } from "../utils/validate";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    ready: false,
  });

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
      ready: validateForm(formData),
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("submit");
  };

  return (
    <MiniContainer>
      <H1>Register</H1>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="email" ariaLabel="Email">
          <Input
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
          />
        </Label>
        <Label htmlFor="password" ariaLabel="Password">
          <Input
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
          />
        </Label>
        <Label htmlFor="confirmPassword" ariaLabel="Confirm Password">
          <Input
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            placeholder="Confirm Password"
          />
        </Label>
        <Button
          Icon={FaUserPlus}
          type="submit"
          variant="primary"
          isDisabled={!formData.ready}
        >
          Register
        </Button>
      </Form>
    </MiniContainer>
  );
}
