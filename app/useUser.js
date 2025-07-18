import {useState} from 'react'

const useUser = () => {

    const getUser =() =>{
     
        try{
            const user = localStorage.getItem('user');
            if(user === null || user === undefined){return ''}
            else{return user}
        }
        catch{
          return ''
        }
    }

    const [user, setUser] = useState(getUser());
    const saveUser = user => {
        localStorage.setItem('user', user);
        setUser(user);
      }
      return {
        setUser: saveUser, 
        user
      }
    }
  
export default useUser