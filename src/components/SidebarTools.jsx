import { useEffect, useState } from "react";
import './SideBarTools.css'
import { replace } from "react-router-dom";

export default function SidebarTools(props){

    const useTools = props.tools.map((tool)=>{
            return (             
                <li key={tool.id} className='sidebar-tool' id={tool?.id} onClick={tool.onclick}>
                    <img src={tool.img} width='25px' style={{marginLeft: '10px'}}/>
                    <i>{tool?.text}</i>
                </li>
            )
    })

    const tabs = props.partInfo.map((part)=>{
        return(
                <button id={`tab-${part.id}`} 
                    className="sidebar-partcode" 
                    key={part.id}
                    {...(props.idx == part.id.replace('added-part-', '') ? 
                        {style: {color: 'white', backgroundColor: 'rgba(77, 72, 95, 0.142)', display: 'block'}} : 
                        {style: {display: 'block'}})
                    }
                    onClick={(e)=>{
                    e.preventDefault()
                    props.updateIdx(part.id.replace('added-part-', ''))
                }}><strong>{part.part}</strong></button>
        )
    })

    return(
        <div className="sidebar-tools" style={{height: props.height, overflowX: 'hidden', overflowY: 'auto', scrollbarWidth:'thin'}}>
            {/* prev: nav */}
            <ul>
                {useTools}
                <div className="tabs">
                    {tabs}
                </div>
            </ul>
        </div>
    )
}