import Container from "../Container/Container";
import { Link } from "react-router-dom";

import { setLightTheme, setDarkTheme } from "../../app/slices/themeSlice";
import { useAppSelector } from "../../app/hooks";

import type { HeaderProps } from "../../types";

import "./Header.scss";

const Header = ({ title = "GLA Serverless" }: HeaderProps) => {
  const { value } = useAppSelector((state) => state.theme);

  return (
    <header className="header">
      <Container>
        <div className="header__content">
          <Link to="/" className="header__title">
            {title}
          </Link>
          <button>Theme</button>
        </div>
      </Container>
    </header>
  );
};

export default Header;
