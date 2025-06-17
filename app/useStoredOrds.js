import {useState} from 'react'

const useStoredOrds = () => {

    const getStoredOrds =() =>{
     
        try{
            const storedOrds = sessionStorage.getItem('storedOrds');
            if(storedOrds === null || storedOrds === undefined){return ''}
            else{return storedOrds}
        }
        catch{
          return ''
        }
    } 

    const [storedOrds, setStoredOrds] = useState(getStoredOrds());
    const saveStoredOrds = storedOrds => {
        sessionStorage.setItem('storedOrds', JSON.stringify(storedOrds));
        setStoredOrds(JSON.stringify(storedOrds));
      }
      return {
        setStoredOrds: saveStoredOrds, 
        storedOrds
      }
    }
  
export default useStoredOrds