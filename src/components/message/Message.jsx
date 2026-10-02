function getMessageDate(date) {
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let hour = date.getHours();
        let minutes = date.getMinutes();

        day = day < 10 ? `0${day}` : day;
        month = month < 10 ? `0${month}` : month;
        year = year.toString().slice(-2);

        hour = hour < 10 ? `0${hour}` : hour;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        const formattedDate = `${hour}:${minutes} ${day}/${month}/${year}`;

        return formattedDate;
}

function Message({ message, userId }) {
        const date = new Date(message.createdAt);
        const formattedDate = getMessageDate(date);
        let user;

        if (message.user.id === userId) {
                user = "You";
        } else {
                user = message.user.username;
        }

        return (
                <div>
                        <h3>{user}</h3> <span>{formattedDate}</span>
                        <p>{message.content}</p>
                </div>
        );
}

export default Message;
