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
      <Outlet context={[currentUserData, setCurrentUserData]}/> 
    </>
  );
};

export default App