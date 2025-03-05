// React and related imports.
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// App component imports.
import App from "./App";
import InventoryPick from "./components/InventoryPick";
import Problem from "./components/Problem";
import Receive from "./components/Receive";
import Browse from "./components/Browse";
import Lgn from "./components/Lgn";
import User from "./components/User";
import Labels from "./components/Labels";
import ErrorPage from "./components/ErrorPage";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/lgn",
        element: <Lgn />,  
      },
      {
        path: "/pick",
        element: <InventoryPick />,
      },
      {
        path: "/receive",
        element: <Receive />,
      },
      {
        path: "/browse",
        element: <Browse />,
      },
      {
        path: "/problem",
        element: <Problem />,
      },
      {
        path: "/user",
        element: <User />,
      },
      {
        path: "/label",
        element: <Labels />,
      },
      {
        path: "/*",
        element: <ErrorPage />,
      }
    ]
  },
])

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <RouterProvider router={router}/>
  </React.StrictMode>
);