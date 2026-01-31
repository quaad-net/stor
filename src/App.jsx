import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserData from "../app/useUserData";
import imgMap from "../app/imgMap";

import "./App.css"

const App = () => {

  const { userData } = useUserData();
  const [currentUserData, setCurrentUserData] = useState(userData);
  const navigate = useNavigate();
  const location = useLocation();

  // for (let [key, val] of imgMap){
  //   const img = new Image();
  //   img.src  = val;
  // }

  useEffect(()=>{
    if(location.pathname == '/'){ // If false, route is not valid and will render <ErrorPage/>
      if(userData == ''){navigate("/lgn")}
      else{navigate("/inventory")}   
    }
  },[navigate, location.pathname])

  return (
    <div id="app-hex-background"
    >
      <Outlet context={[currentUserData, setCurrentUserData]}/> 
    </div>
  );
};

export default App