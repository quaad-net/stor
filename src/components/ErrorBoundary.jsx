import { useRouteError, useNavigate} from 'react-router-dom';
import { useEffect} from 'react';
import useToken from '../../app/useToken';
const apiUrl = import.meta.env.VITE_API_URL;

function ErrorBoundary() {
    const error = useRouteError();
    const navigate = useNavigate();
    const { token } = useToken();

    console.error(error);
    
    useEffect(()=>{
        fetch(`${apiUrl}/auth-endpoint`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then((res)=>{ 
            if(res.status == 200){console.log(res.status)}
            else{ navigate('/lgn') }
        })
    }, [navigate, token])

    return (
    <div id='error-boundary' style={{height: '100vh', width: 'fit-content', margin: 'auto', paddingTop: '200px', color: 'white'}}>
        <h1>!</h1>
        <p>
            <i></i>
        </p>
    </div> 
    )
}

export default ErrorBoundary;
