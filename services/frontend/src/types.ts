import type { ReactNode } from "react";
import type { IconType } from "react-icons/lib";
import type { UserAttributeKey } from "@aws-amplify/auth";

export type NodeProps = {
  children: ReactNode;
};

export type HeaderProps = {
  title: string | null;
};

export type NavLinkType = {
  label: string;
  href: string;
};

export type FormProps = {
  onSubmit: any;
  name: string;
  id: string;
  children: ReactNode;
};

export type InputProps = {
  onChange: any;
  name: string;
  id: string;
  value: string;
  placeholder: string;
  type: "text" | "password";
};

export type LabelProps = {
  htmlFor: string;
  ariaLabel: string;
  children: ReactNode;
};

export type ButtonProps = {
  Icon?: IconType;
  type: "button" | "submit";
  children: ReactNode;
  variant: "primary" | "secondary" | "outline";
  onClick?: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
};

export type ItemProps = {
  VALUE: string;
  SK: string;
};

export type ItemListProps = {
  items?: ItemProps[] | null | undefined;
  message: string;
};

export type NavProps = {
  links: NavLinkType[];
  menuOpen: boolean;
  setMenuOpen: any;
};

export type FormDataProps = {
  email: string;
  password: string;
  givenName?: string;
  familyName?: string;
  confirmPassword?: string | undefined;
  ready?: boolean;
};

export type UserType = {
  email: string;
  givenName: string;
  familyName: string;
};

export type AuthContextType = {
  user: Partial<Record<UserAttributeKey, string>> | null | undefined;
};
