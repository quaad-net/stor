const apiUrl = import.meta.env.VITE_API_URL;

export function binLocationQuery(query){

    fetch(`${apiUrl}/inventory/binLoc/${query}`, {method: 'POST'})
    .then((res)=>{
        if(res.status == 401){throw new Error('Unauthorized user')}
        else if(res.status == 404){throw new Error('Cannot run query')}
        else if(res.status == 400){throw new Error('Invalid syntax')}
        else if(res.status == 500){throw new Error('Something went wrong')}
        else{
            return res.json()
        }
    })
    .then((res)=>{
        if(res.message == 'Invalid query format'){throw new Error('Invalid syntax')}
        else{
            if(res.length == 0){
                alert('No match found');
            }else{return(res)}
        };
    })
    .catch((err)=>{
        if (err.message=='Invalid syntax'){alert(err.message)}
        else if(err.message == 'Unauthorized user'){alert(err.message)}
        else if(err.message == 'Cannot run query'){alert(err.message)}
        else{
            alert('Something went wrong!')
            console.log(err)
        }
    })
}