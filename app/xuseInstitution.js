import {useState} from 'react'

const useInstitution = () => {

    const getInstitution =() =>{
     
        try{
            const userInstitution = sessionStorage.getItem('institution');
            if(userInstitution === null || userInstitution === undefined){return ''}
            else{return userInstitution}
        }
        catch{
          return ''
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