import styles from "./Profile.module.css";

import { useState, useEffect } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router";
import Navbar from "../navbar/Navbar";
import { getProfile, updateProfile, createChat } from "../../api";

function Profile() {
        const { userId } = useOutletContext();

        const [loading, setLoading] = useState("Loading...");
        const [error, setError] = useState(false);

        const [ownsProfile, setOwnsProfile] = useState(false);
        const [editing, setEditing] = useState(false);
        const [profile, setProfile] = useState({});

        const [editedProfile, setEditedProfile] = useState({});

        const location = useLocation();
        // /users/:userId/profile
        const splits = location.pathname.split("/");
        const profileId = splits[2];

        let navigate = useNavigate();

        useEffect(() => {
                const fetchProfile = async () => {
                        try {
                                const res = await getProfile(profileId);
                                const userProfile = await res.json();

                                setProfile(userProfile);
                                setEditedProfile(userProfile);

                                if (profileId === userId) {
                                        setOwnsProfile(true);
                                }
                                setError(false);
                        } catch (err) {
                                setError(new Error(err));
                        }
                        setLoading(false);
                };

                fetchProfile();
        }, [profileId, userId]);

        async function updateUserProfile() {
                setLoading("Updating profile...");

                // was just an idea, obviously not this implementation
                // if (editedProfile === profile) {
                //         setEditing(false);
                //         setLoading(false);
                // }

                try {
                        const res = await updateProfile(editedProfile, userId);
                        const updatedProfile = await res.json();
                        setProfile(updatedProfile);
                        setEditedProfile(updatedProfile);
                        setError(false);
                } catch (err) {
                        setError(new Error(err));
                }
                setLoading(false);
                setEditing(false);
        }

        async function startChat() {
                setLoading(true);
                try {
                        const res = await createChat(profileId);
                        const chat = await res.json();
                        navigate(`/chats/${chat.id}`);
                } catch (err) {
                        setError(new Error(err));
                        setLoading(false);
                }
        }

        function editProfile() {
                setEditing(true);
        }

        function cancelEdit() {
                setEditing(false);
                setEditedProfile(profile);
        }

        function updateAvatar(e) {
                setEditedProfile({
                        ...editedProfile,
                        // avatar NOT avatarUrl
                        avatar: e.target.files[0],
                });
        }

        function updateUsername(e) {
                setEditedProfile({
                        ...editedProfile,
                        username: e.target.value,
                });
        }

        function updateAge(e) {
                const age = parseInt(e.target.value);
                setEditedProfile({
                        ...editedProfile,
                        age,
                });
        }

        function updateBio(e) {
                setEditedProfile({
                        ...editedProfile,
                        bio: e.target.value,
                });
        }

        return (
                <>
                        <Navbar />
                        <div className={styles.profile}>
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
                                {!editing ? (
                                        <div className={styles.setProfile}>
                                                <span
                                                        className={
                                                                styles.idContainer
                                                        }
                                                >
                                                        <img
                                                                src={
                                                                        profile.avatarUrl
                                                                }
                                                                alt={
                                                                        profile.username +
                                                                        "'s profile picture"
                                                                }
                                                        />
                                                        <h1>
                                                                {
                                                                        profile.username
                                                                }
                                                        </h1>
                                                </span>
                                                <p>{profile.age}</p>
                                                <p>{profile.bio}</p>
                                        </div>
                                ) : (
                                        <div className={styles.editingProfile}>
                                                <form>
                                                        <label>
                                                                Change profile
                                                                picture
                                                                <input
                                                                        type="file"
                                                                        onChange={
                                                                                updateAvatar
                                                                        }
                                                                />
                                                        </label>
                                                        <label>
                                                                Username
                                                                <input
                                                                        type="text"
                                                                        value={
                                                                                editedProfile.username
                                                                        }
                                                                        onChange={
                                                                                updateUsername
                                                                        }
                                                                />
                                                        </label>
                                                        <label>
                                                                Age
                                                                <input
                                                                        type="number"
                                                                        value={
                                                                                editedProfile.age
                                                                        }
                                                                        onChange={
                                                                                updateAge
                                                                        }
                                                                        min={18}
                                                                />
                                                        </label>
                                                        <label>
                                                                Bio
                                                                <input
                                                                        type="text"
                                                                        value={
                                                                                editedProfile.bio
                                                                        }
                                                                        onChange={
                                                                                updateBio
                                                                        }
                                                                />
                                                        </label>
                                                </form>
                                        </div>
                                )}
                                {!ownsProfile && (
                                        <button
                                                onClick={startChat}
                                                className={styles.stdButton}
                                        >
                                                Chat!
                                        </button>
                                )}
                                {ownsProfile && !editing && (
                                        <button
                                                onClick={editProfile}
                                                className={styles.stdButton}
                                        >
                                                Edit
                                        </button>
                                )}
                                {ownsProfile && editing && (
                                        <>
                                                <button
                                                        onClick={
                                                                updateUserProfile
                                                        }
                                                        className={
                                                                styles.stdButton
                                                        }
                                                >
                                                        Update
                                                </button>
                                                <button
                                                        onClick={cancelEdit}
                                                        className={
                                                                styles.cancelButton
                                                        }
                                                >
                                                        Cancel
                                                </button>
                                        </>
                                )}
                        </div>
                </>
        );
}

export default Profile;
