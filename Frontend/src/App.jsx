import React from "react";
import Form from "./pages/Form";
import Home from "./pages/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout";
import Feed from "./pages/Feed";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingLayout from "./layout/LandingLayout";

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
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
