import { API_URL } from "./config";

export const register = async (username, password, passwordConfirm) => {
        const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        username,
                        password,
                        passwordConfirm,
                }),
        });

        console.log(res);

        if (!res.ok) {
                throw new Error(`Failed to register user: ${res.status}`);
        }
};
