import React, {useState} from 'react'

const useInstitution = () => {

    const getInstitution =() =>{
     
        try{
            const userInstitution = sessionStorage.getItem('institution');
            return userInstitution
        }
        catch(err){
          return ""
      }
    } 

    const [institution, setInstitution] = useState(getInstitution());
    const saveInstitution = userInstitution => {
        sessionStorage.setItem('institution', userInstitution);
        setInstitution(userInstitution);
      }
      return {
        setInstitution: saveInstitution, 
        institution
      }
    }
  
export default useInstitution