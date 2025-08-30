// Styles
import { motion, AnimatePresence } from "framer-motion";
import styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.motion}
      >
        <div className={styles.spinner}>
          <div className={styles.container}></div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Spinner;
