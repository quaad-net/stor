import RecordList from "./RecordList";
import ShowInstitution from "./Institution";

export default function Browse(){
    return(
        <>
            <RecordList/>
            <div id="institution-domain"><ShowInstitution/></div>
        </>
    )
}