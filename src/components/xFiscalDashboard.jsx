import CircularIndeterminate from './Progress';
import BasicMessageModal from './BasicMessageModal';
import Divider from '@mui/material/Divider';
import FiscalDashedLineChart from './FiscalDashedLineChart';
import FiscalPieChart from './FiscalPieChart';
import { IconButton } from '@mui/material/';
import { purplePalette, yellowPalette } from '@mui/x-charts/colorPalettes';
import Styled from '@emotion/styled'
import SelectAutoWidth from './SelectAutoWidth';
import { useEffect, useState } from 'react';
import useUserData from  '../../app/useUserData';
const apiUrl = import.meta.env.VITE_API_URL;

const sampleSeries = [
          { data: [20000, 40000, 25000, 35000], label: 'Sample 1', id: 'sample1' }, 
          { data: [11000, 15000, 45000, 25000], label: 'Sample 2', id: 'sample2' }, 
];

const sampleSeriesLabels = ['Q1', 'Q2', 'Q3', 'Q4']

const samleDeptData = [
        { value: 45, label: 'dept1 - 45%' },
        { value: 30, label: 'dept2 - 30%' },
        { value: 15, label: 'dept3 - 15%' },
        { value: 10, label: 'dept4 - 10%' },

];

export default function FiscalDashboard(props){
        const [deptPeriod, setDeptPeriod] = useState('Latest');
        const [deptPeriodShown, setDeptPeriodShown ] = useState('')
        const [deptRange, setDeptRange] = useState('11 mo');
        const [lineChartData, setLineChartData] = useState([]);
        const [lineChartXLabels, setLineChartXLabels] = useState([]);
        const [modalOpen, setModalOpen] = useState(false);
        const [optionsModalOpen, setOptionsModalOpen] = useState(false);
        const [pieChartData, setPieChartData] = useState([]);
        const [pieChartColors, setPieChartColors] = useState(purplePalette);
        const { userData } = useUserData();
        const user = JSON.parse(userData)

        const StyledListItem = Styled.li`
        &:hover {
            cursor: pointer;
        } 
        `
        // For sample viewer. Only used to effect conditions that require data.length > 0.
        useEffect(()=>{
            if(user.email == 'johndoe@quaad.net'){
                setLineChartData(sampleSeries);
                setPieChartData(samleDeptData);
            }
        }, [])

        function getExpenditures(){

            fetch(`${apiUrl}/proxy/fiscal/uwm-fs-expend/monthly-totals-with-prev-yr`
            )
            .then((res)=>{
                if(res.status != 200){ throw new Error()}
                return res.json()
            })
            .then((res)=>{
                const cur12 = JSON.parse(res.data[0]);
                const prev12 = JSON.parse(res.data[1]);
                const dt = new Date();
                const monthsOrd = [];   // {Month, Year}
                const monthsArr = [];  // Array of numeric values of months only.

                // Get correct ordering of months based on the current month.
                const dtStr = dt.toLocaleString();
                let mo = Number(dtStr.split(' ')[0].split('/')[0]);
                let year = dt.getFullYear();
                for (let i = 1 ; i  < 13; i++){
                    monthsOrd.push({mo: mo, yr: year});
                    monthsArr.push(mo);
                    mo -= 1
                    if(mo == 0){
                        mo = 12;
                        year = year - 1;
                    }
                }
                const cur12Map = new Map();
                const prev12Map = new Map();
                const yearsCur = [];
                const yearsPrev = [];
                for(const mIdx in monthsOrd){
                    for(const idx in cur12){
                        const curMonth = cur12[idx].moYr.split("-")[0]
                        const curYear = cur12[idx].moYr.split("-")[1]
                        if(curMonth == monthsOrd[mIdx].mo && curYear == monthsOrd[mIdx].yr){
                            cur12Map.set(cur12[idx].moYr, cur12[idx].monthly_total.toFixed(2))
                            yearsCur.push(cur12[idx].moYr.split("-")[1])
                        }
                    }
                    for(const idx in prev12){
                        const prevMonth = prev12[idx].moYr.split("-")[0]
                        const prevYear = prev12[idx].moYr.split("-")[1]
                        if(prevMonth == monthsOrd[mIdx].mo && prevYear == monthsOrd[mIdx].yr - 1){
                            prev12Map.set(prev12[idx].moYr, prev12[idx].monthly_total.toFixed(2))
                            yearsPrev.push(prev12[idx].moYr.split("-")[1])
                        }
                    }
                }

                const monthMap = new Map();
                monthMap.set(1, 'jan')
                monthMap.set(2, 'feb')
                monthMap.set(3, 'mar')
                monthMap.set(4, 'apr')
                monthMap.set(5, 'may')
                monthMap.set(6, 'jun')
                monthMap.set(7, 'jul')
                monthMap.set(8, 'aug')
                monthMap.set(9, 'sep')
                monthMap.set(10, 'oct')
                monthMap.set(11, 'nov')
                monthMap.set(12, 'dec')
                
                const finalYrData = [];
                const finalPrevYrData = [];
                const xLabels = [];
                const compareCurrent = Number(dtStr.split(' ')[0].split('/')[0]);
                let currYrC = Number(yearsCur.sort((a, b)=> a - b)[0]); // The last year for the curent year (12 month period) of data.
                let currYrP = Number(yearsPrev.sort((a, b)=> a - b)[0]); // The last year for the previous year (12 month period) of data.
                const earliestMonth = monthsArr[monthsArr.length - 1];
                let currMo = earliestMonth;
                // Set data in array from earliest date to latest.
                monthsOrd.forEach(()=>{
                    if(currMo != compareCurrent){
                        finalYrData.push(cur12Map.get(`${currMo}-${currYrC}`));
                        finalPrevYrData.push(prev12Map.get(`${currMo}-${currYrP}`));
                        xLabels.push(monthMap.get(currMo));
                    }
                    currMo += 1;
                    // The following year's data (which is the current year).
                    if(currMo == 13){
                        currMo = 1;
                        currYrC += 1;
                        currYrP += 1;
                    }
                })

                setLineChartData([
                    {data: finalYrData, label: 'latest_11_mo', id: 'p1Id'}, // Add color to obj to change from default.
                    {data: finalPrevYrData, label: 'prior_11_mo', id: 'p2Id'}
                ]);
                setLineChartXLabels(xLabels);
            })
            .catch((err)=>{console.log(err)})
    }

    function getDeptExpenditures(period, range){

        setPieChartData([]);
        setOptionsModalOpen(false);
        fetch(`${apiUrl}/proxy/fiscal/uwm-fs-expend/range=${range}`)
        .then((res)=>{
            if(res.status != 200){throw new Error()}
            return res.json()
        })
        .then((res)=>{
            const deptData = []
            res.data.forEach((dataset)=>{
                const data = JSON.parse(dataset);
                for(const idx in data){
                    if(period == 'Latest'){
                        if(Object.keys(data[idx]) == 'dept_totals_latest_12_mo'){
                            const deptTtls = data[idx].dept_totals_latest_12_mo;
                            deptTtls.forEach((dept)=>{
                            const deptRec = JSON.parse(dept);
                                deptData.push(deptRec[0])
                            })
                        }
                    }
                    else if(period == 'Prior'){
                        if(Object.keys(data[idx]) == 'dept_totals_earlier_12_mo'){
                            const deptTtls = data[idx].dept_totals_earlier_12_mo;
                            deptTtls.forEach((dept)=>{
                            const deptRec = JSON.parse(dept);
                                deptData.push(deptRec[0])
                            })
                        }                       
                    }
                }
            })
    
            const chartData = [];
            let totalExpend = 0;
            deptData.forEach((dept)=>{
                let value, key
                Object.keys(dept).forEach((k)=>{
                    key = k
                })
                Object.values(dept).forEach((v)=>{
                    value = v
                    totalExpend += v
                })
                chartData.push({label: key, value: value})
            })
            chartData.forEach((obj)=>{
                obj.label += ` ` + ((obj.value / totalExpend) * 100).toFixed(2).toString() + '%'
            })

            const removeZeroPerct = [];
            chartData.forEach((obj)=>{
                if(Number(obj.value).toFixed(2) != 0.00){removeZeroPerct.push(obj)}
            })

            const items = [...removeZeroPerct]
            items.sort((b, a) => {
                const item1 = a.value;
                const item2 = b.value;
                if(item1 !== item2){
                    if (item1 < item2) {
                    return -1;
                    }
                    if (item1 > item2) {
                    return 1;
                    }
                    return 0;
                }
                else{
                    const item3 = a.label;
                    const item4 = b.label;

                    if (item3 < item4) {
                    return -1;
                    }
                    if (item3 > item4) {
                    return 1;
                    }
                    return 0;
                }
            })

            setPieChartData(items);
            if(period == 'Latest'){
                setPieChartColors(purplePalette)
            }
            else if(period == 'Prior'){
                setPieChartColors(yellowPalette)
            }
            switch(range){
                case 30:
                    setDeptRange('1 mo')
                    break;
                case 60:
                    setDeptRange('2 mo')
                    break;
                case 90:
                    setDeptRange('3 mo')
                    break;
                case 365:
                    setDeptRange('11 mo')
                    break;
                default:
            }
            setDeptPeriodShown(deptPeriod);
            setOptionsModalOpen(false);
            
        })
        .catch((err)=>{console.log(err)})
    }

    function FiscalModalContent(){
        return(
            <>
                <div style={{width:  props.mobileView ? '250px' : '350px'}}>
                    <div style={{fontWeight: 'bold'}}>Expenditures</div>
                    {user.email == 'johndoe@quaad.net' ? 
                    <></>
                    :
                    <div style={{color: 'gray'}}>by month</div>
                    }
                    {/* Prevents line chart from being shown until pie chart loads */}
                    {pieChartData.length > 0 ?
                    <FiscalDashedLineChart lineChartData={user.email == 'johndoe@quaad.net' ? sampleSeries : lineChartData} xLabels={user.email == 'johndoe@quaad.net' ? sampleSeriesLabels :lineChartXLabels}/>
                    :
                    <></>
                    }
                </div>
                <Divider/>
                {pieChartData.length > 0  || user.email == 'johndoe@quaad.net' ?
                <>
                    {user.email == 'johndoe@quaad.net' ? 
                    <></>
                    :
                    <IconButton sx={{float:'right'}} disableRipple onClick={()=>{
                        setOptionsModalOpen(true)
                    }}>
                        <img src='https://imagedelivery.net/hvBzZjzDepIfNAvBsmlTgA/2e820a51-189e-49b2-20a2-a47bdaaaa200/public' width='20px'/>
                    </IconButton>
                    }
                    <div>
                        <div style={{fontWeight: 'bold'}}>Dept.</div>
                        {user.email == 'johndoe@quaad.net' ? 
                        <></>
                        :
                        <div style={{color: 'gray'}}>{deptPeriodShown} | {deptRange}</div>
                        }
                        <FiscalPieChart 
                            data={user.email == 'johndoe@quaad.net' ? samleDeptData :  pieChartData} 
                            colors={pieChartColors} 
                            centerLabel=''
                            size={{
                                width: props.mobileView ? 0: 200,
                                height: props.mobileView ? 0: 200
                            }}
                        />
                    </div>
                </>
                : 
                <></>
                }
            </>
        )
    }

    function OptionsModalContent(){
        return(
            <>
                <div style={{fontWeight: 'bold', width: 'fit-content', margin: 'auto'}}>By Dept</div>
                <SelectAutoWidth 
                    defaultSelection={deptPeriod}
                    onSelectChange={setDeptPeriod}
                    selectionLabel='period'
                    menuItems={[
                        {name: 'Latest', value: 'Latest'},
                        {name: 'Prior', value: 'Prior'}
                    ]}

                />
                <ul>
                    <StyledListItem  onClick={()=>{getDeptExpenditures(deptPeriod, 30)}}>1 mo</StyledListItem><br/>
                    <StyledListItem onClick={()=>{getDeptExpenditures(deptPeriod, 60)}}>2 mo</StyledListItem><br/>
                    <StyledListItem onClick={()=>{getDeptExpenditures(deptPeriod, 90)}}>3 mo</StyledListItem><br/>
                    <StyledListItem onClick={()=>{getDeptExpenditures(deptPeriod, 365)}}>11 mo</StyledListItem>
                </ul>
            </>
        )
    }

    return(
        <>
            <IconButton
                disableRipple
                size="large" 
                aria-label="inventory details" 
                color="inherit" 
                onClick={()=>{
                    if(user.email != 'johndoe@quaad.net'){
                        if(lineChartData.length === 0){
                            getExpenditures();
                            getDeptExpenditures(deptPeriod, 365);
                        }
                    }
                    setModalOpen(true);
                }}
            >
                <img src='https://imagedelivery.net/hvBzZjzDepIfNAvBsmlTgA/c96d1729-7a0e-4d94-b8eb-6d228b0fb700/public' width='25px'/>
                {props?.btnDescription}
            </IconButton>
            <BasicMessageModal modalOpen={modalOpen} setModalOpen={setModalOpen} {...(pieChartData.length == 0 ? {width:'fit-content', bgcolor: 'transparent', border: 'none', overflow: 'hidden'} : {})}
                modalContent={pieChartData.length > 0 ? <FiscalModalContent/> : <CircularIndeterminate/>} noDefaultBtns={pieChartData.length > 0 ? false : true}/>
            <BasicMessageModal modalOpen={optionsModalOpen} setModalOpen={setOptionsModalOpen} modalContent={<OptionsModalContent/>} noDefaultBtns/>
        </>
    )
}