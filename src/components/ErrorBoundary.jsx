import { useRouteError, useNavigate} from 'react-router-dom';
import { useState} from 'react';
import useAuth from '../../app/useAuth';

function ErrorBoundary() {

    const error = useRouteError();
    console.error(error);
    const auth = useAuth();
    const navigate = useNavigate();

    if(!auth.authorized){navigate('/lgn')}

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
