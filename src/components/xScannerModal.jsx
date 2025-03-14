import { useState } from 'react';
import { QrReader } from 'react-qr-reader';

export default function ScannerModal(props){

    const [scanResult, setScanResult] = useState('00-0000');

    function Scanner(){

        function Cam(){
            return (
                <>
                  <QrReader
                    onResult={(result, error) => {
                      if (!!result) {
                        setScanResult(result?.text);
                      }
            
                      if (!!error) {
                        // console.info(error);
                      }
                    }}
                    style={{ width: '100%' }}
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
                                <Scanner/>
                            </span>
                        </div>
                    </span>
                    <button id='scanner-done-btn'type='button' onClick={()=>{
                        props.updateDisplayCam();
                        props.getScanResult(scanResult);
                        document.querySelector('#scanner-modal').style.display = 'none'
                    }}>
                        Done
                    </button>
                </div>
            </div>
        </div>
    )

}

