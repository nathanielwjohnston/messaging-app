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

        if (!res.ok) {
                throw new Error(`Failed to register user: ${res.status}`);
        }
};

export const login = async (username, password) => {
        const res = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        username,
                        password,
                }),
        });

        if (!res.ok) {
                throw new Error(`Failed to log in user: ${res.status}`);
        }
};
