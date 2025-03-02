import { useRouteError } from "react-router-dom";
import ShowInstitution from "./Institution";

export default function ErrorPage() {
  
  return (
    <div>
      <h1>Error</h1>
      <p>
        <i>Resource does not exist!</i>
      </p>
      <div id="institution-domain"><ShowInstitution/></div>
    </div>
  );
}