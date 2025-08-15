import type { ReactNode } from "react";

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
