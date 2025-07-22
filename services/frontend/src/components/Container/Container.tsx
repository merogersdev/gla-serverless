import type { NodeProps } from "../../types";

import "./Container.scss";

const Container = ({ children }: NodeProps) => {
  return <div className="container">{children}</div>;
};

export default Container;
