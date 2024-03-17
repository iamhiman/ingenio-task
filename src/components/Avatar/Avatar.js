import styles from "./Avatar.module.css";

export const Avatar = ({ imageUrl, imageText, loading }) => {
  return <img src={imageUrl} alt={imageText} loading={loading} className={styles.userImage} />;
};
