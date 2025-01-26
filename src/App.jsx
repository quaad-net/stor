import { Outlet } from "react-router-dom";
import AppropiateNav from "./components/Navbar";
import "./App.css"

const App = () => {
  return (
    <>
      <AppropiateNav />
      <div className="min-max-content">
        <Outlet />
      </div>
    </>
  );
};
export default App