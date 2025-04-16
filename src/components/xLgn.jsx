import "./Lgn.css";
import useToken from "../../app/useToken";
import { useNavigate, useOutletContext} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL; 
import useUser from "../../app/useUser";
import {useState } from "react";
import useUserData from "../../app/useUserData";
import useAuth from "../../app/useAuth";
import BasicMessageModal from './BasicMessageModal';

export default function Lgn(){

    const {setToken} = useToken();
    const {user, setUser} = useUser();
    const { setUserData } = useUserData();
    const [currentUserData, setCurrentUserData] = useOutletContext();
    const [authorizedUser, setAuthorizedUser] = useState(true);
    const navigate = useNavigate();
    const [basicMessageOpen, setBasicMessageOpen ] = useState(false);
    const [basicMessageContent, setBasicMessageContent] = useState('');
    
    useAuth().then((res)=>{
        if(!res.authorized){
            setAuthorizedUser(false)
        }
        else{
            navigate("/inventory")
        }
    })   

    function UserLogin(){

        function loginRequest(){

            const email = document.querySelector('#user').value.toLowerCase().trim();
            fetch(`${apiUrl}/login`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password: document.querySelector('#password').value,
                        email: email
                    })
                }
            ).then((res)=>{return res.json()}
            ).then((data)=>{

                if(data?.token !== undefined){

                    setToken(data.token);
                    setUser(data.email);
                    setUserData(data.userData); // updates session storage
                    setCurrentUserData(data.userData); // updates current state
                    navigate("/inventory")
                }
                else{
                    throw new Error()
                }
            }).catch((err)=>{
                console.error(err);
                setBasicMessageContent('Unsuccessful login attempt!')
                setBasicMessageOpen(true);
            })
        }
    
        function clearInvalids(){
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input)=>{
                //
            })
        }
    
        function showInValids(){
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input)=>{
                if(!input.checkValidity()){
                    //
                }
            })
        }

        function Dialog(){
            return(
                <span style={{color: 'white'}}>{basicMessageContent}</span>
            )
        }
    
        return(
            <div style={{height: '100vh', width: '95%', margin: 'auto', color: 'white'}}>
                <h1>&nbsp;</h1>
                <br/><br/>
                <form>
                    <fieldset className="login-fieldset" style={{width: 'fit-content', margin: 'auto'}}>
                        <legend><img src='https://imagedelivery.net/hvBzZjzDepIfNAvBsmlTgA/39d7b9ca-c1ca-4627-d614-e43c07db3a00/public' width='25px'/></legend>
                        <div className="header">
                            <div className="user-pass">
                                <input className="stor-input" id='user' type='text' placeholder="User" required />
                                <input className="stor-input" id='password' type='password' placeholder="Password" required />
                            </div>
                            <div>
                            </div>
                        </div>
                    </fieldset>
                    <br/>
                    <div style={{width: 'fit-content', margin: 'auto'}}>
                        <button 
                            style={{color: 'white'}}
                            type="submit" 
                            id="login-submit-btn" 
                            className="submit-btn" 
                            onClick={(e)=>{
                                e.preventDefault();
                                document.querySelector('#login-submit-btn').blur();
                                const form = document.querySelector('form')
                            if(!form.checkValidity()){
                                showInValids();
                                setBasicMessageContent('Missing field(s)')
                                setBasicMessageOpen(true);
                            }
                            else{
                                loginRequest();
                                clearInvalids();
                                document.querySelector('form').reset();
                            }
                            }}>
                            Submit
                        </button>
                        <button 
                            style={{color: 'white'}} 
                            type="button" 
                            id="login-clear-btn" 
                            className="clear-btn" onClick={()=>{
                            document.querySelector('#login-clear-btn').blur();
                            document.querySelector('form').reset();
                            clearInvalids();
                            }}>Clear
                        </button>
                    </div>
                </form>
                <BasicMessageModal setModalOpen={setBasicMessageOpen} modalOpen={basicMessageOpen} modalContent={<Dialog/>}/>
            </div>
        )
    }
    if(authorizedUser){
        return <></>
    }
    else return(<UserLogin/>)
}