import { useEffect, useState } from "react";
import "./Labels.css";
import { display } from "@mui/system";
import IconBar from './IconBar'
import './IconBar.css'
const apiUrl = import.meta.env.VITE_API_URL;
import React from "react";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import useToken from "../../app/useToken";
import ShowInstitution from "./Institution";

export default function Labels() {

    const [partCodeSearch, setPartCodeSearch] = useState(false);
    const [queryRes, setQueryRes] = useState([]);
    const {token} = useToken(); 

    const partCodeMaxChar = 30;
    const descriptionMaxChar = 70;
    const binLocationMaxChar = 10;
    const minMaxChar = 6;
    const maxMaxChar = 6;

    function validateQueryRes(res){

        const modQueryRes = [];

        res.forEach((record)=>{

            // This prevents errors resulting from numeric types in partCode and warehouseBinLocation field.
            let modBinLoc, modPartCode;
            if(typeof record.warehouseBinLocation == 'number'){ 
                modBinLoc = `_${record.warehouseBinLocation}`
            }
            else{modBinLoc = record.warehouseBinLocation};
            if(typeof record.partCode == 'number'){ 
                modPartCode = `_${record.partCode}`
            }
            else{modPartCode = record.partCode};

            const modRecord = {
                partCode: modPartCode?.substring(0, partCodeMaxChar),
                description: record.description?.substring(0, descriptionMaxChar),
                warehouseBinLocation: modBinLoc?.substring(0, binLocationMaxChar),
                warehouseMinimum: record.warehouseMinimum === '' ? '?': record.warehouseMinimum.toString()?.substring(0, minMaxChar),
                warehouseMaximum: record.warehouseMaximum === '' ? '?' : record.warehouseMaximum.toString()?.substring(0, maxMaxChar),
                active: record.active == 'True' ? ' (A)' : ' (IA)',
            }

            modQueryRes.push(modRecord)
        })

        setQueryRes(modQueryRes)
    }

    const icons = [

        {     
            id:'label-toggle-search-mode-icon',    
            styleBackground: 'url("/search-mode-2.svg") no-repeat center',
            title: 'Toggle Search Mode',
            onclick(){
                setPartCodeSearch(!partCodeSearch);
                document.querySelector('#label-search-box').value = '';
            }
        },
        {
            id: 'label-syntax-helpr-icon',
            styleBackground: 'url("/question-mark.svg") no-repeat center',
            title: 'Show Syntax Guide',
            onclick(){ // Setting QueryRes to original state will show syntaxHelpr by default
                setQueryRes([]);
            }
        },
        {
            id: 'label-clear-search-icon',
            styleBackground: 'url("/wiper.svg") no-repeat center',
            title: 'Clear Search Input',
            onclick(){
                document.querySelector('#label-search-box').value = '';
            }
        },
        {
            id: 'label-print-labels-icon',
            styleBackground: 'url("/label-printer-3.svg") no-repeat center',
            title: 'Print Labels',
            async onclick(){

                try{
                    
                    const req =  await fetch(`${apiUrl}/print/labels`, {
                        method: "POST",
                        body: JSON.stringify(queryRes),
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    })
                    const res = await req.text();
    
                    const parser = new DOMParser()
                    const plainLabels = parser.parseFromString(res, 'text/html');
                    const labelData  = plainLabels.querySelectorAll('.label-labeldata');
    
                    // Add QRCode to Each Label
                    labelData.forEach((label)=>{ 
                        const partCode = label.querySelector('#label-part-code');
                        ReactDOM.render(<QRCode value={partCode.textContent} size={50} />, label.querySelector('.qr'));
                    });
    
                    // Open new window for labels doc.
                    const plainLabelsTxt = plainLabels.querySelector('html').innerHTML;
                    const newWindow = window.open('', '_blank');
                    newWindow.document.open(); 
                    newWindow.document.write(plainLabelsTxt); 
                    newWindow.print(); 
                    newWindow.document.close(); 
                }
                catch(err){alert('!')}
            }
        }
    ]

    function getLabelsByQuery(){
        try{
            const qry = document.querySelector('#label-search-box').value;
            if(partCodeSearch){
                fetch(`${apiUrl}/labels/partcode/${qry}`, 
                    {
                        method: 'POST', 
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((res)=>{
                    if(res.status == 401){throw new Error('Unauthorized user')}
                    else if(res.status == 404){throw new Error('Cannot run query')}
                    else if(res.status == 400){throw new Error('Invalid syntax')}
                    else{
                        return res.json()
                    }
                })
                .then((res)=>{
                    if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
                    else{
                        if(res.length == 0){
                            alert('No match found');
                        }else{validateQueryRes(res)}
                    };
                })
                .catch((err)=>{
                    if (err.message=='Invalid syntax'){alert(err.message)}
                    else if(err.message == 'Unauthorized user'){alert(err.message)}
                    else if(err.message == 'Cannot run query'){alert(err.message)}
                    else{alert('Something went wrong!')}
                })

            }
            else{ //binLocation search
                
                fetch(`${apiUrl}/labels/${qry}`,
                    {
                        method: 'POST', 
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        }
                    }
                )
                .then((res)=>{
                    if(res.status == 401){throw new Error('Unauthorized user')}
                    else if(res.status == 404){throw new Error('Cannot run query')}
                    else if(res.status == 400){throw new Error('Invalid syntax')}
                    else{
                        return res.json()
                    }
                })
                .then((res)=>{
                    if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
                    else{
                        if(res.length == 0){
                            alert('No match found');
                        }else{validateQueryRes(res)}
                    };
                })
                .catch((err)=>{
                    if (err.message=='Invalid syntax'){alert(err.message)}
                    else if(err.message == 'Unauthorized user'){alert(err.message)}
                    else if(err.message == 'Cannot run query'){alert(err.message)}
                    else{alert('Something went wrong!')}
                })
            }
        }
        catch(err){console.log(err)}
    }

    function AppropiateLabels(){

        const allLabels = queryRes.map((record)=>{

            return(
                <tr key={`${record.partCode}-${record.binLocation}`}>
                    <td className="label-xl6322727 label-labeldata">
                        <div className="label-qr-container">
                                <img className="label-qr-image" src="/qr-code-white.svg" style={{width: '50px'}}/>
                        </div>
                        <span className="label-part-details">
                            <div id="label-part-code">{record.partCode}</div>
                            <div id="label-description">{record.description}</div>
                            <div className="label-last-line">
                                <div id="label-bin-location">{record.warehouseBinLocation}&nbsp;&nbsp;</div> 
                                <div id="label-min-max">
                                    <span id="label-min"> {record.warehouseMinimum}</span>/
                                    <span id="label-max">{record.warehouseMaximum}</span>
                                </div>
                                <span id="label-part-active">&nbsp;&nbsp;{record.active}</span>
                            </div>
                        </span>
                    </td>
                </tr>
            )
        })

        function FirstAndLastLabel(){

            const CreateFirstLast =(props)=>{

                const record = props.data;

                return(
                    <tr key={`${record.partCode}-${record.binLocation}`}>
                        <td className="label-xl6322727 label-labeldata first-label">
                            <div className="label-qr-container">
                                    <img className="label-qr-image" src="/qr-code-white.svg" style={{width: '50px'}}/>
                            </div>
                            <span className="label-part-details">
                                <div id="label-part-code">{record.partCode}</div>
                                <div id="label-description">{record.description}</div>
                                <div className="label-last-line">
                                    <div id="label-bin-location">{record.warehouseBinLocation}&nbsp;&nbsp;</div> 
                                    <div id="label-min-max">
                                        <span id="label-min"> {record.warehouseMinimum}</span>/
                                        <span id="label-max">{record.warehouseMaximum}</span>
                                    </div>
                                    <span id="label-part-active">&nbsp;&nbsp;{record.active}</span>
                                </div>
                            </span>
                        </td>
                    </tr>
                )
            }

            const FirstLabel =()=>{
                const data = queryRes[0];
                return(
                    <CreateFirstLast data={data}/>
                )
            }

            const LastLabel =()=>{
                const data = queryRes[queryRes.length-1];
                return(
                    <CreateFirstLast data={data}/>
                )
            }

            return(
                <>
                    <FirstLabel/>
                    <tr>
                        <td className="label-xl6322727" id="label-mid" style={{display: 'block', margin: 0}}>
                            <img alt="labels" src="/small-labels.svg" style={{width: '25px',  float: 'left'}}/> 
                            <div className="label-summary">
                                <span>First</span> and <span>Last</span> <br/>
                                of <span>{queryRes.length}</span> labels
                            </div>
                        </td>
                    </tr>
                    <LastLabel/>
                </>
            )
        }

        if(queryRes.length>30){
            return(<FirstAndLastLabel/>)
        }
        else{return(<>{allLabels}</>)}
    }

    const PartCodeQrySyntaxHelpr = () =>{
        return(
            <tr>
                <td style={{border: 'none'}}>
                    <div>. . .</div>
                    <h2>Syntax Guide</h2>
                    <ul>
                        <li>Case insensitive.</li>
                        <li>
                            <span className="example">Format</span> &lt;partCode&gt;&nbsp;[&lt;partCode&gt;]<br/> 
                        </li>
                        <li>
                            Only one partCode is required. Multiple partCodes can be entered separated by a space...<br/>
                            <span className="example">Qry</span> 22-12345 52-12345
                        </li>
                        <li>Returned records are sorted first by binLocation then by partCode, both ascending.</li>
                        <li>
                            Returns any parts that start with &lt;query&gt; followed by any number of characters.<br/>
                            <span className="example">Qry </span>71-12345<br/>
                            will return 71-12345X, 71-12345S, 71-12345ABC, etc.
                        </li>
                    </ul>
                </td>
            </tr>
        )
    }

    const BinLocQrySyntaxHelpr = () =>{
        return(
            <tr>
                <td style={{border: 'none'}}>
                    <div>. . .</div>
                    <h2>Syntax Guide</h2>
                    <ul>
                        <li>Case insensitive.</li>
                        <li><span className="example">Format</span> &lt;binLocation&gt;:&lt;binLocation&gt;</li>
                        <li>Returned records are sorted first by binLocation then by partCode, both ascending.</li>
                        <li>
                            <span className="example">Qry</span> 110-A-A:110-B-B<br/>
                            will return the entire 110-A section through and including 110-B-B.
                        </li>
                        <li>
                            &ACTIVE filters out inactive bins...<br/>
                            <span className="example">Qry</span> 110-A-A:110-B &ACTIVE
                        </li>
                        <li>
                            If a colon is not included, this will return only the parts that have an 
                            exact match for the binLocation entered<br/>
                            <span className="example">Qry</span> 110-A-A<br/>
                            will only return the parts located at 110-A-A
                        </li>
                        <li>
                            Syntax can be as specific or inexact as needed.<br/>
                            <span className="example">Qry</span> 110:113-F-D<br/>
                            will return everything from 110 to and including 113-F-D.
                        </li>
                        <li>
                            A less specific binLocation string is evaluated as being "less than" a more specific binLocation string.
                            So, 110-F-F is greater that 110-F. Therefore<br/>
                            <span className="example">Qry</span> 109:110-F<br/>
                            will return parts up to and including the entire 110-E section and will not include any bins at 110-F-?
                            unless there is a part who's location is exactly "110-F'.
                        </li>
                    </ul>
                </td>
            </tr>
        )
    }

    const SyntaxHelpr = () =>{
            if(partCodeSearch){
            return(<PartCodeQrySyntaxHelpr/>)
            }
            else{return(<BinLocQrySyntaxHelpr/>)}
    }

    const QueryResCount = ()=>{
        if(queryRes.length > 0){
            return(
                <>
                    <div id="label-returned-results">Returned {queryRes.length} result{queryRes.length> 1? 's':''} </div>
                </>
            )
        }
        else{return(<></>)}
    }

    const Preview = ()=>{
        return(<>&lt;<i>Preview</i>&gt;</>)
    }

    return(
        <div>
            <input title='Query' id='label-search-box' type="search" 
            onKeyDown={(e)=>{
                            if(e.key == 'Enter'){
                                const searchBox = document.querySelector('#label-search-box');
                                if(searchBox.value !== ""){
                                    getLabelsByQuery();
                                }
                            }
            }}
            />
            <div>
            <div id="label-query-type" style={{display: 'inline'}}>{partCodeSearch ? 'P' : 'B'}
            </div>
            <IconBar icons={icons}/>
            </div>
            <div id="label-roll">
                <div id="label-preview">{queryRes.length>0 ? <Preview/> : ''}</div>
                <table className="label-table" align="center">
                    <thead>
                        <tr><th scope="column" className="xl6322727"></th></tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="xl6322727 label-null"></td>
                        </tr>
                        {queryRes.length>0? <AppropiateLabels/>: <SyntaxHelpr/>}
                    </tbody>
                </table>
            </div>
            <QueryResCount/>
            <div id="institution-domain"><ShowInstitution/></div>
        </div>
    )
}
