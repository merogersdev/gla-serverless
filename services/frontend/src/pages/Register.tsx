import { FormEvent, useState, useEffect } from "react";
import { FaUserPlus, FaUserCheck } from "react-icons/fa6";
import { Navigate, useNavigate } from "react-router-dom";

import Form from "../components/form/Form";
import Input from "../components/form/input/Input";
import Label from "../components/form/label/Label";
import Button from "../components/button/Button";

import { MiniContainer } from "../components/container/Container";
import { H1, P } from "../components/typography/Typography";
import { confirm, register } from "../utils/amplify";
import { validateForm } from "../utils/validate";
import { useAuthContext } from "../context/Auth";
import { toast } from "react-toastify";
import { addUserProfile } from "../utils/fetch";
import { handleError } from "../utils/error";

export const Register = () => {
  const { user } = useAuthContext();
  const [readyToSubmit, setReadyToSubmit] = useState(false);
  const [confirmUser, setConfirmUser] = useState(false);
  const [deliveryMedium, setDeliveryMedium] = useState("");
  const [destination, setDestination] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [formData, setFormData] = useState({
    email: "michelleevarogers@gmail.com",
    password: "abc123ABC",
    givenName: "Michelle",
    familyName: "Rogers",
    confirmPassword: "abc123ABC",
  });

  const navigate = useNavigate();

  const handleChange = (e: FormEvent) => {
    const target = e.target as HTMLTextAreaElement;
    setFormData((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleRegisterSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const { email, password, givenName, familyName } = formData;

      const { nextStep } = await register(
        email,
        password,
        givenName,
        familyName
      );

      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        const destination = nextStep.codeDeliveryDetails.destination as string;
        const deliveryMedium = nextStep.codeDeliveryDetails
          .deliveryMedium as string;
        setDestination(destination);
        setDeliveryMedium(deliveryMedium);

        setConfirmUser(true);
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleRegisterConfirm = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await confirm(formData.email, confirmCode);

      if (result) {
        const { givenName, familyName } = formData;
        await addUserProfile(givenName, familyName);
        navigate("/login");
        toast.success("Confirmation successful. You may log in.");
      }
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    const validForm = validateForm(formData);
    const passwordsMatch = formData.password === formData.confirmPassword;

    if (validForm && passwordsMatch) {
      setReadyToSubmit(true);
    } else {
      setReadyToSubmit(false);
    }
  }, [formData]);

  if (user) return <Navigate to="/" replace />;

  if (confirmUser)
    return (
      <MiniContainer>
        <H1>Confirm</H1>
        <P>
          Please check your {deliveryMedium} {destination} for your confirmation
          code.
        </P>
        <Form onSubmit={handleRegisterConfirm}>
          <Label htmlFor="confirm" ariaLabel="Confirmation Code">
            <Input
              name="confirm"
              id="confirm"
              onChange={(e: any) => setConfirmCode(e.target.value)}
              value={confirmCode}
              placeholder="Confirmation Code"
              type="text"
            />
          </Label>

          <Button
            Icon={FaUserCheck}
            type="submit"
            variant="primary"
            isDisabled={false}
          >
            Confirm
          </Button>
        </Form>
      </MiniContainer>
    );

  return (
    <MiniContainer>
      <H1>Register</H1>
      <Form onSubmit={handleRegisterSubmit}>
        <Label htmlFor="email" ariaLabel="Email">
          <Input
            name="email"
            id="email"
            onChange={handleChange}
            value={formData.email}
            placeholder="Email"
            type="text"
          />
        </Label>
        <Label htmlFor="givenName" ariaLabel="First Name">
          <Input
            name="givenName"
            id="givenName"
            onChange={handleChange}
            value={formData.givenName}
            placeholder="First Name"
            type="text"
          />
        </Label>
        <Label htmlFor="familyName" ariaLabel="Last Name">
          <Input
            name="familyName"
            id="familyName"
            onChange={handleChange}
            value={formData.familyName}
            placeholder="Last Name"
            type="text"
          />
        </Label>
        <Label htmlFor="password" ariaLabel="Password">
          <Input
            name="password"
            id="password"
            onChange={handleChange}
            value={formData.password}
            placeholder="Password"
            type="password"
          />
        </Label>
        <Label htmlFor="confirmPassword" ariaLabel="Confirm Password">
          <Input
            name="confirmPassword"
            id="confirmPassword"
            onChange={handleChange}
            value={formData.confirmPassword}
            placeholder="Confirm Password"
            type="password"
          />
        </Label>
        <Button
          Icon={FaUserPlus}
          type="submit"
          variant="primary"
          isDisabled={!readyToSubmit}
        >
          Register
        </Button>
      </Form>
    </MiniContainer>
  );
};

export default Register;
