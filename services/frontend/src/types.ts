import type { ReactNode } from "react";
import type { IconType } from "react-icons/lib";

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
};

export type LabelProps = {
  htmlFor: string;
  ariaLabel: string;
  children: ReactNode;
};

export type ButtonProps = {
  Icon: IconType;
  type: "button" | "submit";
  children: ReactNode;
  variant: "primary" | "secondary" | "outline";
  onClick?: () => void;
  isDisabled: boolean;
};

export type ItemProps = {
  onClick?: () => void;
  name: string;
  id: string;
};

export type ItemListProps = {
  items: ItemProps[];
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
  confirmPassword?: string | undefined;
  ready?: boolean;
};
