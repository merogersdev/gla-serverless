import { FormEvent, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import Form, { FormSeparator } from "../components/form/Form";
import Input from "../components/form/input/Input";
import Label from "../components/form/label/Label";
import { MiniContainer } from "../components/container/Container";
import { H1 } from "../components/typography/Typography";
import Button from "../components/button/Button";
import { FaEnvelope, FaGoogle } from "react-icons/fa6";
import { validateForm } from "../utils/validate";
import { useAuthContext } from "../context/Auth";
import { handleError } from "../utils/error";
import { loginWithGoogle, login } from "../utils/amplify";

export const Login = () => {
  const { user, isPending } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [formData, setFormData] = useState({
    email: "michelleevarogers@gmail.com",
    password: "abc123ABC",
  });

  const navigate = useNavigate();

  const handleLoginChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleGoogleLogin = async () => {
    await loginWithGoogle();
  };

  const handleLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { email, password } = formData;

    try {
      const user = await login(email, password);
      if (user.isSignedIn) {
        navigate("/");
      }
      setLoading(false);
    } catch (error) {
      handleError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const validForm = validateForm(formData);

    if (validForm) {
      setReadyToSubmit(true);
      return;
    }

    setReadyToSubmit(false);
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
          isLoading={loading}
        >
          Login with Email
        </Button>
        <FormSeparator>or</FormSeparator>
        <Button
          Icon={FaGoogle}
          type="button"
          variant="google"
          isDisabled={isPending}
          isLoading={isPending}
          onClick={handleGoogleLogin}
        >
          Login with Google
        </Button>
      </Form>
    </MiniContainer>
  );
};

export default Login;
