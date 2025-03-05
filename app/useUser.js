import {useState} from 'react'

const useUser = () => {

    const getUser =() =>{
     
        try{
            const user = sessionStorage.getItem('user');
            if(user === null || user === undefined){return ''}
            else{return user}
        }
        catch{
          return ''
        }
    }

    const [user, setUser] = useState(getUser());
    const saveUser = user => {
        sessionStorage.setItem('user', user);
        setUser(user);
      }
      return {
        setUser: saveUser, 
        user
      }
    }
  
export default useUser