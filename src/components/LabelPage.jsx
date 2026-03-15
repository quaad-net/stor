import useLabels from "../../app/useLabels";
import { useEffect } from "react";
import './LabelPage.css';

export default function LabelPage(){
    const { setLabels, labels } = useLabels();
    
    useEffect(()=>{
        const parser = new DOMParser();
        if(labels != ''){
            if(labels != 'Error'){
                const doc = parser.parseFromString(labels, 'text/html');
                const table = doc.querySelector('table');
                const styles = doc.querySelector('style');
                document.querySelector('head').appendChild(styles);
                document.querySelector('#append-table').appendChild(table);
                setLabels('');
                const isStandalone = window.matchMedia("(display-mode: standalone)").matches;
                if(isStandalone){alert('Swipe left to exit label screen.')}
                window.print();
            }
            else{
               document.querySelector('#append-table').append(<div>Error</div>); 
               setLabels('');
            }
        }
    })
    return <div style={{backgroundColor: 'white'}} id='append-table'></div>
}