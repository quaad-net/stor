import { useNavigate } from "react-router-dom";
import "./Register.css";
const apiUrl = import.meta.env.VITE_API_URL; 

export default function Register(){

    const navigate = useNavigate();

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

    // Check if user already exists.
    async function currentuser(){

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
            if(res.status == 403){
                alert('This user already exists!')
            }
            else{
                registerRequest()
            }
        })
        
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
            alert(data.message);
            document.querySelector('form').reset();
            if(data.message == 'User created'){
                navigate("/lgn",{ 
                })
            }
        }).catch((err)=>{
            console.error(err);
        })
    }

    return(
        <div>
            <h2>Register</h2>
            <br/><br/>
            <form>
                <fieldset className="register-fieldset">
                    <legend>New User</legend>
                    <div className="header">
                        <div className="email-pass">
                            <input id='email' type='email' title="Email" placeholder="Email" required />
                            <input id='password' type='password' title="Password" placeholder="Password" required />
                        </div>
                        <div>
                            <input id="employeeId" type='text' title="Employee ID" placeholder="Employee ID" required/> 
                        </div>
                        <div>
                            <input id="institution" type='text' title="Institution" placeholder="Institution" required/> 
                        </div>
                    </div>
                </fieldset>
                <br/>
                <button type="submit" id="register-submit-btn" className="submit-btn" onClick={(e)=>{
                    e.preventDefault();
                    document.querySelector('#register-submit-btn').blur();
                    const form = document.querySelector('form')
                    if(!form.checkValidity()){
                        showInValids();
                        alert('Please correct fields.');
                    }
                    else{
                        clearInvalids();
                        currentuser();
                    }
                    }}>
                    Submit
                </button>
                <button type="button" id="register-clear-btn" className="clear-btn" onClick={()=>{
                    document.querySelector('#register-clear-btn').blur();
                    document.querySelector('form').reset();
                    clearInvalids();
                    }}>Clear
                </button>
            </form>
        </div>
    )
}