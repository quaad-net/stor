import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {

    const error = useRouteError();
    console.error(error);

    return (
    <div id='error-boundary' style={{height: '100vh', width: 'fit-content', margin: 'auto', paddingTop: '200px', color: 'white'}}>
        <h1>Error</h1>
        <p>
            <i>Something went wrong!</i>
        </p>
    </div>
    );
}

export default ErrorBoundary;
