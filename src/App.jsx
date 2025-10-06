import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserData from "../app/useUserData";
import imgMap from "../app/imgMap";

import "./App.css"

const App = () => {

  const { userData } = useUserData();
  const [currentUserData, setCurrentUserData] = useState(userData);

  const navigate = useNavigate();
  const location = useLocation()
  
  useEffect(()=>{
    if(location.pathname == '/'){ // If false, route is not valid and will render <ErrorPage/>
      if(userData == ''){navigate("/lgn")}
      else{navigate("/inventory")}   
    }
  },[navigate, location.pathname])

  return (
    <div
      style={{
        background: `url(${imgMap.get('open-hex-2-dark-gray.svg')}) no-repeat right`,
        backgroundSize: '500px',
        backgroundAttachment: 'fixed',
        width: '100%'
      }}
    >
      <Outlet context={[currentUserData, setCurrentUserData]}/> 
    </div>
  );
};

export default App