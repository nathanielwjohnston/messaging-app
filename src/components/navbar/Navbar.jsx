import { useOutletContext } from "react-router";
import { logout } from "../../api";
import { Link } from "react-router";

function Navbar() {
        const { changeAuth, userId } = useOutletContext();

        async function logOutUser() {
                try {
                        await logout();

                        changeAuth(false);
                } catch (error) {
                        // TODO: error?
                        console.log(error);
                }
        }

        return (
                <div>
                        <Link to="/">Home</Link>
                        <Link to="/users">Users</Link>
                        <Link to={`/users/${userId}/profile`}>Profile</Link>
                        <button onClick={logOutUser}>Log out</button>
                </div>
        );
}

export default Navbar;

// TODO: probably don't need to test, but more for reference, can have register/login links on
// each page to nagivate over to the other. this would obviously be implemented
// on the register and login pages
