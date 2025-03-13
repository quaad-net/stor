import useUser from "../../app/useUser";
import useToken from "../../app/useToken";
import { useNavigate } from "react-router-dom";
import useUserData from "../../app/useUserData";
import "./Institution.css"

export default function ShowInstitution(props){ 

    const {setToken} = useToken();
    const {setUser} = useUser();
    const navigate = useNavigate();
    const {setUserData} = useUserData();

    function logout(){
      setToken({});
      setUser('')
      setUserData('');
      props.setCurrentUserData('');
      navigate("/lgn")
    }

    function VistorHtml(){return(<>@<span>VISITOR</span>stor</>)}

    function UserHtml(){

      const userData = JSON.parse(props.currentUserData)
      return(<>@
        <span>{userData.institution.toString().toUpperCase()}</span>stor | <span id="logout" onClick={logout}>logout
        </span></>
      )
    }

    return(
      <>
        {props.currentUserData == '' ? <VistorHtml/> : <UserHtml/>}
      </>
    )
  }