import { useState } from "react";
import Container from "../container/Container";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";

import Nav from "../nav/Nav";

import type { HeaderProps } from "../../types";

import styles from "./header.module.scss";

const Header = ({ title = "GLA Serverless" }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    {
      label: "Login",
      href: "/login",
    },
    {
      label: "Register",
      href: "/register",
    },
  ];
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.content}>
          <Link to="/" className={styles.title}>
            {title}
          </Link>
          <Nav links={navLinks} menuOpen={menuOpen} />
        </div>
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaTimes className={styles.icon} />
          ) : (
            <FaBars className={styles.icon} />
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
