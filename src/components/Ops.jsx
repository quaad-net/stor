import { memo } from "react";

const Ops = memo(function Ops(){

    return(
      <div 
        id='ops-link'
        className="link"
        style={{width: 'fit-content', margin: 'auto'}}
        onClick={()=>{
          document.querySelector('#ops-link').style.color = 'gray';
          setTimeout(()=>{
          document.querySelector('#ops-link').style.color = 'white';
          const link = document.createElement('a');
          link.href = 'https://ops.quaad.net';
          link.target = '_top'
          link.click();
          },[250])
        }}
      >
        &gt;<strong>Ops</strong>
      </div>
    )

})

export default Ops