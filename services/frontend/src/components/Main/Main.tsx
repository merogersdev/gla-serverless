import type { NodeProps } from "../../types";

import "./Main.scss";

const Main = ({ children }: NodeProps) => {
  return <main className="main">{children}</main>;
};

export default Main;
