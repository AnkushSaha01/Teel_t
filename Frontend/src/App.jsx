import React from 'react'
import Form from './components/Form'
import {createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './layout/AppLayout'
import Feed from './components/Feed'

const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                path: "/create-post",
                element: <Form />
            },
            {
                path: "/feed",
                element: <Feed />
            }
        ]
    }
])

const App = () => {
  return (
    <RouterProvider router={router} />
  )
}

export default App