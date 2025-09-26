import { useState } from "react";
import Container from "../container/Container";
import { Link } from "react-router-dom";
import { FaBars, FaXmark, FaCloud } from "react-icons/fa6";

import Nav from "./nav/Nav";

import type { HeaderProps } from "../../types";

import styles from "./Header.module.scss";

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
          <Link to="/" className={styles.logo}>
            <FaCloud className={styles.favicon} />
            <span className={styles.title}>{title}</span>
          </Link>
          <Nav links={navLinks} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
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
