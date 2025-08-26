import { NavLink } from "react-router-dom";

import type { NavProps } from "../../../types";

import styles from "./Nav.module.scss";

const Nav = ({ links, menuOpen, setMenuOpen }: NavProps) => {
  const openClass = menuOpen ? styles.open : "";
  return (
    <nav className={`${styles.nav} ${openClass}`}>
      <ul className={styles.ul}>
        {links &&
          links.map(({ label, href }) => (
            <li className={styles.li} key={label}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? `${styles.a} ${styles.active}` : `${styles.a}`
                }
                to={href}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Nav;
