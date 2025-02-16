import useToken from './useToken';

async function auth(){
    
    const {token} = useToken();
    
    const checkAuth = await fetch('http://localhost:5050/auth-endpoint',
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
    .catch((err)=>{
        return {authorized: false}
    })
    return checkAuth
}

export default auth;