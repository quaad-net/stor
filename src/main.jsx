
// React imports.
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";


// Component imports.
import App from "./App";
import InventoryPick from "./components/InventoryPick";
import Problem from "./components/Problem";
import Receive from "./components/Receive";
import Browse from "./components/Browse";
import Update from "./components/Update";
import Lgn from "./components/Lgn";
import Register from "./components/Register";
import User from "./components/User";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Lgn />,
      },
    ],
  },
  {
    path: "/pick",
    element: <App />,
    children: [
      {
        path: "/pick",
        element: <InventoryPick />,
      },
    ],
  },
  {
    path: "/receive",
    element: <App />,
    children: [
      {
        path: "/receive",
        element: <Receive />,
      },
    ],
  },
  {
    path: "/browse",
    element: <App />,
    children: [
      {
        path: "/browse",
        element: <Browse />,
      },
    ],
  },
  {
    path: "/update",
    element: <App />,
    children: [
      {
        path: "/update",
        element: <Update />,
      },
    ],
  },
  {
    path: "/problem",
    element: <App />,
    children: [
      {
        path: "/problem",
        element: <Problem />,
      },
    ],
  },
  {
    path: "/lgn",
    element: <App />,
    children: [
      {
        path: "/lgn",
        element: <Lgn />,
      },
    ],
  },
  {
    path: "/register",
    element: <App />,
    children: [
      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
  {
  path: "/user",
  element: <App />,
  children: [
    {
      path: "/user",
      element: <User />,
    },
  ],
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);