import { API_URL } from "./config";

// TODO: set auth to false if these fail because of auth? when auth is required of course

export const register = async (username, password, passwordConfirm) => {
        const res = await fetch(`${API_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        username,
                        password,
                        passwordConfirm,
                }),
                credentials: "include",
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
                credentials: "include",
        });

        // TODO: user not being logged out properly

        if (!res.ok) {
                const result = await res.json();
                console.log(result.error);
                throw new Error(`Failed to log in user: ${res.status}`);
        }
};

export const checkUserAuthentication = async () => {
        const res = await fetch(`${API_URL}/me`, { credentials: "include" });

        if (!res.ok) {
                throw new Error(`Failed to authenticate user: ${res.status}`);
        }

        return res;
};

export const logout = async () => {
        const res = await fetch(`${API_URL}/logout`, {
                method: "POST",
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to log out user: ${res.status}`);
        }
};
