import styles from "./Button.module.css";

export const Button = ({ cssStyles, buttonText, onButtonClick = () => {} }) => {
  return (
    <button className={`${styles.button} ${cssStyles}`} onClick={onButtonClick}>
      {buttonText}
    </button>
  );
};
