import {useState} from 'react'

const useLabels = () => { 

    const getLabels =() =>{
     
        try{
            const labels = localStorage.getItem('labels');
            if(labels === null || labels === undefined){return ''}
            else{return labels}
        }
        catch{
          return ''
        }
    } 

    const [labels, setLabels] = useState(getLabels());
    const saveLabels = labels => {
        localStorage.setItem('labels', labels);
        setLabels(labels);
      }
      return {
        setLabels: saveLabels, 
        labels
      }
    }
  
export default useLabels