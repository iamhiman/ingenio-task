import styles from "./Card.module.css";

export const Card = ({ cssStyles, children }) => {
  return <article className={`${styles.card} ${cssStyles}`}>{children}</article>;
};
