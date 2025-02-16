import { Outlet } from "react-router-dom";
import AppropiateNav from "./components/Navbar";
import { useState } from "react";
import "./App.css"

const App = () => {

  const myTestData = "hello there, how's your day?"

  return (
    <>
      <AppropiateNav />
      <div className="min-max-content">
        <Outlet/>
      </div>
    </>
  );
};
export default App