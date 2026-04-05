import { memo } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import UserInfoModal from "./UserInfoModal";
import Ops from "./Ops";
import Fiscal from "./Fiscal";
import "./Institution.css"

const ShowInstitution = memo(function ShowInstitution(props){ 

  const navigate = useNavigate();
  const [currentUserData, setCurrentUserData] = useOutletContext();
  const userData = JSON.parse(currentUserData);

  function logout(){
    localStorage.clear();
    navigate("/lgn")
  }

  function VistorHtml(){return(<>@<span><strong>VISITOR</strong></span>stor</>)}

  function UserHtml(){
    
    return(
      <div style={{width: 'fit-content', margin: 'auto'}}>
        <img src='/user-small.svg' width='25px' style={{float: 'left'}}/>
        @<span><strong>{userData.institution.toString() == 'sample' ? 'VISIT' : userData.email.split('@')[0] + " | " + userData.institution.toString().toUpperCase()}</strong></span> |&nbsp;
        <span style={{color: 'gold'}} id="logout" onClick={logout}>Logout</span>
      </div>
    )
  }
    function OutPut(){
      return(
        <>
          <div>
            {currentUserData == '' ? <VistorHtml/> : <UserHtml/>}
          </div>
          {userData.email == 'eukoh@quaad.net' ?
            <>
              <br/>
              <fieldset style={{borderRadius: 1, border: '1px solid gray', borderLeft: 0, borderRight: 0, borderBottom: 0}}>
                <legend style={{color: 'gray', textAlign:'center'}}>
                  App{'</>'}
                </legend><br/>
                <Ops/>
                <br/>
                <Fiscal/>
              </fieldset>
            </>
            :
            <></>
          }
        </>
      )
    }

  return(
    <>
      <UserInfoModal {...(props?.btnDescription ? {btnDescription: props.btnDescription} : {})} modalContent={<OutPut/>} iconSize='25px'/>
    </>
  )
    

  })

  export default ShowInstitution