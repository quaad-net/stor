import "./Lgn.css";
import useToken from "../../app/useToken";
import { useNavigate, useOutletContext} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL; 
import useUser from "../../app/useUser";
import {useState } from "react";
import useUserData from "../../app/useUserData";
import useAuth from "../../app/useAuth";
import BasicMessageModal from './BasicMessageModal';
import imgMap from "../../app/imgMap";

export default function Lgn(){

    const {setToken} = useToken();
    const {setUser} = useUser();
    const { setUserData } = useUserData();
    const [currentUserData, setCurrentUserData] = useOutletContext();
    const [authorizedUser, setAuthorizedUser] = useState(true);
    const [basicMessageOpen, setBasicMessageOpen ] = useState(false);
    const [basicMessageContent, setBasicMessageContent] = useState('');
    const [lgnType, setLgnType] = useState('Login');
    const navigate = useNavigate();

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

        async function currentuser(){

            try{
            const email =  document.querySelector('#email').value.trim();
            const employeeID = document.querySelector('#employeeId').value.trim();
    
            await fetch(`${apiUrl}/currentuser`, {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: email,
                    employeeID: employeeID
                })
            })
            .then((res)=>{
                console.log(res.status);
                if(res.status == 403){
                    setBasicMessageContent('This user already exists!')
                    setBasicMessageOpen(true);
                }
                else if(res.status == 200){
                    registerRequest()
                }
                else{
                    console.log(res.status);
                    setBasicMessageContent('Could not register user!');
                    setBasicMessageOpen(true);
                }
            })
            }
            catch(err){
                console.log(err);
                setBasicMessageContent('Could not register user!');
                setBasicMessageOpen(true);
            }
            
        }
    
        function registerRequest(){

            const email =  document.querySelector('#email').value.trim();
            const institution = document.querySelector('#institution').value.trim();
            const password = document.querySelector('#password').value;
            const employeeID = document.querySelector('#employeeId').value.trim();
    
            fetch(`${apiUrl}/register`, 
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        password: password,
                        email: email,
                        institution: institution,
                        employeeID: employeeID
                    })
                }
            ).then((res)=>{return res.json()}
            ).then((data)=>{
                setBasicMessageContent(data.message);
                setBasicMessageOpen(true);
                document.querySelector('form').reset();
                if(data.message == 'User created'){
                    setLgnType('Login');
                }
            }).catch((err)=>{
                setBasicMessageContent('Could not register user!');
                setBasicMessageOpen(true);
                console.error(err);
            })
        }

        function Dialog(){
            return(
                <span style={{color: 'white'}}>{basicMessageContent}</span>
            )
        }
    
        return(
            <div id='lgn-main' style={{height: '100vh', width: '95%', margin: 'auto', color: 'white', overflow: 'auto'}}>
                <h1>&nbsp;</h1>
                <br/><br/>
                <form>
                    <fieldset className="login-fieldset" style={{width: 'fit-content', margin: 'auto'}}>
                        <legend><img src={imgMap.get('user-small.svg')} width='25px'/></legend>
                        <div className="header">
                            <div className="user-pass">
                                <input className="stor-input" id={lgnType == 'Login' ? 'user' : 'email'} type={lgnType == 'Login' ? 'text' : 'email'} placeholder={lgnType == 'Login' ? 'User' : 'Email'} required />
                                <input className="stor-input" id='password' type='password' placeholder="Password" required />
                                {lgnType == 'Login' ? <></> :
                                <>
                                    <input className="stor-input" id="employeeId" type='text' title="Employee ID" placeholder="Employee ID" required />
                                    <input className="stor-input" id="institution" type='text' title="Institution" placeholder="Institution" required/>
                                </>
                                }
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
                                setBasicMessageContent('Incorrect or missing field(s)')
                                setBasicMessageOpen(true);
                            }
                            else{
                                if(lgnType == 'Login'){
                                    loginRequest();
                                    document.querySelector('form').reset();
                                }
                                else{currentuser()}
                                clearInvalids();
                            }
                            }}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
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
                            }}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                            Clear
                        </button>
                        {lgnType != 'Register' ?
                        <button 
                            style={{color: 'white'}} 
                            type="button" 
                            id="login-visitor-btn" 
                            className="visitor-btn" onClick={()=>{
                                document.querySelector('#user').value = 'johndoe@quaad.net';
                                document.querySelector('#password').value = 'quaadnet';
                                document.querySelector('#login-submit-btn').click();
                            }}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                            Visitor
                        </button>
                        :
                        <></>
                        }
                        <div style={{width: 'fit-content', margin: 'auto', marginTop: '150px'}}>
                            <button 
                                style={{...(lgnType == 'Register' ? {display: 'none'} : {}), color: 'white', fontSize: 'small ', textAlign: 'center', width: 'fit-content', margin: 'auto'}} 
                                type="button" 
                                id="login-register-btn" 
                                onClick={()=>{
                                    document.querySelector('#login-register-btn').blur();
                                    document.querySelector('form').reset();
                                    setLgnType('Register');
                                }}>
                                <img  style={{display: 'block', margin: 'auto'}} src={lgnType == 'Login' ? imgMap.get('pulsar-register.svg') : imgMap.get('pulsar-login.svg')} width='25px'/>
                                Register
                            </button>
                            <button 
                                style={{...(lgnType == 'Login' ? {display: 'none'} : {}), color: 'white', fontSize: 'small ', textAlign: 'center', width: 'fit-content', margin: 'auto'}} 
                                type="button" 
                                id="login-login-btn" 
                                onClick={()=>{
                                    document.querySelector('#login-login-btn').blur();
                                    document.querySelector('form').reset();
                                    setLgnType('Login');
                                }}>
                                <img  style={{display: 'block', margin: 'auto'}} src={lgnType == 'Login' ? imgMap.get('pulsar-register.svg') : imgMap.get('pulsar-login.svg')} width='25px'/>
                                Log-in
                            </button>
                        </div>
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