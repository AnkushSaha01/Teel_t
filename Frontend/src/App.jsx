import React, {useEffect} from "react";
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
import Chat from "./pages/messages/page/Chat";
import GroupChat from "./pages/messages/page/GroupChat";
import { registerSW } from 'virtual:pwa-register';


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
        path: "profile/:userId",
        element: <Profile />
      },
      {
        path:"messages",
        element:<Messages />
      },
      {
        path: "messages/:id",
        element: <Chat />
      },
      {
        path: "messages/group/:id",
        element: <GroupChat />
      },
      {
        path:"notifications",
        element:<Notifications />
      }
    ],
  },
]);

const App = () => {
  useEffect(() => {
    // Registers service worker and updates automatically when new versions are deployed
    const updateSW = registerSW({
      onNeedRefresh() {
        if (confirm("New update available! Would you like to reload?")) {
          updateSW(true);
        }
      },
      onOfflineReady() {
        console.log("Teel is ready to run offline!");
      },
    });
  }, []);
  return <RouterProvider router={router} />;
};

export default App;
