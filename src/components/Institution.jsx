import useUser from "../../app/useUser";
import useToken from "../../app/useToken";
import { useNavigate, useOutletContext } from "react-router-dom";
import useUserData from "../../app/useUserData";
import UserInfoModal from "./UserInfoModal";

import "./Institution.css"

export default function ShowInstitution(props){ 

  const {setToken} = useToken();
  const {setUser} = useUser();
  const navigate = useNavigate();
  const {setUserData} = useUserData();
  const [currentUserData, setCurrentUserData] = useOutletContext();

  function logout(){
    setToken({});
    setUser('')
    setUserData('');
    setCurrentUserData('');
    navigate("/lgn")
  }

  function VistorHtml(){return(<>@<span><strong>VISITOR</strong></span>stor</>)}

  function UserHtml(){
    
    const userData = JSON.parse(currentUserData) 
    return(
      <div style={{width: 'fit-content', margin: 'auto'}}>
        <img src='/user-small.svg' width='25px' style={{float: 'left'}}/>
        @<span><strong>{userData.institution.toString().toUpperCase()}</strong></span>stor |&nbsp;
        <span style={{color: 'gold'}} id="logout" onClick={logout}>Logout</span>
      </div>
    )
  }
    function OutPut(){
      return(
        <>
          {currentUserData == '' ? <VistorHtml/> : <UserHtml/>}
        </>
      )
    }

    return(<UserInfoModal {...(props?.btnDescription ? {btnDescription: props.btnDescription} : {})} modalContent={<OutPut/>} iconSize='25px'/>)
    

  }