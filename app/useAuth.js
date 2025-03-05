import useToken from './useToken';

function useAuth(){
    
    const {token} = useToken();
    
    const checkAuth = fetch('http://localhost:5050/auth-endpoint',
        {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    )
    .then((res)=>{ 
        if(res.status == 200){return res.json()}
        else{throw new Error()}
    })
    .then((res)=>{
        return {email: res.payload, authorized: true}
    })
    .catch(()=>{
        return {authorized: false}
    })
    return checkAuth
}

export default useAuth;