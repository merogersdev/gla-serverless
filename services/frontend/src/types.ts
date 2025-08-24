import type { ReactNode, FormEvent } from "react";

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
};
