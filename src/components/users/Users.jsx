import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import User from "../user/User";
import { getUsers, createChat } from "../../api";

function Users() {
        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [users, setUsers] = useState([]);

        let navigate = useNavigate();

        useEffect(() => {
                const fetchUsers = async () => {
                        try {
                                const res = await getUsers();
                                const users = await res.json();
                                setUsers(users);
                                setLoading(false);
                        } catch (err) {
                                setError(new Error(err));
                                setLoading(false);
                        }
                };

                fetchUsers();
        }, []);

        async function startChat(userId) {
                setLoading(true);
                try {
                        const res = await createChat(userId);
                        const chat = await res.json();
                        navigate(`/chats/${chat.id}`);
                } catch (err) {
                        setError(new Error(err));
                        setLoading(false);
                }
        }

        return (
                <>
                        <Navbar />
                        <div>
                                {error && <div>{error.message}</div>}
                                {loading && <div>Loading...</div>}
                                {users.map((user) => {
                                        return (
                                                <div
                                                        key={user.id}
                                                        onClick={() => {
                                                                startChat(
                                                                        user.id,
                                                                );
                                                        }}
                                                >
                                                        <User user={user} />
                                                </div>
                                        );
                                })}
                        </div>
                </>
        );
}

export default Users;
