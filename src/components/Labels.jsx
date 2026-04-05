import { IconButton } from "@mui/material";
import BasicMessageModal from './BasicMessageModal';
import useToken from "../../app/useToken";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import {memo, useEffect, useState } from "react";
import PrintNewLabelModal from './PrintNewLabelModal';
import PrintJobs from "./PrintJobs";
import { toPng } from "html-to-image";
import { useCallback, useRef } from "react";
import JSZip from 'jszip';
// import { saveAs } from 'file-saver';
import useLabels from "../../app/useLabels";
const apiUrl = import.meta.env.VITE_API_URL;
import './Labels.css';

// Note: width and height properties are in pixels and are used for creating image files of labels.
const itemLabelTypes = {

    reg: {
        fontSize: '11pt', 
        qrSize: 50,
        nativeQrSize: 50,
        dataSource: 'all',
        width: 384,
        height: 96
    },
    reg16pt: {
        fontSize: '16pt', 
        qrSize: 75,
        nativeQrSize: 50,
        dataSource: 'all',
        width: 384,
        height: 96
    },
    large: {
        fontSize: '30pt',
        qrSize: 100,
        nativeQrSize: 75,
        dataSource: 'all', //Template will exclude min/max for large labels.
        width: 384,
        height: 192
    },
    // Single data label.
    itemCodeQR:{
        fontSize: 'mono', 
        qrSize: 75,
        nativeQrSize: 75,
        dataSource: 'code',
        width: 384,
        height: 96
    },
    oneByThree: {
        fontSize: '11pt-1x3', 
        qrSize: 37,
        nativeQrSize: 37,
        dataSource: 'all',
        width: 288,
        height: 96
    },
}

const maxChars = {
    reg: {
        codeMaxChar : 30,
        descriptionMaxChar: 170,
        binLocMaxChar: 20,
        minMaxChar: 6,
        maxMaxChar: 6,
    },
    reg16pt:{
        codeMaxChar : 10,
        descriptionMaxChar: 65,
        binLocMaxChar: 12,
        minMaxChar: 3,
        maxMaxChar: 3,
    },
    large: {
        codeMaxChar : 10,
        descriptionMaxChar: 40,
        binLocMaxChar: 12,
        minMaxChar: 6,
        maxMaxChar: 6,
    },
    itemCodeQR: {
        codeMaxChar : 20,
        descriptionMaxChar: 0,
        binLocMaxChar: 0,
        minMaxChar: 0,
        maxMaxChar: 0,
    },
    oneByThree: {
        codeMaxChar : 22,
        descriptionMaxChar: 80,
        binLocMaxChar: 15,
        minMaxChar: 4,
        maxMaxChar: 4,
    },

}

const features = "resizable=true,scrollbars=true,toolbar=true,menubar=true,status=true"

const Labels = memo(function Labels(props){
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const { token } = useToken();
    const [itemLabelType, setItemLabelType] = useState('reg');
    const [readyToPrint, setReadyToPrint] = useState(false);
    const [nativePrint, setNativePrint] = useState(false);
    const [printParts, setPrintParts] = useState(false);
    const imgRef = useRef(<td></td>);
    const { setLabels } = useLabels();
    
    useEffect(()=>{
        return ()=>{setReadyToPrint(false); setPrintParts(false)}
    }, [modalOpen])

    function PrintType(){

        async function printLabels(labelDetails, includePagResults){
            try{
                let recs; 
                if(!labelDetails){
                    if(includePagResults){recs = validateQueryRes(includePagResults)}
                    else{recs = validateQueryRes()}
                }
                const req =  await fetch(`${apiUrl}/print/labels`, {
                    method: "POST",
                    // labelDetails: array of optional label objects. recs: array of query results.
                    body: JSON.stringify([labelDetails? [labelDetails] : recs, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource, nativePrint]),
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
                    const qrData = label.querySelector('#label-qr-data'); // Resolves to this if partCode is undefined.
                    ReactDOM.render(
                        <QRCode 
                            value={partCode?.textContent || qrData.textContent} 
                            size={nativePrint ? itemLabelTypes[itemLabelType].nativeQrSize : itemLabelTypes[itemLabelType].qrSize} 
                        />, 
                        label.querySelector('.qr'));
                });
                if(!nativePrint){
                    return plainLabels.querySelector('html').innerHTML
                }
                else{
                    return labelData
                }
            }
            catch(err){
                console.log(err);
                if(!nativePrint){
                    alert("Could not complete request! Check your settings to make sure pop-ups are allowed for this site.")
                }
                else{alert("Could not complete request!")}
            }
        }

        const handleNativePrint = useCallback(async({nodes}) =>{
            
            if (imgRef.current === null) {
                return
            }
            try{
                if(!nodes || nodes.length == 0){throw new Error()}
                const zip = new JSZip();
                nodes.forEach(async(node, idx)=>{
                    const appendedNode = document.querySelector('#img-ref').appendChild(node);
                    await toPng(appendedNode, 
                        { 
                            cacheBust: true, 
                            width: itemLabelTypes[itemLabelType].width, 
                            height: itemLabelTypes[itemLabelType].height, 
                            quality: 1, 
                            backgroundColor: 'white',
                        }
                    )
                    .then((dataUrl)=>{
                        if(nodes.length == 1){
                            const link = document.createElement('a');
                            link.download = 'Stor-lbl.png';
                            link.href = dataUrl;
                            link.click();
                            document.querySelector('#img-ref').removeChild(node); 
                        }
                        else{return dataUrl}
                    })
                    .then(async(res)=>{
                        if(nodes.length == 1){return}
                        const b64 = res.split(',')[1]
                        zip.file(`label-${idx}.png`, b64, {base64: true});
                        if(idx == nodes.length -1){
                            const content = await zip.generateAsync({type: 'blob'});

                            // The following can be substituted
                            // with alt download method below reader.addEventListener().
                            const link = document.createElement('a');
                            link.download = 'Stor-labels.zip';
                            const reader = new FileReader();
                            reader.readAsDataURL(content);
                            reader.addEventListener('loadend', async()=>{
                                link.href = reader.result;
                                link.click();
                                const imgRefEl = document.querySelector('#img-ref');
                                while(imgRefEl.firstChild){
                                    imgRefEl.removeChild(imgRefEl.firstChild);
                                };
                            })

                            // Alternative download method.
                            // saveAs(content, 'Stor-labels.zip')
                        }
                    })

                })
            }
            catch(err){
                console.log(err)
            }
        }, [imgRef])

        async function printLocLabels(){
            try{

                const req =  await fetch(`${apiUrl}/print/locLabels`, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({parts: props?.pagListItems.length > 0 ? props.pagListItems : props.queryRes, ...(nativePrint ? {native: true} : {}) })
                })
                if(req.status !== 200){
                    const error = await req.json();
                    throw new Error(error.message);
                }
                else{
                    const res = await req.text();
                    const parser = new DOMParser()
                    const plainLabels = parser.parseFromString(res, 'text/html');
                    const labelData  = plainLabels.querySelectorAll('.label-labeldata');
                    
                    // Add QRCode to Each Label
                    labelData.forEach((label)=>{ 
                        const qrData = label.querySelector('#label-qr-data');
                        ReactDOM.render(<QRCode value={qrData.textContent} size={75} />, label.querySelector('.qr'));
                    });
                    if(!nativePrint){
                        return plainLabels.querySelector('html').innerHTML
                    }
                    else{
                        return labelData
                    }
                }
            }
            catch(err){
                if(err.message == 'No root locations found.'){alert(err.message)}
                else if(!nativePrint){
                    alert("Could not complete request! Check your settings to make sure pop-ups are allowed for this site.")
                }
                else{alert("Could not complete request!")}
            }
        }


        async function printPrintJobs(parts){
            try{
                const modParts = []
                parts.forEach((record)=>{
                // Prevents errors resulting from numeric types in code and binLoc field and
                // distinguishes loc from min/max.
                    let modBinLoc, modCode;
                    if(typeof record.binLoc == 'number'){ 
                        modBinLoc = `_${record.binLoc}`
                    }
                    else{modBinLoc = record.binLoc};
                    if(typeof record.code == 'number'){ 
                        modCode = `_${record.code}`
                    }
                    else{modCode = record.code};
        
                    const modRecord = {
                        code: modCode?.substring(0, maxChars[itemLabelType].codeMaxChar),
                        description: record.description?.length > maxChars[itemLabelType].descriptionMaxChar ? record.description?.substring(0, maxChars[itemLabelType].descriptionMaxChar).trim() + '...' : 
                            record.description,
                        binLoc: modBinLoc?.substring(0, maxChars[itemLabelType].binLocMaxChar),
                        min: record.min === '' ? '- ': record.min.toString()?.substring(0, maxChars[itemLabelType].minMaxChar),
                        max: record.max === '' ? '-' : record.max.toString()?.substring(0, maxChars[itemLabelType].maxMaxChar),
                    }
                    modParts.push(modRecord)
                })

                const req =  await fetch(`${apiUrl}/print/labels`, {
                    method: "POST",
                    body: JSON.stringify([modParts, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource, nativePrint]),
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
                    const qrData = label.querySelector('#label-qr-data');
                    ReactDOM.render(
                        <QRCode 
                            value={partCode?.textContent || qrData.textContent} 
                            size={nativePrint ? itemLabelTypes[itemLabelType].nativeQrSize : itemLabelTypes[itemLabelType].qrSize} 
                        />, label.querySelector('.qr'));
                });
                
                if(!nativePrint){
                    return plainLabels.querySelector('html').innerHTML
                }
                else{
                    return labelData
                }
            }
            catch(err){
                console.log(err);
                if(!nativePrint){
                    alert("Could not complete request! Check your settings to make sure pop-ups are allowed for this site.")
                }
                else{alert("Could not complete request!")}
            }
        }

        function validateQueryRes(includePagResults){
            let recs;
            const modQueryRes = [];
            if(includePagResults){recs = props.pagListItems}
            else{recs = props.queryRes}
            recs.forEach((record)=>{
                // Prevents errors resulting from numeric types in code and binLoc field and
                // distinguishes loc from min/max.
                let modBinLoc, modCode;
                if(typeof record.binLoc == 'number'){ 
                    modBinLoc = `_${record.binLoc}`
                }
                else{modBinLoc = record.binLoc};
                if(typeof record.code == 'number'){ 
                    modCode = `_${record.code}`
                }
                else{modCode = record.code};

                const modRecord = {
                    code: modCode?.substring(0, maxChars[itemLabelType].codeMaxChar),
                    description: record.description?.length > maxChars[itemLabelType].descriptionMaxChar ? record.description?.substring(0, maxChars[itemLabelType].descriptionMaxChar).trim() + '...' : 
                        record.description,
                    binLoc: modBinLoc?.substring(0, maxChars[itemLabelType].binLocMaxChar),
                    min: record.min === '' ? '-': record.min.toString()?.substring(0, maxChars[itemLabelType].minMaxChar),
                    max: record.max === '' ? '-' : record.max.toString()?.substring(0, maxChars[itemLabelType].maxMaxChar),
                }
                modQueryRes.push(modRecord)
            })
            return modQueryRes
        }

        return(
            <>
                {printParts || readyToPrint?
                    <>
                        <div style={{width: 'fit-content', margin: 'auto'}}>
                            {readyToPrint ?
                            <>
                                {props?.pagListItems.length > 0 ?
                                <>
                                    <div> 
                                        <IconButton disableRipple onClick={async()=>{
                                            setModalOpen(false);
                                            if(!nativePrint){
                                                // Alt New Label Page
                                                // const newWindow = window.open('', '_blank', features);
                                                // await printLabels(undefined, true).then((labels)=>{
                                                //     newWindow.document.open(); 
                                                //     newWindow.document.write(labels || 'Error'); 
                                                //     newWindow.document.close(); 
                                                // })
                                                const link = document.createElement('a');
                                                await printLabels(undefined, true).then((labels)=>{
                                                    setLabels(labels.toString() || 'Error')
                                                })
                                                link.href = './labels';
                                                link.click();
                                            }
                                            else{
                                                await printLabels(undefined, true).then((nodes)=>{
                                                    handleNativePrint({nodes: nodes})
                                                })
                                            }
                                            setReadyToPrint(false);
                                        }}><span className="modal-options" style={{fontSize: '15px'}}>
                                                ¤&nbsp;Results
                                                {nativePrint ?
                                                    <> 
                                                        <br/>
                                                        <div 
                                                            style={{color: 'gray', fontWeight: 'normal', borderBottom: '1px dotted white', borderRadius: 3, width: 'fit-content', marginLeft: 0}}>
                                                                {props?.pagListItems.length} files 
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                                }
                                            </span>
                                        </IconButton>
                                    </div>
                                    <br/>
                                </>
                                :
                                    <></>
                                }
                                <div>
                                    <IconButton disableRipple onClick={async()=>{
                                        setModalOpen(false);
                                        if(!nativePrint){
                                            // Alt New Label Page
                                            // const newWindow = window.open('', '_blank', features);
                                            // await printLabels().then((labels)=>{
                                            //     newWindow.document.open(); 
                                            //     newWindow.document.write(labels || 'Error'); 
                                            //     newWindow.document.close(); 
                                            // })
                                            const link = document.createElement('a');
                                            await printLabels().then((labels)=>{
                                                setLabels(labels.toString() || 'Error')
                                            })
                                            link.href = './labels';
                                            link.click();
                                        }
                                        else{
                                            await printLabels().then((nodes)=>{
                                                handleNativePrint({nodes: nodes})
                                            })
                                        }
                                        setReadyToPrint(false);
                                    }}><span className="modal-options" style={{fontSize: '15px'}}>
                                            {props?.pagListItems.length > 0 ? <>¤&nbsp;Page</> : <>¤&nbsp;Results</>}
                                                {nativePrint ?
                                                    <>
                                                        <br/>
                                                        <div 
                                                            style={{color: 'gray', fontWeight: 'normal', borderBottom: '1px dotted white', borderRadius: 3, width: 'fit-content', marginLeft: 0}}>
                                                            {props?.queryRes.length} {props?.queryRes.length == 1 ? 'file' : 'files'} 
                                                        </div>
                                                    </>
                                                    :
                                                    <></>
                                                }
                                        </span>
                                    </IconButton>
                                </div>
                                <br/>
                                <div>
                                    <IconButton disableRipple onClick={()=>{
                                        setModalOpen(false);
                                        setFormModalOpen(true);
                                        setReadyToPrint(false);
                                        }}>
                                        <span className="modal-options" style={{fontSize: '15px'}}>
                                            ¤&nbsp;New
                                        </span>
                                    </IconButton>
                                </div>
                                <br/>
                                <div>
                                    <PrintJobs printPrintJobs={printPrintJobs} nativePrint={nativePrint} handleNativePrint={handleNativePrint}/>
                                </div>
                                <br/>
                            </>
                            :
                            <>
                                {/* Not in use. */}
                                {/* {!nativePrint ?
                                <>
                                    <IconButton disableRipple onClick={()=>{
                                        setItemLabelType('reg'); setReadyToPrint(true);
                                        }}>
                                        <span className="modal-options" style={{fontSize: '15px'}}>
                                            1x4<span style={{color:'whitesmoke'}}>|11pt</span>
                                        </span>
                                    </IconButton><br/><br/>
                                </>
                                :
                                <></>
                                } */}
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('reg16pt'); setReadyToPrint(true);
                                    }}>
                                    <span className="modal-options" style={{fontSize: '15px'}}>
                                        1x4<span style={{color:'whitesmoke'}}>|data</span>
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('large'); setReadyToPrint(true);
                                    }}>
                                    <span className="modal-options" style={{fontSize: '15px'}}>
                                        2x4<span style={{color:'whitesmoke'}}>|data</span>
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('itemCodeQR'); setReadyToPrint(true);
                                    }}>
                                    <span className="modal-options" style={{fontSize: '15px'}}>
                                        1x4<span style={{color:'whitesmoke'}}>|code</span>
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{ 
                                    setItemLabelType('oneByThree'); setReadyToPrint(true);
                                    }}>
                                    <span className="modal-options" style={{fontSize: '15px'}}>
                                        1x3<span style={{color:'whitesmoke'}}>|data</span>
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={async()=>{
                                    if(nativePrint){
                                        await printLocLabels().then((nodes)=>{
                                            handleNativePrint({nodes: nodes})
                                        })
                                    }
                                    else{
                                        // Alt New Label Page
                                        // const newWindow = window.open('', '_blank', features);
                                        // await printLocLabels().then((labels)=>{
                                        //     newWindow.document.open(); 
                                        //     newWindow.document.write(labels || 'Error'); 
                                        //     newWindow.document.close(); 
                                        // })
                                        
                                        const link = document.createElement('a');
                                        await printLocLabels().then((labels)=>{
                                            setLabels(labels.toString() || 'Error')
                                        })
                                        link.href = './labels';
                                        link.click();
                                    }
                                }}>
                                    <span className="modal-options" style={{fontSize: '15px'}}>
                                        1x4<span style={{color:'whitesmoke'}}>|locs</span>
                                    </span>
                                </IconButton><br/><br/>
                            </>
                            }
                        </div>
                    </>
                    :
                    <>
                        <div style={{width: 'fit-content', margin: 'auto'}}>
                            <div>
                                <IconButton disableRipple onClick={()=>{
                                    setNativePrint(true);
                                    setPrintParts(true); 
                                }}>
                                    <img src='/pulsar-image.svg' width={25} decoding="sync"/>
                                    <span style={{fontSize: 20}}>img/png</span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setNativePrint(false);
                                    setPrintParts(true);
                                }}>
                                    <img src='/pulsar-globe.svg' width={25} decoding="sync"/>
                                    <span style={{fontSize: 20}}>web/html</span>
                                </IconButton>
                            </div>
                        </div>
                    </>
                }
            </>
        )
    }

        function Form(){
            const [formPartCode, setFormPartCode] = useState('');
            const [formDesc, setFormDesc] = useState('');
            const [formBinLoc, setFormBinLoc] = useState('');
            const [formMin, setFormMin] = useState('');
            const [formMax, setFormMax] = useState('');
            
            async function printLabels(labelDetails, includePagResults){
                try{
                    let recs; 
                    if(!labelDetails){
                        if(includePagResults){recs = validateQueryRes(includePagResults)}
                        else{recs = validateQueryRes()}
                    }
                    const req =  await fetch(`${apiUrl}/print/labels`, {
                        method: "POST",
                        // labelDetials: array of optional label objects. recs: query results.
                        body: JSON.stringify([labelDetails? [labelDetails] : recs, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource, nativePrint]),
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
                        const qrData = label.querySelector('#label-qr-data'); 
                        ReactDOM.render(
                        <QRCode 
                            value={partCode?.textContent || qrData.textContent} 
                            size={nativePrint ? itemLabelTypes[itemLabelType].nativeQrSize : itemLabelTypes[itemLabelType].qrSize} 
                        />, label.querySelector('.qr'));
                    });
                    
                    if(!nativePrint){
                        return plainLabels.querySelector('html').innerHTML
                    }
                    else{
                        return labelData
                    }
                }
                catch(err){
                    console.log(err);
                if(!nativePrint){
                    alert("Could not complete request! Check your settings to make sure pop-ups are allowed for this site.")
                }
                else{alert("Could not complete request!")}
                }
            }

            const handleNativePrint = useCallback(async({nodes}) =>{
                
                if (imgRef.current === null) {
                    return
                }
                try{
                    if(!nodes || nodes.length == 0){throw new Error()}
                    const zip = new JSZip();
                    nodes.forEach(async(node, idx)=>{
                        const appendedNode = document.querySelector('#img-ref').appendChild(node);;
                        await toPng(appendedNode, 
                            { 
                                cacheBust: true, 
                                width: itemLabelTypes[itemLabelType].width, 
                                height: itemLabelTypes[itemLabelType].height, 
                                quality: 1, 
                                backgroundColor: 'white',
                            }
                        )
                        .then((dataUrl)=>{
                            if(nodes.length == 1){
                                const link = document.createElement('a');
                                link.download = 'Stor-lbl.png';
                                link.href = dataUrl;
                                link.click();
                                document.querySelector('#img-ref').removeChild(node); 
                            }
                            else{return dataUrl}
                        })
                        .then(async(res)=>{
                            if(nodes.length == 1){return}
                            const b64 = res.split(',')[1]
                            zip.file(`label-${idx}.png`, b64, {base64: true});
                            if(idx == nodes.length -1){
                                const content = await zip.generateAsync({type: 'blob'});

                                // The following can be substituted as needed
                                // with alt download method just below reader.addEventListener().
                                const link = document.createElement('a');
                                link.download = 'Stor-labels.zip';
                                const reader = new FileReader();
                                reader.readAsDataURL(content);
                                reader.addEventListener('loadend', async()=>{
                                    link.href = reader.result;
                                    link.click();
                                    const imgRefEl = document.querySelector('#img-ref');
                                    while(imgRefEl.firstChild){
                                        imgRefEl.removeChild(imgRefEl.firstChild);
                                    };
                                })

                                // Alternative download method.
                                // saveAs(content, 'Stor-labels.zip')
                            }
                        })

                    })
                }
                catch(err){
                    console.log(err)
                }
            }, [imgRef])

            return(
                <form className="stor-new-label-form">
                    <input
                        maxLength={maxChars[itemLabelType].codeMaxChar}
                        className='stor-input'
                        style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                            fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                        }}
                        type='text' 
                        placeholder='PartCode' 
                        onChange={(e)=>{
                            setFormPartCode(e.target.value)
                        }}
                    />
                    {itemLabelType !='itemCodeQR' ?
                        <>
                            <input 
                                maxLength={maxChars[itemLabelType].binLocMaxChar}
                                className='stor-input'
                                style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                }}
                                type='text' 
                                placeholder='BinLoc' 
                                onChange={(e)=>{
                                    setFormBinLoc(e.target.value)
                                }}
                            />
                            <input 
                                maxLength={maxChars[itemLabelType].descriptionMaxChar}
                                className='stor-input'
                                style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                    fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                }}
                                type='text' 
                                placeholder='Description' 
                                onChange={(e)=>{
                                    setFormDesc(e.target.value)
                                }}
                            />
                            {itemLabelType != 'large' ?
                            <>
                                <input 
                                    maxLength={maxChars[itemLabelType].minMaxChar}
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='Min' 
                                    onChange={(e)=>{
                                        setFormMin(e.target.value)
                                    }}
                                />
                                <input
                                    maxLength={maxChars[itemLabelType].maxMaxChar}
                                    className='stor-input'
                                    style={{width: '99%', borderLeft: 0, borderTop: 0, borderRight: 0, fontSize: 'medium',
                                        fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif'
                                    }}
                                    type='text' 
                                    placeholder='Max' 
                                    onChange={(e)=>{
                                        setFormMax(e.target.value)
                                    }}
                                />
                            </>
                            :
                            <></>
                            }
                        </>
                        :
                        <></>
                    }
                    <div style={{width: 'fit-content', margin: 'auto', marginTop: '10px', marginBottom: '10px'}}>
                        <IconButton disableRipple onClick={async()=>{
                            setFormModalOpen(false);
                            const labelDetails = {
                                code: formPartCode,
                                binLoc: formBinLoc,
                                description: formDesc,
                                min: formMin,
                                max: formMax
                            }
                            if(!nativePrint){
                                // Alt New Label Page
                                // const newWindow = window.open('', '_blank', features);
                                // await printLabels(labelDetails).then((label)=>{
                                //     newWindow.document.open(); 
                                //     newWindow.document.write(label || 'Error'); 
                                //     newWindow.document.close();                           
                                // })
                                const link = document.createElement('a');
                                await printLabels(labelDetails).then((label)=>{
                                    setLabels(label.toString() || 'Error')
                                })
                                link.href = './labels';
                                link.click();
                            }
                            else{
                                await printLabels(labelDetails).then((node)=>{
                                    handleNativePrint({nodes: node})
                                })
                            }
                            setReadyToPrint(false);
                        }}><span style={{fontSize: '15px'}}><img src='/square-outlined-small.svg' width='10px' />&nbsp;Create</span>
                        </IconButton>
                        <IconButton disableRipple onClick={()=>{
                            setFormModalOpen(false);
                            setReadyToPrint(false);
                            }}>
                            <span style={{fontSize: '15px'}}><img src='/square-outlined-small.svg' width='10px' />&nbsp;Cancel</span>
                        </IconButton>
                    </div>
                </form>
            )
        }

    return(
        <>
            <IconButton 
                disableRipple
                size="large" 
                aria-label="sort" 
                color="inherit" 
                onClick={()=>{
                    setModalOpen(true);
                    setReadyToPrint(false);
                }}>
                    <img src='/pulsar-labels.svg' width='25px'/>
                {props?.btnDescription}
            </IconButton>
            <BasicMessageModal modalOpen={modalOpen} setModalOpen={setModalOpen}  modalContent={<PrintType/>} noDefaultBtns={true} />
            <PrintNewLabelModal modalOpen={formModalOpen} setModalOpen={setFormModalOpen} modalContent={<Form/>}/>
            <div id='img-ref' ref={imgRef} style={{display:'none'}}></div>
        </>
    )
})

export default Labels