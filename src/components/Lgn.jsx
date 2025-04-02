import "./Lgn.css";
import useToken from "../../app/useToken";
import { useNavigate, useOutletContext} from "react-router-dom";
const apiUrl = import.meta.env.VITE_API_URL; 
import useUser from "../../app/useUser";
import {useEffect } from "react";
import useUserData from "../../app/useUserData";

export default function Lgn(){

    const {setToken} = useToken();
    const {user, setUser} = useUser();
    const { setUserData } = useUserData();
    const [currentUserData, setCurrentUserData] = useOutletContext();
    const navigate = useNavigate();
    
    useEffect(()=>{
        if(user != ''){
            navigate("/inventory",{ 
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
    
        return(
            <div style={{height: '100vh', width: '95%', margin: 'auto'}}>
                <h2>Login</h2>
                <br/><br/>
                <form>
                    <fieldset className="login-fieldset">
                        <legend><img src='/user-small.svg' width='25px'/></legend>
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
                                alert('Please correct field(s).')
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
            </div>
        )
    }

    return(<UserLogin/>)
}