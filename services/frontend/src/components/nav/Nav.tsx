import styles from "./nav.module.scss";
import { NavLink } from "react-router-dom";

import type { NavLinkType } from "../../types";

const Nav = ({
  links,
  menuOpen,
}: {
  links: NavLinkType[];
  menuOpen: boolean;
}) => {
  const openClass = menuOpen ? styles.open : "";
  return (
    <nav className={`${styles.nav} ${openClass}`}>
      <ul className={styles.ul}>
        {links &&
          links.map(({ label, href }) => (
            <li className={styles.li} key={label}>
              <NavLink className={styles.a} to={href}>
                {label}
              </NavLink>
            </li>
          ))}
      </ul>
    </nav>
  );
};

export default Nav;
