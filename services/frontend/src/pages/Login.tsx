import { FormEvent, useState } from "react";

import Form, { FormSeparator } from "../components/form/Form";
import Input from "../components/form/input/Input";
import Label from "../components/form/label/Label";
import { MiniContainer } from "../components/container/Container";
import { H1 } from "../components/typography/Typography";
import Button from "../components/button/Button";
import { FaEnvelope, FaGoogle } from "react-icons/fa6";

import { validateForm } from "../utils/validate";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    ready: false,
  });

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
    console.log(validateForm(formData));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    console.log("submit");
  };

  return (
    <MiniContainer>
      <H1>Login</H1>
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
        <Button
          Icon={FaEnvelope}
          type="submit"
          variant="primary"
          isDisabled={false}
        >
          Login with Email
        </Button>
        <FormSeparator>or</FormSeparator>
        <Button
          Icon={FaGoogle}
          type="button"
          variant="secondary"
          isDisabled={false}
        >
          Login with Google
        </Button>
      </Form>
    </MiniContainer>
  );
}
