import { NavLink } from "react-router-dom";

import Button from "../../button/Button";
import { useAuthContext } from "../../../context/Auth";
import { logout } from "../../../utils/amplify";

import type { NavProps } from "../../../types";

import styles from "./Nav.module.scss";

const Nav = ({ links, menuOpen, setMenuOpen }: NavProps) => {
  const { user, setUser } = useAuthContext();

  const firstInitial = user?.given_name?.[0] || "";
  const lastInitial = user?.family_name?.[0] || "";

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const openClass = menuOpen ? styles.open : "";
  return (
    <nav className={`${styles.nav} ${openClass}`}>
      <ul className={styles.ul}>
        {user ? (
          <li className={styles.li}>
            <div className={styles.info}>
              <div className={styles.avatar}>
                {firstInitial}
                {lastInitial}
              </div>
              <div className={styles.user}>Hi, {user.given_name}</div>
              <Button variant="outline" onClick={handleLogout} type="button">
                Logout
              </Button>
            </div>
          </li>
        ) : (
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
          ))
        )}
      </ul>
    </nav>
  );
};

export default Nav;
