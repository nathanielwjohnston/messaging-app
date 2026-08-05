import { Outlet } from "react-router";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { checkUserAuthentication } from "../../api";

function App() {
        const [auth, setAuth] = useState(false);

        let navigate = useNavigate();

        console.log(auth);

        useEffect(() => {
                const checkAuth = async () => {
                        try {
                                await checkUserAuthentication();
                                console.log("test");

                                // Would throw error if failed fetch
                                setAuth(true);
                        } catch (error) {
                                // TODO: show error?
                                console.log(error);
                                setAuth(false);
                                navigate("/login");
                        }
                };

                checkAuth();
        }, [navigate]);

        const changeAuth = (authBool) => {
                setAuth(authBool);
        };

        return <Outlet context={{ auth, changeAuth }} />;
}

export default App;
