import { IconButton } from "@mui/material";
import BasicMessageModal from './BasicMessageModal';
import useToken from "../../app/useToken";
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useState } from "react";
import PrintNewLabelModal from './PrintNewLabelModal';
const apiUrl = import.meta.env.VITE_API_URL;

export default function Labels(props){
    const [modalOpen, setModalOpen] = useState(false);
    const [formModalOpen, setFormModalOpen] = useState(false);
    const { token } = useToken();

    const codeMaxChar = 30;
    const descriptionMaxChar = 93; //70
    const binLocMaxChar = 10;
    const minMaxChar = 6;
    const maxMaxChar = 6;
    const modQueryRes = [];

    function validateQueryRes(){

        props?.queryRes.forEach((record)=>{
            // This prevents errors resulting from numeric types in code and binLoc field.
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
                code: modCode?.substring(0, codeMaxChar),
                description: record.description?.length > descriptionMaxChar ? record.description?.substring(0, descriptionMaxChar) + '...' : 
                    record.description,
                binLoc: modBinLoc?.substring(0, binLocMaxChar),
                min: record.min === '' ? '?': record.min.toString()?.substring(0, minMaxChar),
                max: record.max === '' ? '?' : record.max.toString()?.substring(0, maxMaxChar),
            }
            modQueryRes.push(modRecord)
        })
        return modQueryRes
    }

    async function printLabels(labelDetails){
        try{
            const recs = validateQueryRes();
            const req =  await fetch(`${apiUrl}/print/labels`, {
                method: "POST",
                body: labelDetails ? JSON.stringify([labelDetails]) : JSON.stringify(recs),
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
        catch(err){
            alert('!');
            console.log(err);
        }
    }

    function PrintType(){
        return(
            <div style={{width: 'fit-content', margin: 'auto'}}>
                <IconButton disableRipple onClick={()=>{
                    setModalOpen(false);
                    printLabels();
                }}><span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Results</span>
                </IconButton>
                <IconButton disableRipple onClick={()=>{
                    setModalOpen(false);
                    setFormModalOpen(true);
                    }}>
                    <span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;New Label </span>
                </IconButton>
            </div>
        )
    }

    function Form(){
        const [formPartCode, setFormPartCode] = useState('');
        const [formDesc, setFormDesc] = useState('');
        const [formBinLoc, setFormBinLoc] = useState('');
        const [formMin, setFormMin] = useState('');
        const [formMax, setFormMax] = useState('');
        return(
            <form>
                <input
                    maxLength={codeMaxChar}
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
                <input 
                    maxLength={binLocMaxChar}
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
                    maxLength={descriptionMaxChar}
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
                <input 
                    maxLength={minMaxChar}
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
                    maxLength={maxMaxChar}
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
                        printLabels(labelDetails)
                    }}><span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Create</span>
                    </IconButton>
                    <IconButton disableRipple onClick={()=>{
                        setFormModalOpen(false);
                        }}>
                        <span style={{fontSize: '15px'}}><img src='square-outlined-small.svg' width='10px' />&nbsp;Cancel</span>
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
                }}>
                <img src='/pulsar-labels.svg' width='25px'/>
                {props?.mobileView ?  <span style={{fontSize: '15px'}}>Print</span> : <></>}
            </IconButton>
            <BasicMessageModal modalOpen={modalOpen} setModalOpen={setModalOpen} modalContent={<PrintType/>} noDefaultBtns={true} />
            <PrintNewLabelModal modalOpen={formModalOpen} setModalOpen={setFormModalOpen} modalContent={<Form/>}/>
        </>
    )
}