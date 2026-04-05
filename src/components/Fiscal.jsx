import { memo } from "react";

const Fiscal = memo(function Fiscal(){

    return(
      <div 
        id='fiscal-link'
        className="link"
        style={{width: 'fit-content', margin: 'auto'}}
        onClick={()=>{
          document.querySelector('#fiscal-link').style.color = 'gray';
          setTimeout(()=>{
          document.querySelector('#fiscal-link').style.color = 'white';
          const link = document.createElement('a');
          link.href = 'https://fiscal.quaad.net';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          link.click(); 
          },[250])
        }}
      >
        $<strong>Fiscal</strong>
      </div>
    )

})

export default Fiscal