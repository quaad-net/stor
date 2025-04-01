// React and related imports.
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Component imports.
import App from "./App";
// import InventoryPick from "./components/InventoryPick";
// import Problem from "./components/Problem";
// import Receive from "./components/Receive";
// import Browse from "./components/Browse";
import Lgn from "./components/Lgn";
// import User from "./components/User";
// import Labels from "./components/Labels";
import ErrorPage from "./components/ErrorPage";
import ErrorBoundary from "./components/ErrorBoundary";
// import Register from "./components/Register";
import Inventory from "./components/Inventory";

import "./index.css";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorBoundary/>,
    children: [
      {
        path: "/lgn",
        element: <Lgn />,  
      },
      // {
      //   path: "/pick",
      //   element: <InventoryPick />,
      // },
      // {
      //   path: "/receive",
      //   element: <Receive />,
      // },
      // {
      //   path: "/browse",
      //   element: <Browse />,
      // },
      // {
      //   path: "/problem",
      //   element: <Problem />,
      // },
      // {
      //   path: "/user",
      //   element: <User />,
      // },
      // {
      //   path: "/label",
      //   element: <Labels />,
      // },
      // {
      //   path: "/register",
      //   element: <Register />,
      // },
      {
        path: "/inventory",
        element: <Inventory />,
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