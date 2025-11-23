import { IconButton } from "@mui/material";
import BasicMessageModal from './BasicMessageModal';
import useToken from "../../app/useToken";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import PrintNewLabelModal from './PrintNewLabelModal';
import PrintJobs from "./PrintJobs";
const apiUrl = import.meta.env.VITE_API_URL;
import imgMap from '../../app/imgMap';
import './Labels.css'

const itemLabelTypes = {
    reg: {
        fontSize: '11pt', 
        qrSize: 50,
        dataSource: 'all'
    },
    reg16pt: {
        fontSize: '16pt', 
        qrSize: 75,
        dataSource: 'all'
    },
    large: {
        fontSize: '32pt',
        qrSize: 100,
        dataSource: 'all' //Template will exclude min/max for large labels.
    },
    // Single data label.
    itemCodeQR:{
        fontSize: 'mono', 
        qrSize: 75,
        dataSource: 'code'
    }
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
        minMaxChar: 6,
        maxMaxChar: 6,
    },
    large: {
        codeMaxChar : 12,
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

}

export default function Labels(props){
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const { token } = useToken();
    const [itemLabelType, setItemLabelType] = useState('reg');
    const [readyToPrint, setReadyToPrint] = useState(false);

    useEffect(()=>{return setReadyToPrint(false)}, [])

    function PrintType(){
        const [printParts, setPrintParts] = useState(false);
        async function printLabels(labelDetails, includePagResults){
            try{
                let recs; 
                if(!labelDetails){
                    if(includePagResults){recs = validateQueryRes(includePagResults)}
                    else{recs = validateQueryRes()}
                }
                const req =  await fetch(`${apiUrl}/print/labels`, {
                    method: "POST",
                    // labelDetials: array of optional label objects. recs: array of query results.
                    body: JSON.stringify([labelDetails? [labelDetails] : recs, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource]),
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
                    ReactDOM.render(<QRCode value={partCode?.textContent || qrData.textContent} size={itemLabelTypes[itemLabelType].qrSize} />, label.querySelector('.qr'));
                });

                // Open new window for labels doc.
                const plainLabelsTxt = plainLabels.querySelector('html').innerHTML;
                const newWindow = window.open('', '_blank');
                newWindow.document.open(); 
                newWindow.document.write(plainLabelsTxt); 
                newWindow.print(); 
                newWindow.document.close(); 
            }
            catch(err){
                alert('!');
                console.log(err);
            }
        }

        async function printLocLabels(){
            try{
                const req =  await fetch(`${apiUrl}/print/locLabels`, {
                    method: "GET",
                })
                const res = await req.text();
                const parser = new DOMParser()
                const plainLabels = parser.parseFromString(res, 'text/html');
                const labelData  = plainLabels.querySelectorAll('.label-labeldata');

                // Add QRCode to Each Label
                labelData.forEach((label)=>{ 
                    const qrData = label.querySelector('#label-qr-data');
                    ReactDOM.render(<QRCode value={qrData.textContent} size={75} />, label.querySelector('.qr'));
                });

                // Open new window for labels doc.
                const plainLabelsTxt = plainLabels.querySelector('html').innerHTML;
                const newWindow = window.open('', '_blank');
                newWindow.document.open(); 
                newWindow.document.write(plainLabelsTxt); 
                newWindow.print(); 
                newWindow.document.close(); 
            }
            catch(err){
                alert('!');
                console.log(err);
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
                    body: JSON.stringify([modParts, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource]),
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
                    ReactDOM.render(<QRCode value={partCode?.textContent || qrData.textContent} size={itemLabelTypes[itemLabelType].qrSize} />, label.querySelector('.qr'));
                });

                // Open new window for labels doc.
                const plainLabelsTxt = plainLabels.querySelector('html').innerHTML;
                const newWindow = window.open('', '_blank');
                newWindow.document.open(); 
                newWindow.document.write(plainLabelsTxt); 
                newWindow.print(); 
                newWindow.document.close(); 
            }
            catch(err){
                alert('!');
                console.log(err);
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
                                        <IconButton disableRipple onClick={()=>{
                                            setModalOpen(false);
                                            printLabels(undefined, true);
                                            setReadyToPrint(false);
                                        }}><span style={{fontSize: '15px'}}>
                                            <img 
                                                src={imgMap.get('square-outlined-small.svg')} 
                                                width='10px' />&nbsp;All Results
                                            </span>
                                        </IconButton>
                                    </div>
                                    <br/>
                                </>
                                :
                                    <></>
                                }
                                <div>
                                    <IconButton disableRipple onClick={()=>{
                                        setModalOpen(false);
                                        printLabels();
                                        setReadyToPrint(false);
                                    }}><span style={{fontSize: '15px'}}>
                                            <img 
                                                src={imgMap.get('square-outlined-small.svg')} 
                                                width='10px' 
                                            />
                                            &nbsp;{props?.pagListItems.length > 0 ? 'Page' : 'Results'}
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
                                        <span style={{fontSize: '15px'}}>
                                            <img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;New
                                        </span>
                                    </IconButton>
                                </div>
                                <br/>
                                <div>
                                    <PrintJobs printPrintJobs={printPrintJobs}/>
                                </div>
                                <br/>
                            </>
                            :
                            <>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('reg'); setReadyToPrint(true);
                                    }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                                        12pt(1x4)
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('reg16pt'); setReadyToPrint(true);
                                    }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                                        16pt(1x4)
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('large'); setReadyToPrint(true);
                                    }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                                        32pt(2x4)
                                    </span>
                                </IconButton><br/><br/>
                                <IconButton disableRipple onClick={()=>{
                                    setItemLabelType('itemCodeQR'); setReadyToPrint(true)
                                    }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;
                                        ItemCode
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
                                    setPrintParts(true)
                                }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />
                                        &nbsp; Part Labels
                                    </span>
                                </IconButton>
                            </div>
                            <br/>
                            <div>
                                <IconButton disableRipple onClick={()=>{
                                    printLocLabels()
                                }}>
                                    <span style={{fontSize: '15px'}}>
                                        <img src={imgMap.get('square-outlined-small.svg')} width='10px' />
                                        &nbsp; Loc Labels
                                    </span>
                                </IconButton>
                            </div>
                            <br/>
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
                        body: JSON.stringify([labelDetails? [labelDetails] : recs, itemLabelTypes[itemLabelType].fontSize, itemLabelTypes[itemLabelType].dataSource]),
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
                        ReactDOM.render(<QRCode value={partCode?.textContent || qrData.textContent} size={itemLabelTypes[itemLabelType].qrSize} />, label.querySelector('.qr'));
                    });

                    // Open new window for labels doc
                    const plainLabelsTxt = plainLabels.querySelector('html').innerHTML;
                    const newWindow = window.open('', '_blank');
                    newWindow.document.open(); 
                    newWindow.document.write(plainLabelsTxt); 
                    newWindow.print(); 
                    newWindow.document.close(); 
                }
                catch(err){
                    alert('!');
                    console.log(err);
                }
            }

            return(
                <form className="stor-new-label-form">
                    <input
                        {...(itemLabelType=='large' ? {} : {maxLength: maxChars[itemLabelType].codeMaxChar})}
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
                                {...(itemLabelType=='large' ? {} : {maxLength: maxChars[itemLabelType].binLocMaxChar})}
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
                                {...(itemLabelType=='large' ? {} : {maxLength: maxChars[itemLabelType].descriptionMaxChar})}
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
                        <IconButton disableRipple onClick={()=>{
                            setFormModalOpen(false);
                            const labelDetails = {
                                code: formPartCode,
                                binLoc: formBinLoc,
                                description: formDesc,
                                min: formMin,
                                max: formMax
                            }
                            printLabels(labelDetails);
                            setReadyToPrint(false);
                        }}><span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Create</span>
                        </IconButton>
                        <IconButton disableRipple onClick={()=>{
                            setFormModalOpen(false);
                            setReadyToPrint(false);
                            }}>
                            <span style={{fontSize: '15px'}}><img src={imgMap.get('square-outlined-small.svg')} width='10px' />&nbsp;Cancel</span>
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
                <img src={imgMap.get('pulsar-labels.svg')} width='25px'/>
                {props?.btnDescription}
            </IconButton>
            <BasicMessageModal modalOpen={modalOpen} setModalOpen={setModalOpen}  modalContent={<PrintType/>} noDefaultBtns={true}/>
            <PrintNewLabelModal modalOpen={formModalOpen} setModalOpen={setFormModalOpen} modalContent={<Form/>}/>
        </>
    )
}