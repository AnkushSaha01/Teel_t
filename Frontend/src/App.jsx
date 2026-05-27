import React from "react";
import Form from "./pages/form/pages/Form";
import Home from "./pages/home/pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Feed from "./pages/feed/pages/Feed";
import Register from "./pages/register/pages/Register";
import Login from "./pages/login/pages/Login";
import LandingLayout from "./layout/LandingLayout";
import Search from "./pages/search/Search";
import Profile from "./pages/profile/pages/Profile";
import Messages from "./pages/messages/page/Messages";
import Notifications from "./pages/notifications/pages/Notifications";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
    ],
  },
  {
    path: "/app",
    element: <AppLayout />,
    children: [
      {
        path: "create-post",
        element: <Form />,
      },
      {
        path: "feed",
        element: <Feed />,
      },
      {
        path: "search",
        element: <Search />
      },
      {
        path: "profile",
        element: <Profile />
      },
      {
        path:"messages",
        element:<Messages />
      },
      {
        path:"notifications",
        element:<Notifications />
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
