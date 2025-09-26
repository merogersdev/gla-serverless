import type { NodeProps } from "../../types";

import { LoadingContainer } from "../container/Container";
import Spinner from "../spinner/Spinner";

import { useAuthContext } from "../../context/Auth";

import styles from "./Main.module.scss";

const Main = ({ children }: NodeProps) => {
  const { isPending } = useAuthContext();

  if (isPending) {
    return (
      <LoadingContainer>
        <Spinner />
      </LoadingContainer>
    );
  }
  return <main className={styles.main}>{children}</main>;
};

export default Main;
