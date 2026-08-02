import { useState } from "react";
import { useNavigate } from "react-router";
import { login } from "../../api";

function Login() {
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
                        navigate("/");
                } catch (error) {
                        setError(error);
                }
        }

        return (
                <>
                        {error && <div>{error.message}</div>}
                        <div>Log in</div>
                        <form>
                                <label>
                                        Username
                                        <input
                                                type="text"
                                                value={username}
                                                onChange={updateUsername}
                                                required
                                        />
                                </label>
                                <label>
                                        Password
                                        <input
                                                type="text"
                                                value={password}
                                                onChange={updatePassword}
                                                required
                                        />
                                </label>
                                <button type="button" onClick={attemptLogIn}>
                                        Log in
                                </button>
                        </form>
                </>
        );
}

export default Login;
