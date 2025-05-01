import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";
import Lgn from "./components/Lgn";
import ErrorPage from "./components/ErrorPage";
import ErrorBoundary from "./components/ErrorBoundary";
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