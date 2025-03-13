import AppropiateNav from "./components/Navbar";
import ShowInstitution from "./components/Institution";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserData from "../app/useUserData";

import "./App.css"

const App = () => {

  const { userData } = useUserData();
  const [currentUserData, setCurrentUserData] = useState(userData);

  const navigate = useNavigate();
  const location = useLocation()
  
  useEffect(()=>{
    if(location.pathname == '/'){ // If false, route is not valid and will render <ErrorPage/>
    navigate("/lgn")
    }
  },[navigate, location.pathname])

  return (
    <>
      <AppropiateNav currentUserData={currentUserData}/>
      <div className="min-max-content">
        <Outlet context={[currentUserData, setCurrentUserData]}/> 
        <div id="institution-domain">
          <ShowInstitution currentUserData={currentUserData} setCurrentUserData={setCurrentUserData}/>
        </div>
      </div>
    </>
  );
};

export default App