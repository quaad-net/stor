import "./Register.css"

export default function Register(){


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
            <>--- Register ---</>
            <br/><br/>
            <form>
                <fieldset className="register-fieldset">
                    <legend>New User Info</legend>
                    <div className="header">
                        <div className="email-pass">
                            <input id='email' type='email' title="Email" placeholder="Email" required />
                            <input id='password' type='password' title="Password" placeholder="Password" required />
                        </div>
                        <div>
                            <input id="employeeId" type='text' title="Employee ID" placeholder="Employee ID" required/> 
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
                        document.querySelector('form').reset();
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