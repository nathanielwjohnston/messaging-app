function User({ user }) {
        return (
                <div>
                        <img
                                src={user.profile.avatarUrl}
                                alt={user.username + "'s picture"}
                        />
                        <p>{user.username}</p>
                </div>
        );
}

export default User;
