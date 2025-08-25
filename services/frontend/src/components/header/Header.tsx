import { useState } from "react";
import Container from "../container/Container";
import { Link } from "react-router-dom";
import { FaBars, FaXmark, FaBowlFood } from "react-icons/fa6";

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
            <FaBowlFood className={styles.favicon} />
            {title}
          </Link>
          <Nav links={navLinks} menuOpen={menuOpen} />
        </div>
        <div
          className={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <FaXmark className={styles.icon} />
          ) : (
            <FaBars className={styles.icon} />
          )}
        </div>
      </Container>
    </header>
  );
};

export default Header;
