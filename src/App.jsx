import AppropiateNav from "./components/Navbar";
import ShowInstitution from "./components/Institution";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useInstitution from "../app/useInstitution";

import "./App.css"

const App = () => {

  const {institution} = useInstitution();
  const [currentInstitution, setCurrentInstitution] = useState(institution);
  const navigate = useNavigate();
  const location = useLocation()
  
  useEffect(()=>{
    if(location.pathname == '/'){ // If false, route is not valid and will render <ErrorPage/>
    navigate("/lgn")
    }
  },[navigate, location.pathname])

  return (
    <>
      <AppropiateNav currentInstitution={currentInstitution}/>
      <div className="min-max-content">
        <Outlet context={[currentInstitution, setCurrentInstitution]}/> 
        <div id="institution-domain">
          <ShowInstitution currentInstitution={currentInstitution} setCurrentInstitution={setCurrentInstitution}/>
        </div>
      </div>
    </>
  );
};

export default App