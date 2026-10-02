import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";
import { checkUserAuthentication } from "../../api";

function App() {
        const [auth, setAuth] = useState(false);
        const [userId, setUserId] = useState(null);

        let navigate = useNavigate();
        let { pathname } = useLocation();

        useEffect(() => {
                const checkAuth = async () => {
                        try {
                                const res = await checkUserAuthentication();
                                const data = await res.json();

                                // Would throw error if failed fetch

                                setAuth(true);
                                setUserId(data.userId);
                        } catch (error) {
                                console.log(error);
                                setAuth(false);

                                if (
                                        // !auth &&
                                        pathname !== "/login" &&
                                        pathname !== "/register"
                                ) {
                                        navigate("/login");
                                        return;
                                }
                        }
                };

                checkAuth();
        }, [navigate, auth, pathname]);

        const changeAuth = (authBool) => {
                setAuth(authBool);
        };

        return <Outlet context={{ auth, changeAuth, userId }} />;
}

export default App;
