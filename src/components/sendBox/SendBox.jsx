function SendBox({ message, updateMessage, sendMessage }) {
        return (
                <div>
                        <input
                                type="text"
                                value={message}
                                onChange={updateMessage}
                        />
                        <button
                                onClick={() => {
                                        console.log("click");
                                        sendMessage(message);
                                }}
                        >
                                Send
                        </button>
                </div>
        );
}

export default SendBox;
