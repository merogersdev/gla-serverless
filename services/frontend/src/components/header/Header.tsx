import Container from "../container/Container";
import { Link } from "react-router-dom";

import type { HeaderProps } from "../../types";

import styles from "./header.module.scss";

const Header = ({ title = "GLA Serverless" }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.content}>
          <Link to="/" className={styles.title}>
            {title}
          </Link>
        </div>
      </Container>
    </header>
  );
};

export default Header;
