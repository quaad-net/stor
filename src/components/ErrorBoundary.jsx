import { useRouteError } from 'react-router-dom';

function ErrorBoundary() {

    const error = useRouteError();
    console.error(error);

    return (
    <div>
        <h1>Error</h1>
        <p>
            <i>Something went wrong!</i>
        </p>
    </div>
    );
}

export default ErrorBoundary;
