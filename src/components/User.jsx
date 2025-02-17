import { useEffect, useState} from "react";
import { useLocation } from "react-router-dom";
import "./User.css";
const apiUrl = import.meta.env.VITE_API_URL;

export default function User(){
    
    const location = useLocation();
    const userEmail = location?.state?.email 
    const [userData, setUserData] = useState({}) 

    async function getUserData(){ 
        fetch(`${apiUrl}/users`, 
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: userEmail  
            })
        }
        )
        .then((res)=>{return res.json()})
        .then((res)=>{
            setUserData(res[0])
        })
        .catch(()=>{console.log('Could not retrieve user info.')});
    }

    useEffect(()=>{
        getUserData();
    }, [])

    return(
        <fieldset className="login-fieldset">
            <legend>Logged-in As</legend>
            <div>
                <div id="auth-user">
                    <span>User: </span>{userData?.firstName} {userData?.lastName}
                </div>
                <div id="auth-institution">
                    <span>Institution: </span>{userData?.institution}
                </div>
                <div id="auth-employee-id">
                    <span>employeeID: </span>{userData?.employeeID}
                </div>
                <div id="auth-email">
                    <span>email: </span>{userData?.email}
                </div>
                <div id="auth-created">
                    <span>createdAt: </span>{userData?.createdAt}
                </div>
            </div>
        </fieldset>
    )
}