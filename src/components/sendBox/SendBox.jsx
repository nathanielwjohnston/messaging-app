import styles from "./SendBox.module.css";

function SendBox({ message, updateMessage, sendMessage }) {
        return (
                <div className={styles.send}>
                        <input
                                type="text"
                                value={message}
                                onChange={updateMessage}
                        />
                        <button
                                onClick={() => {
                                        sendMessage(message);
                                }}
                        >
                                Send
                        </button>
                </div>
        );
}

export default SendBox;
