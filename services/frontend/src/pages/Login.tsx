import { FormEvent, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Form from "../components/form/Form";
import Input from "../components/form/input/Input";
import Label from "../components/form/label/Label";
import { MiniContainer } from "../components/container/Container";
import { H1 } from "../components/typography/Typography";
import Button from "../components/button/Button";
import { FaEnvelope } from "react-icons/fa6";
import { validateForm } from "../utils/validate";
import { useAuthContext } from "../context/Auth";
import { useLogin } from "../hooks/useAuth";

export const Login = () => {
  const { user } = useAuthContext();
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email: "michelleevarogers@gmail.com",
    password: "abc123ABC",
  });

  const { mutateAsync: login, isPending } = useLogin();
  const navigate = useNavigate();

  const handleLoginChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const { email, password } = formData;

    try {
      const user = await login({ username: email, password });
      if (user.isSignedIn) {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const validForm = validateForm(formData);

    if (validForm) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [formData]);

  if (user) return <Navigate to="/" />;

  return (
    <MiniContainer>
      <H1>Login</H1>
      <Form onSubmit={handleLoginSubmit}>
        <Label htmlFor="email" ariaLabel="Email">
          <Input
            name="email"
            id="email"
            onChange={handleLoginChange}
            value={formData.email}
            placeholder="Email"
            type="text"
          />
        </Label>
        <Label htmlFor="password" ariaLabel="Password">
          <Input
            name="password"
            id="password"
            onChange={handleLoginChange}
            value={formData.password}
            placeholder="Password"
            type="password"
          />
        </Label>
        <Button
          Icon={FaEnvelope}
          type="submit"
          variant="primary"
          isDisabled={!readyToSubmit || isPending}
          isLoading={isPending}
        >
          Login with Email
        </Button>
        {/* <FormSeparator>or</FormSeparator>
        <Button
          Icon={FaGoogle}
          type="button"
          variant="secondary"
          isDisabled={false}
        >
          Login with Google
        </Button> */}
      </Form>
    </MiniContainer>
  );
};

export default Login;
