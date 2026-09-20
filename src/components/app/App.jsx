import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { checkUserAuthentication } from "../../api";

function App() {
        const [auth, setAuth] = useState(false);
        const [userId, setUserId] = useState(null);

        let navigate = useNavigate();
        let { pathname } = useLocation();

        console.log(auth);
        console.log(pathname);

        useEffect(() => {
                const checkAuth = async () => {
                        try {
                                const res = await checkUserAuthentication();
                                const data = await res.json();

                                // Would throw error if failed fetch
                                console.log("set true");

                                setAuth(true);
                                setUserId(data.userId);
                        } catch (error) {
                                // TODO: show error in ui?
                                console.log(error);
                                setAuth(false);

                                // TODO? works i THINK but i dont really like it

                                if (
                                        // !auth &&
                                        pathname !== "/login" &&
                                        pathname !== "/register"
                                ) {
                                        console.log("resr");
                                        navigate("/login");
                                        return;
                                }
                        }

                        // TODO: using state after it has been set?

                        console.log(auth);
                };

                checkAuth();
        }, [navigate, auth, pathname]);

        const changeAuth = (authBool) => {
                setAuth(authBool);
        };
        console.log("test");

        // TODO: is this auth checking really right?
        // Plus, might not need to send auth itself round
        // the children?

        return <Outlet context={{ auth, changeAuth, userId }} />;
}

export default App;
