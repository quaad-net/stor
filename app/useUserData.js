import {useState} from 'react'

const useUserData = () => {

    const getUserData =() =>{
     
        try{
            const userData = sessionStorage.getItem('userData');
            if(userData === null || userData === undefined){return ''}
            else{return userData}
        }
        catch{
          return ''
        }
    } 

    const [userData, setUserData] = useState(getUserData());
    const saveUserData = userData => {
        sessionStorage.setItem('userData', userData);
        setUserData(userData);
      }
      return {
        setUserData: saveUserData, 
        userData
      }
    }
  
export default useUserData