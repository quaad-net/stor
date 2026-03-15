import useLabels from "../../app/useLabels";
import { useEffect } from "react";

export default function LabelPage(){
    const { setLabels, labels } = useLabels();
    
    useEffect(()=>{
        const parser = new DOMParser();
        if(labels != ''){
        const doc = parser.parseFromString(labels, 'text/html');
            const table = doc.querySelector('table');
            const styles = doc.querySelector('style');
            document.querySelector('head').appendChild(styles);
            document.querySelector('#append-table').appendChild(table);
            setLabels('');
        }
    },[])
    return <div style={{backgroundColor: 'white'}} id='append-table'></div>
}