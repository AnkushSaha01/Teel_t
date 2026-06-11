import React, { useEffect, useContext, useState } from "react";
import Form from "./pages/form/pages/Form";
import axios from "axios";
import { GlobalContext } from "./context/Context";
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
import SinglePostPage from "./pages/feed/pages/SinglePostPage";
import ProtectedRoute from "./layout/ProtectedRoute";
import PublicRoute from "./layout/PublicRoute";
import { registerSW } from 'virtual:pwa-register';


const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicRoute />,
    children: [
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
    ],
  },
  {
    path: "/app",
    element: <ProtectedRoute />,
    children: [
      {
        path: "",
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
            element: <Search />,
          },
          {
            path: "profile",
            element: <Profile />,
          },
          {
            path: "profile/:userId",
            element: <Profile />,
          },
          {
            path: "messages",
            element: <Messages />,
          },
          {
            path: "messages/:id",
            element: <Chat />,
          },
          {
            path: "messages/group/:id",
            element: <GroupChat />,
          },
          {
            path: "post/:id",
            element: <SinglePostPage />,
          },
          {
            path: "notifications",
            element: <Notifications />,
          },
        ],
      },
    ],
  },
]);

const App = () => {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const { updateAccessToken, backURI } = useContext(GlobalContext);

  useEffect(() => {
    // Check if there is a token in the URL query string (from Google OAuth redirect)
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    const urlRefreshToken = params.get("refreshToken");
    if (urlToken) {
      updateAccessToken(urlToken);
      if (urlRefreshToken) {
        localStorage.setItem("refreshToken", urlRefreshToken);
      }
      // Clean up the URL parameters so the token is not visible in the browser address bar
      const cleanUrl = window.location.origin + window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      setIsAuthChecked(true);
    } else {
      // If no token in URL, perform silent refresh on initial mount to restore active session
      const fallbackRefreshToken = localStorage.getItem("refreshToken");
      axios.post(`${backURI}/auth/user/refresh`, {
        refreshToken: fallbackRefreshToken
      }, { withCredentials: true })
        .then((res) => {
          updateAccessToken(res.data.accessToken);
          if (res.data.refreshToken) {
            localStorage.setItem("refreshToken", res.data.refreshToken);
          }
        })
        .catch((err) => {
          console.log("No active session or session expired.");
          const isPublicRoute = ["/login", "/register", "/"].includes(window.location.pathname);
          if (!isPublicRoute) {
            window.location.href = "/login";
          }
        })
        .finally(() => {
          setIsAuthChecked(true);
        });
    }
  }, [updateAccessToken, backURI]);

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

  if (!isAuthChecked) {
    return (
      <div className="w-screen h-screen bg-[#f0efeb] flex flex-col items-center justify-center font-['ClashGrotesk-Variable']">
        <svg className="animate-spin h-10 w-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span className="text-[10px] uppercase tracking-[0.2em] text-black/40 font-semibold">Loading Teel...</span>
      </div>
    );
  }

  return <RouterProvider router={router} />;
};

export default App;
