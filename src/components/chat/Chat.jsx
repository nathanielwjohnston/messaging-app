import { useState, useEffect } from "react";
import { useOutletContext, useLocation } from "react-router";
import Navbar from "../navbar/Navbar";
import Message from "../message/Message";
import SendBox from "../sendBox/SendBox";
import { getChat, sendMessage } from "../../api";

function Chat() {
        const { userId } = useOutletContext();

        const [loading, setLoading] = useState("Loading...");
        const [error, setError] = useState(false);

        const [chat, setChat] = useState(null);
        const [messages, setMessages] = useState([]);
        const [message, setMessage] = useState("");

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
                        } catch (err) {
                                setError(new Error(err));
                        }
                        setLoading(false);
                };

                fetchChat();
        }, [chatId]);

        async function sendMessageToUser(message) {
                setLoading("Sending message...");
                try {
                        const res = await sendMessage(message, chat.id);
                        const newMessage = await res.json();
                        setMessages([...messages, newMessage]);
                        setMessage("");
                } catch (err) {
                        setMessage(message);
                        setError(new Error(err));
                }
                setLoading(false);
        }

        function updateMessage(e) {
                setMessage(e.target.value);
        }

        return (
                <>
                        <Navbar></Navbar>
                        <div>
                                <h1>
                                        {chat &&
                                                chat.users.find(
                                                        (user) =>
                                                                user.id !==
                                                                userId,
                                                ).username}
                                </h1>
                                {error && <div>{error.message}</div>}
                                {loading && <div>{loading}</div>}
                                {messages.map((message) => {
                                        return (
                                                <div key={message.id}>
                                                        <Message
                                                                message={
                                                                        message
                                                                }
                                                                userId={userId}
                                                        />
                                                </div>
                                        );
                                })}
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
                </>
        );
}

export default Chat;
