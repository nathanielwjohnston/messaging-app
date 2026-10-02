import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useOutletContext } from "react-router";
import { register } from "../../api";

function Register() {
        const { changeAuth } = useOutletContext();

        const [username, setUsername] = useState("");
        const [password, setPassword] = useState("");
        const [passwordConfirm, setPasswordConfirm] = useState("");
        const [error, setError] = useState(null);

        let navigate = useNavigate();

        function updateUsername(e) {
                setUsername(e.target.value);
        }

        function updatePassword(e) {
                setPassword(e.target.value);
        }

        function updatePasswordConfirm(e) {
                setPasswordConfirm(e.target.value);
        }

        async function attemptRegistration() {
                if (!(username && password && passwordConfirm)) {
                        setError(new Error("Please fill the required fields"));
                        return;
                }

                if (password !== passwordConfirm) {
                        setError(new Error("Passwords must match"));
                        return;
                }

                try {
                        await register(username, password, passwordConfirm);

                        // Would throw error if failed fetch
                        changeAuth(true);
                        navigate("/");
                } catch (error) {
                        setError(error);
                }
        }

        return (
                <>
                        {error && <div>{error.message}</div>}
                        <div>Register</div>
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
                                <label>
                                        Confirm password
                                        <input
                                                type="text"
                                                value={passwordConfirm}
                                                onChange={updatePasswordConfirm}
                                                required
                                        />
                                </label>
                                <button
                                        type="button"
                                        onClick={attemptRegistration}
                                >
                                        Register
                                </button>
                        </form>
                        <Link to="/login">
                                Alreay have an account? Log in here
                        </Link>
                </>
        );
}

export default Register;
