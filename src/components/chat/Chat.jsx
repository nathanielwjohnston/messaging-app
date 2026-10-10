import styles from "./Chat.module.css";

import { useState, useEffect } from "react";
import { useOutletContext, useLocation, Link } from "react-router";
import Navbar from "../navbar/Navbar";
import Message from "../message/Message";
import SendBox from "../sendBox/SendBox";
import { getChat, sendMessage } from "../../api";

function Chat() {
        const { userId } = useOutletContext();

        const [loading, setLoading] = useState("Loading...");
        const [error, setError] = useState();

        const [chat, setChat] = useState(null);
        const [messages, setMessages] = useState([]);
        const [message, setMessage] = useState("");

        const [otherUser, setOtherUser] = useState({});

        const location = useLocation();
        const [, chatId] = location.pathname.split("chats/");

        useEffect(() => {
                const fetchChat = async () => {
                        try {
                                const res = await getChat(chatId);
                                const chat = await res.json();
                                setChat(chat);
                                const chatMessages = chat.messages.sort(
                                        function (a, b) {
                                                let aTime = new Date(
                                                        a.createdAt,
                                                );
                                                let bTime = new Date(
                                                        b.createdAt,
                                                );

                                                if (aTime < bTime) return -1;
                                                if (aTime > bTime) return 1;
                                                return 0;
                                        },
                                );
                                setMessages(chatMessages);
                                const recipient = chat.users.find(
                                        (user) => user.id !== userId,
                                );
                                setOtherUser(recipient);
                                setError(false);
                        } catch (err) {
                                setError(new Error(err));
                        }
                        setLoading(false);

                        await window.scrollTo(0, document.body.scrollHeight);
                };

                fetchChat();
        }, [chatId, userId]);

        async function sendMessageToUser(message) {
                setLoading("Sending message...");
                try {
                        const res = await sendMessage(message, chat.id);
                        const newMessage = await res.json();
                        setMessages([...messages, newMessage]);
                        setMessage("");
                        setError(false);
                } catch (err) {
                        setMessage(message);
                        setError(new Error(err));
                }
                setLoading(false);

                await window.scrollTo(0, document.body.scrollHeight);
        }

        function updateMessage(e) {
                setMessage(e.target.value);
        }

        return (
                <div className={styles.chatOuter}>
                        <Navbar></Navbar>
                        <div className={styles.chat}>
                                <Link
                                        to={
                                                "/users/" +
                                                otherUser.id +
                                                "/profile"
                                        }
                                        className={styles.heading}
                                >
                                        <h1>{chat && otherUser.username}</h1>
                                </Link>

                                {error && (
                                        <div className={styles.error}>
                                                {error.message}
                                        </div>
                                )}
                                {loading && (
                                        <div className={styles.loading}>
                                                {loading}
                                        </div>
                                )}
                                {!loading && (
                                        <div className={styles.messages}>
                                                {messages.map((message) => {
                                                        return (
                                                                <div
                                                                        key={
                                                                                message.id
                                                                        }
                                                                >
                                                                        <Message
                                                                                message={
                                                                                        message
                                                                                }
                                                                                userId={
                                                                                        userId
                                                                                }
                                                                        />
                                                                </div>
                                                        );
                                                })}
                                        </div>
                                )}

                                <div className={styles.anchor}></div>
                        </div>
                        <SendBox
                                message={message}
                                updateMessage={(e) => {
                                        updateMessage(e);
                                }}
                                sendMessage={(message) => {
                                        sendMessageToUser(message);
                                }}
                        />
                </div>
        );
}

export default Chat;
