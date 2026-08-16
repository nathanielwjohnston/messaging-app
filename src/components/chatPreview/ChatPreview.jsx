function ChatPreview({ chat, userId }) {
        const otherUser = chat.users.find((user) => user.id !== userId);
        const lastMessage = chat.messages[chat.messages.length - 1];
        return (
                <div>
                        <h2>{otherUser.username}</h2>
                        {lastMessage.userId === userId ? (
                                <p>
                                        {"You: " +
                                                lastMessage.content.slice(
                                                        0,
                                                        10,
                                                ) +
                                                " ..."}
                                </p>
                        ) : (
                                <p>
                                        {otherUser.username +
                                                ": " +
                                                lastMessage.content.slice(
                                                        0,
                                                        10,
                                                ) +
                                                " ..."}
                                </p>
                        )}
                </div>
        );
}

export default ChatPreview;
