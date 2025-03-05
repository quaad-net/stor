import useUser from "../../app/useUser";
import useToken from "../../app/useToken";
import { useNavigate } from "react-router-dom";
import useInstitution from "../../app/useInstitution";
import "./Institution.css"

export default function ShowInstitution(props){ 

    const {setToken} = useToken();
    const {setUser} = useUser();
    const navigate = useNavigate();
    const {setInstitution} = useInstitution();

    function logout(){
      setToken({});
      setUser('')
      setInstitution('')
      props.setCurrentInstitution('');
      navigate("/lgn")
    }

    function VistorHtml(){return(<>@<span>VISITOR</span>stor</>)}

    function UserHtml(){return(<>@<span>{props.currentInstitution?.toUpperCase()}</span>stor | <span id="logout" onClick={logout}>logout</span></>)}

    return(
      <>
        {props.currentInstitution == '' ? <VistorHtml/> : <UserHtml/>}
      </>
    )
  }