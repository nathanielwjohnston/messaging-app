import styles from "./User.module.css";

function User({ user }) {
        return (
                <div className={styles.user}>
                        <img
                                src={user.profile.avatarUrl}
                                alt={user.username + "'s picture"}
                        />
                        <p>{user.username}</p>
                </div>
        );
}

export default User;
