import {useState} from 'react'

const useEmail = () => {

    const getEmail =() =>{
     
        try{
            const email = sessionStorage.getItem('email');
            return email 
        }
        catch{
          return null
        }
    } 

    const [email, setEmail] = useState(getEmail());
    const saveEmail = email => {
        sessionStorage.setItem('email', email);
        setEmail(email);
      }
      return {
        setEmail: saveEmail, 
        email
      }
    }
  
export default useEmail