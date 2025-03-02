import useInstitution from "../../app/useInstitution";
import useToken from "../../app/useToken";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Institution.css"
import auth from "../../app/auth";

export default function ShowInstitution(props){ 

    const {token, setToken} = useToken();
    const navigate = useNavigate();
    
    // Shows user institution if user is not logged-in.
    const {institution, setInstitution} = useInstitution(); // session storage
    const [userInstitution, setUserInstitution] = useState(institution); //  component state

    function logout(){
      setToken({});
      setInstitution('');
      navigate("/lgn")
    }

    if(props?.skipAuth !== true){
      auth().then((res)=>{
          if(res.authorized){
              // userInstitution (component state) should match institution (session storage)
          }
          else{
              setInstitution("") // session storage
              setUserInstitution("") //  component state
          }
      })
    }

    if(userInstitution == ''){
      return(<>@<span>VISITOR</span>stor</>)
    }
    else{
      return(
        <>
          @<span>{userInstitution?.toUpperCase()}</span>stor | <span id="logout" onClick={logout}>logout</span>
        </>
      )
    }
  }