import styles from "./Login.module.css";

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useOutletContext } from "react-router";
import { login } from "../../api";

function Login() {
        const { changeAuth } = useOutletContext();

        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [error, setError] = useState(null);

        let navigate = useNavigate();

        function updateUsername(e) {
                setUsername(e.target.value);
        }

        function updatePassword(e) {
                setPassword(e.target.value);
        }

        async function attemptLogIn() {
                if (!(username && password)) {
                        setError(new Error("Please fill the required fields"));
                        return;
                }

                try {
                        await login(username, password);

                        // Would throw error if failed fetch
                        changeAuth(true);
                        navigate("/");
                } catch (error) {
                        setError(error);
                }
        }

        return (
                <div className={styles.login}>
                        {error && (
                                <div className={styles.error}>
                                        {error.message}
                                </div>
                        )}
                        <div className={styles.loginForm}>
                                <div>Log in</div>
                                <form>
                                        <label>
                                                Username
                                                <input
                                                        type="text"
                                                        value={username}
                                                        onChange={
                                                                updateUsername
                                                        }
                                                        required
                                                />
                                        </label>
                                        <label>
                                                Password
                                                <input
                                                        type="text"
                                                        value={password}
                                                        onChange={
                                                                updatePassword
                                                        }
                                                        required
                                                />
                                        </label>
                                        <button
                                                type="button"
                                                onClick={attemptLogIn}
                                        >
                                                Log in
                                        </button>
                                </form>
                                <Link to="/register">
                                        No account? Register here
                                </Link>
                        </div>
                </div>
        );
}

export default Login;
