import { useState } from 'react';
import { Scanner } from '@yudiel/react-qr-scanner';

export default function ScannerModal(props){

    const [scanResult, setScanResult] = useState('00-00000');

    function NewScan(){

        function Cam(){
            return (
                <>
                  <Scanner
                    onScan={(result)=>{
                        setScanResult(result[0].rawValue);
                    }}
                    onError={(error)=>{console.log(error)}}
                    styles={{ width: '100%'}}
                    constraints={{facingMode: {ideal: 'environment' }}}
                  />
                </>
              )
        }

        function NoCam(){
            return(<></>)
        }

        return(
            <>{props.displayCam ? <Cam/> : <NoCam/>}</>
        )
    }

    // function stopScanner(){
    //     navigator.mediaDevices
    //     .getUserMedia({ audio: false, video: true })
    //     .then((mediaStream) => {
    //         document.querySelector("video").srcObject = mediaStream;
    //         const tracks = mediaStream.getTracks();
    //         tracks.forEach((track)=>{
    //             track.stop()
    //         })
    //     })

    // }

    return(
        <div className="modal" id="scanner-modal">
            <div className="scanner-modal">
                <div className="scanner-modal-data">
                    <span className="scanner-modal-close">&times;</span>
                    <div className="scanner-modal-header">{scanResult}</div>
                    <span className="scanner-modal-rows">
                        <div className="scanner-modal-row">
                            <span id="scanner-container">
                                <NewScan/>
                            </span>
                        </div>
                    </span>
                    <button id='scanner-done-btn'type='button' onClick={()=>{
                        props.updateDisplayCam();
                        props.getScanResult(scanResult);
                        setScanResult("00-00000")
                        document.querySelector('#scanner-modal').style.display = 'none'
                    }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )

}

