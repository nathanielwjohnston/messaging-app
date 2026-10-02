function ChatPreview({ chat, userId }) {
        const otherUser = chat.users.find((user) => user.id !== userId);
        let lastMessage;
        if (chat.messages.length) {
                lastMessage = chat.messages[chat.messages.length - 1];
        } else {
                return (
                        <>
                                <img
                                        src={otherUser.profile.avatarUrl}
                                        alt={otherUser.username + "'s picture"}
                                />
                                <div>
                                        <h2>{otherUser.username}</h2>
                                        <p>No messages...</p>
                                </div>
                        </>
                );
        }

        return (
                <div>
                        <img
                                src={otherUser.profile.avatarUrl}
                                alt={otherUser.username + "'s picture"}
                        />
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
