import { NavLink } from "react-router-dom";
import { FaCircleUser } from "react-icons/fa6";

import { useAuthContext } from "../../../context/Auth";
import type { NavProps } from "../../../types";
import Button from "../../button/Button";
import { logout } from "../../../utils/amplify";
import { useNavigate } from "react-router-dom";

import styles from "./Nav.module.scss";

const Nav = ({ links, menuOpen, setMenuOpen }: NavProps) => {
  const { auth, setAuth } = useAuthContext();

  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setAuth(null);
    navigate("/login");
  };

  const openClass = menuOpen ? styles.open : "";
  return (
    <nav className={`${styles.nav} ${openClass}`}>
      <ul className={styles.ul}>
        {auth?.user ? (
          <li className={styles.li}>
            <div className={styles.info}>
              <FaCircleUser className={styles.icon} />
              <div className={styles.user}>Hi, {auth.user.givenName}</div>
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
