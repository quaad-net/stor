
// React imports.
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Backend component imports.
import Record from "./components/Record";
import RecordList from "./components/RecordList";

// Frontend component imports.
import App from "./App";
import InventoryPick from "./components/InventoryPick";
import LogIn from "./components/LogIn";
import Problem from "./components/Problem";
import Receive from "./components/Receive";
import Browse from "./components/Browse";
import Update from "./components/Update";

//CSS imports
import "./index.css";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <LogIn />,
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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);