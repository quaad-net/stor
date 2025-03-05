import "./Lgn.css";
import useToken from "../../app/useToken";
import { useNavigate, useOutletContext} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL; 
import useUser from "../../app/useUser";
import {useEffect } from "react";
import useInstitution from "../../app/useInstitution";

export default function Lgn(){

    const {setToken} = useToken();
    const {user, setUser} = useUser();
    const [currentInstitution, setCurrentInstitution] = useOutletContext();
    const {setInstitution} = useInstitution();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(user != ''){
            navigate("/user",{ 
                state: {
                    authorized: true,
                    email: user,
                }
            })
        }
        else{window.scrollTo(0,0)}

    },[navigate, user])

    function UserLogin(){

        function loginRequest(){

            const email = document.querySelector('#user').value.trim();
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
                    setInstitution(data.institution);
                    setCurrentInstitution(data.institution);
                    navigate("/user",{ 
                        state: {
                            authorized: true,
                            email: data.email,
                        }
                    })
                }
                else{
                    throw new Error()
                }
            }).catch((err)=>{
                alert('Unsuccessful login attempt!')
                console.error(err);
            })
        }
    
        function clearInvalids(){
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input)=>{
                input.style.borderColor = 'gold';
                input.style.borderRightColor = 'grey';
                input.style.borderLeftColor = 'grey';
                input.style.backgroundColor = '#242424';
            })
        }
    
        function showInValids(){
            const inputs = document.querySelectorAll('input');
            inputs.forEach((input)=>{
                if(!input.checkValidity()){
                    input.style.borderColor = 'lightcoral'
                    input.style.backgroundColor = 'rgba(240, 128, 128, 0.071)'; 
                    input.style.borderRightColor = 'grey';
                    input.style.borderLeftColor = 'grey';
                }
                else{
                    input.style.borderColor = 'gold';
                    input.style.borderRightColor = 'grey';
                    input.style.borderLeftColor = 'grey';
                    input.style.backgroundColor = '#242424';
                }
            })
        }
    
        return(
            <div>
                <>--- Login or continue as visitor ---</>
                <br/><br/>
                <form>
                    <fieldset className="login-fieldset">
                        <legend>Login</legend>
                        <div className="header">
                            <div className="user-pass">
                                <input id='user' type='text' title="User" placeholder="User" required />
                                <input id='password' type='password' title="Password" placeholder="Password" required />
                            </div>
                            <div>
                            </div>
                        </div>
                    </fieldset>
                    <br/>
                    <button type="submit" id="login-submit-btn" className="submit-btn" onClick={(e)=>{
                        e.preventDefault();
                        document.querySelector('#login-submit-btn').blur();
                        const form = document.querySelector('form')
                        if(!form.checkValidity()){
                            showInValids();
                            alert('Please fill out all fields.')
                        }
                        else{
                            loginRequest();
                            clearInvalids();
                            document.querySelector('form').reset();
                        }
                        }}>
                        Submit
                    </button>
                    <button type="button" id="login-clear-btn" className="clear-btn" onClick={()=>{
                        document.querySelector('#login-clear-btn').blur();
                        document.querySelector('form').reset();
                        clearInvalids();
                        }}>Clear
                    </button>
                </form>
            </div>
        )
    }

    return(<UserLogin/>)
}