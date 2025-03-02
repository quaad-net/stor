import { useEffect, useState } from "react";
import "./labels.css";
import { display } from "@mui/system";
import IconBar from './IconBar'
import './IconBar.css'
const apiUrl = import.meta.env.VITE_API_URL;

export default function Labels() {

    const [partCodeSearch, setPartCodeSearch] = useState(false);
    const [queryRes, setQueryRes] = useState([]);

    const partCodeMaxChar = 30;
    const descriptionMaxChar = 75;
    const binLocationMaxChar = 10;
    const minMaxChar = 6;
    const maxMaxChar = 6;

    const iconBarProps = {
        toggleSearchMode(){
            setPartCodeSearch(!partCodeSearch);
            document.querySelector('#label-search-box').value = '';
        },
        showSyntaxHelpr(){ // Setting QueryRes to original state will show syntaxHelpr by default
            setQueryRes([]);
        },
        clearSearch(){
            document.querySelector('#label-search-box').value = '';
        },
        async printLabels(){

            try{
                
                const req =  await fetch(`${apiUrl}/print/labels`, {
                    method: "POST",
                    body: JSON.stringify(queryRes),
                    partCodeMaxChar: partCodeMaxChar,
                    descriptionMaxChar: descriptionMaxChar,
                    binLocationMaxChar: binLocationMaxChar,
                    minMaxChar: minMaxChar,
                    maxMaxChar: maxMaxChar,
                    headers: {
                        "Content-Type": "application/json",
                    }
                })
                const res = await req.text();
                const newWindow = window.open('', '_blank');
                newWindow.document.open(); 
                newWindow.document.write(res);
                newWindow.print(); 
                newWindow.document.close(); 
            }
            catch(err){console.error(err)}
        }
    }

    function getLabelsByQuery(){
        try{
            const qry = document.querySelector('#label-search-box').value;
            if(partCodeSearch){
                fetch(`${apiUrl}/labels/partcode/${qry}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                    if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
                    else{
                        setQueryRes(res);
                        if(res.length == 0){alert('No match found')};
                    };
                })
                .catch((err)=>{if (err.message=='Invalid syntax'){alert(err.message)}})
            }
            else{ //binLocation search
                
                fetch(`${apiUrl}/labels/${qry}`)
                .then((res)=>{
                    return res.json()
                })
                .then((res)=>{
                    if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
                    else{
                        setQueryRes(res)
                        if(res.length == 0){alert('No match found')};
                    };
                })
                .catch((err)=>{if (err.message=='Invalid syntax'){alert(err.message)}})
            }
        }
        catch(err){console.error(err)}
    }

    function AppropiateLabels(){

        const allLabels = queryRes.map((record)=>{

            const modRecord = {
                partCode: record.partCode.substring(0, partCodeMaxChar),
                description: record.description.substring(0, descriptionMaxChar),
                warehouseBinLocation: record.warehouseBinLocation.substring(0, binLocationMaxChar),
                warehouseMinimum: record.warehouseMinimum === '' ? '?': record.warehouseMinimum.toString().substring(0, minMaxChar),
                warehouseMaximum: record.warehouseMaximum === '' ? '?' : record.warehouseMaximum.toString().substring(0, maxMaxChar),
                active: record.active == 'True' ? ' (A)' : ' (IA)'
            }

            return(
                <td className="label-xl6322727 label-labeldata" key={`${record.partCode}-${record.binLocation}`}>
                    <div className="label-qr-container">
                            <img className="label-qr-image" src="/qr-code-white.svg" style={{width: '50px'}}/>
                    </div>
                    <span className="label-part-details">
                        <div id="label-part-code">{modRecord.partCode}</div>
                        <div id="label-description">{modRecord.description}</div>
                        <div className="label-last-line">
                            <div id="label-bin-location">{modRecord.warehouseBinLocation}&nbsp;&nbsp;</div> 
                            <div id="label-min-max">
                                <span id="label-min"> {modRecord.warehouseMinimum}</span>/
                                <span id="label-max">{modRecord.warehouseMaximum}</span>
                            </div>
                            <span id="label-part-active">&nbsp;&nbsp;{modRecord.active}</span>
                        </div>
                    </span>
                </td>
            )
        })

        function FirstAndLastLabel(){

            const CreateFirstLast =(props)=>{

                const record = props.data;

                return(
                    <td className="label-xl6322727 label-labeldata first-label" key={`${record.partCode}-${record.binLocation}`}>
                        <div className="label-qr-container">
                                <img className="label-qr-image" src="/qr-code-white.svg" style={{width: '50px'}}/>
                        </div>
                        <span className="label-part-details">
                            <div id="label-part-code">{record.partCode.substring(0, partCodeMaxChar)}</div>
                            <div id="label-description">{record.description.substring(0, descriptionMaxChar)}</div>
                            <div className="label-last-line">
                                <div id="label-bin-location">{record.warehouseBinLocation.substring(0, binLocationMaxChar)}&nbsp;&nbsp;</div> 
                                <div id="label-min-max">
                                    <span id="label-min"> {record.warehouseMinimum.toString().substring(0, minMaxChar)}</span>/
                                    <span id="label-max">{record.warehouseMaximum.toString().substring(0, maxMaxChar)}</span>
                                </div>
                                <span id="label-part-active">&nbsp;&nbsp;{record.active == 'True' ? ' (A)' : ' (IA)'}</span>
                            </div>
                        </span>
                    </td>
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
                    <td className="label-xl6322727" id="label-mid" style={{display: 'block', margin: 0}}>
                        <img alt="labels" src="/small-labels.svg" style={{width: '25px',  float: 'left'}}/> 
                        <div className="label-summary">
                            <span>First</span> and <span>Last</span> <br/>
                            of <span>{queryRes.length}</span> labels
                        </div>
                    </td>
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
            <td style={{border: 'none'}}>
                <div>. . .</div>
                <h2>Syntax Guide</h2>
                <ul>
                    <li>Case insensitive.</li>
                    <li>
                        <span className="example">Format</span> &lt;partCode&gt;&nbsp;[&lt;partCode&gt;]<br/> 
                    </li>
                    <li>
                        Only one partCode is required. Multiple partCodes can be entered separated by a space<br/>
                        <span className="example">Qry</span> 22-12345 52-12345
                    </li>
                    <li>Returned records are sorted first by binLocation then by partCode, both ascending.</li>
                    <li>Returns only exact matches on partCode(s).</li>
                </ul>
            </td>
        )
    }

    const BinLocQrySyntaxHelpr = () =>{
        return(
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
                    <li>If colon is not included, this will return all bins starting from
                        the initial location...more than likely you want to use a colon!<br/>
                        <span className="example">Qry</span> 110-A-A<br/>
                        will return all bins starting from 110 through the last possible bin location.
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
            <IconBar {...iconBarProps}/>
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
                        <tr className="map-lables">
                            {queryRes.length>0? <AppropiateLabels/>: <SyntaxHelpr/>}
                        </tr>
                    </tbody>
                </table>
            </div>
            <QueryResCount/>
        </div>
    )
}
