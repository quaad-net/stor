import {useState} from 'react'

const useToken = () => {
    const getToken =() =>{
        const tokenString = sessionStorage.getItem('token');
        try{
        const userToken = JSON.parse(tokenString); 
        return userToken
        }
        catch(err){
          const userToken = {};
          return userToken
      }
    } 

    const [token, setToken] = useState(getToken());
    const saveToken = userToken => {
        sessionStorage.setItem('token', JSON.stringify(userToken));
        setToken(userToken);
      }
      return {
        setToken: saveToken, 
        token
      }
    }

export default useToken