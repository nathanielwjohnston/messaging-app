import App from "./components/app/App";
import ErrorPage from "./components/errorPage/ErrorPage";
import Chat from "./components/chat/Chat";
import Home from "./components/home/Home";
import Users from "./components/users/Users";
import Profile from "./components/profile/Profile";
import Login from "./components/login/Login";
import Register from "./components/register/Register";

const routes = [
        {
                path: "/",
                element: <App />,
                errorElement: <ErrorPage />,
                children: [
                        { index: true, element: <Home /> },
                        { path: "/chats/:chatId", element: <Chat /> },
                        { path: "/users", element: <Users /> },
                        {
                                path: "/users/:userId/profile",
                                element: <Profile />,
                        },
                        { path: "/login", element: <Login /> },
                        { path: "/register", element: <Register /> },
                ],
        },
];

export default routes;
