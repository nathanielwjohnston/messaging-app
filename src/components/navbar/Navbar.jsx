import styles from "./Navbar.module.css";

import { useOutletContext } from "react-router";
import { logout } from "../../api";
import { Link } from "react-router";

function Navbar() {
        const { changeAuth, userId } = useOutletContext();

        async function logOutUser() {
                try {
                        await logout();

                        changeAuth(false);
                } catch (error) {
                        console.log(error);
                }
        }

        return (
                <div className={styles.navbar}>
                        <Link to="/">Home</Link>
                        <Link to="/users">Users</Link>
                        <Link to={`/users/${userId}/profile`}>Profile</Link>
                        <button onClick={logOutUser}>Log out</button>
                </div>
        );
}

export default Navbar;
