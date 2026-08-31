function ChatPreview({ chat, userId }) {
        console.log(chat);
        console.log(userId);

        const otherUser = chat.users.find((user) => user.id !== userId);
        let lastMessage;
        if (chat.messages.length) {
                lastMessage = chat.messages[chat.messages.length - 1];
        } else {
                return (
                        <div>
                                <h2>{otherUser.username}</h2>
                                <p>No messages...</p>
                        </div>
                );
        }

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
