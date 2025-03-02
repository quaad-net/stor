import useInstitution from "../../app/useInstitution";
import useToken from "../../app/useToken";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Institution.css"
import auth from "../../app/auth";

export default function ShowInstitution(props){ 

    const {token, setToken} = useToken();
    const navigate = useNavigate();
    
    // Shows user institution if user is not logged-in.
    const {institution, setInstitution} = useInstitution(); // session storage
    const [userInstitution, setUserInstitution] = useState(""); //  component state

    auth().then((res)=>{
        if(res.authorized){  
            setUserInstitution(institution); // component state
        }
        else{
            setUserInstitution(""); //  component state
        }
    })

    function logout(){
      setToken({});
      setInstitution('');
      navigate("/lgn")
    }

    function VistorHtml(){return(<>@<span>VISITOR</span>stor</>)}

    function UserHtml(){return(<>@<span>{userInstitution?.toUpperCase()}</span>stor | <span id="logout" onClick={logout}>logout</span></>)}

    return(
      <>
        {userInstitution == '' ? <VistorHtml/> : <UserHtml/>}
      </>
    )
  }