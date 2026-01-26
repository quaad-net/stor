import { memo } from 'react';
import Avatar from '@mui/material/Avatar'; 
import imgMap from '../../app/imgMap';

const GetAvatar = memo(function GetAvatar(props){

    // Uncomment to return different avatars for various types of parts.
    // const uni = /^3.*$/;
    // const mech = /^7.*$/;
    // const plumb = /^5.*$/;
    // const elec = /^2.*$/;
    const storGold = 'linear-gradient(to right, #bf953f, #b38728, #aa771c)';

    // Adds a different background color for every other avatar in list items.
    const bg = props.avaBgIndx % 2 === 0; 

    // Remove return statement and uncomment conditions below to return different avatars for various
    // types of parts.
    return(
        <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
            <img 
                // src={imgMap.get(props.active ? 'open-hex.png': 'closed-hex.png')}  
                src={imgMap.get('closed-hex.png')}
                className='list-item-avatar' 
                width={40}
            />
        </Avatar>
    )

    // if(uni.test(props.partCode)){
        // return(
        //     <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
        //         <MiscellaneousServicesIcon/>
        //     </Avatar>
    //     )
    // }
    // else if(mech.test(props.partCode)){
    //     return(
    //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
    //             <PrecisionManufacturingIcon/>
    //         </Avatar>
    //     )

    // }
    // else if(plumb.test(props.partCode)){
    //     return(
    //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
    //             <PlumbingIcon/>
    //         </Avatar>
    //     )
    // }
    // else if(elec.test(props.partCode)){
    //     return(
    //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
    //             <ElectricBoltIcon/>
    //         </Avatar>
    //     )
    // }
    // else{
    //     return(
    //         <Avatar sx={{background: bg ? 'gray': storGold, marginRight: '15px'}}>
    //             <MiscellaneousServicesIcon/>
    //         </Avatar>
    //     )
    // }
})

export default GetAvatar