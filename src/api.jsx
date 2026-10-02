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

export const getUsersChats = async (userId) => {
        const res = await fetch(`${API_URL}/users/${userId}/chats`, {
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to get user's chats: ${res.status}`);
        }

        return res;
};

export const getUsers = async () => {
        const res = await fetch(`${API_URL}/users`, {
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to get users: ${res.status}`);
        }

        return res;
};

export const createChat = async (recipientId) => {
        const res = await fetch(`${API_URL}/chats`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        recipientId,
                }),
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to create or get chat: ${res.status}`);
        }

        return res;
};

export const getChat = async (chatId) => {
        const res = await fetch(`${API_URL}/chats/${chatId}`, {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to create or get chat: ${res.status}`);
        }

        return res;
};

export const sendMessage = async (message, chatId) => {
        const res = await fetch(`${API_URL}/chats/${chatId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                        content: message,
                }),
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to create or get chat: ${res.status}`);
        }

        return res;
};

export const getProfile = async (userId) => {
        const res = await fetch(`${API_URL}/users/${userId}/profile`, {
                headers: { "Content-Type": "application/json" },
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to get profile: ${res.status}`);
        }

        return res;
};

export const updateProfile = async (editedProfile, userId) => {
        const data = new FormData();
        for (const property in editedProfile) {
                data.append(property, editedProfile[property]);
        }

        const res = await fetch(`${API_URL}/users/${userId}/profile`, {
                method: "PUT",
                body: data,
                credentials: "include",
        });

        if (!res.ok) {
                throw new Error(`Failed to update profile: ${res.status}`);
        }

        return res;
};
