import { useNavigate, useOutletContext } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";
import imgMap from "../../app/imgMap";
import "./Institution.css"

export default function ShowInstitution(props){ 

  const navigate = useNavigate();
  const [currentUserData, setCurrentUserData] = useOutletContext();

  function logout(){
    localStorage.clear();
    navigate("/lgn")
  }

  function VistorHtml(){return(<>@<span><strong>VISITOR</strong></span>stor</>)}

  function UserHtml(){
    
    const userData = JSON.parse(currentUserData) 
    return(
      <div style={{width: 'fit-content', margin: 'auto'}}>
        <img src={imgMap.get('user-small.svg')} width='25px' style={{float: 'left'}}/>
        @<span><strong>{userData.institution.toString() == 'sample' ? 'VISIT' : userData.email.split('@')[0] + " | " + userData.institution.toString().toUpperCase()}</strong></span> |&nbsp;
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