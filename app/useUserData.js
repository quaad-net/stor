import {useState} from 'react'

const useUserData = () => {

    const getUserData =() =>{
     
        try{
            const userData = localStorage.getItem('userData');
            if(userData === null || userData === undefined){return ''}
            else{return userData}
        }
        catch{
          return ''
        }
    } 

    const [userData, setUserData] = useState(getUserData());
    const saveUserData = userData => {
        localStorage.setItem('userData', userData);
        setUserData(userData);
      }
      return {
        setUserData: saveUserData, 
        userData
      }
    }
  
export default useUserData