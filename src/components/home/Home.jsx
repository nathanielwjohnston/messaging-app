import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router";
import Navbar from "../navbar/Navbar";
import ChatPreview from "../chatPreview/ChatPreview";
import { getUsersChats } from "../../api";

function Home() {
        const { userId } = useOutletContext();

        const [loading, setLoading] = useState(true);
        const [error, setError] = useState(false);
        const [chats, setChats] = useState([]);

        useEffect(() => {
                const getChats = async () => {
                        try {
                                const res = await getUsersChats(userId);
                                const usersChats = await res.json();
                                setChats(usersChats);
                                setLoading(false);
                        } catch (err) {
                                setError(new Error(err));
                                setLoading(false);
                        }
                };

                getChats();
        }, [userId]);

        return (
                <>
                        <Navbar />
                        <div>
                                {error && <div>{error.message}</div>}
                                {loading && <div>Loading...</div>}
                                {chats.map((chat) => {
                                        return (
                                                <Link
                                                        to={"/chats/" + chat.id}
                                                        key={chat.id}
                                                >
                                                        <ChatPreview
                                                                chat={chat}
                                                                userId={userId}
                                                        />
                                                </Link>
                                        );
                                })}
                        </div>
                </>
        );
}

export default Home;
