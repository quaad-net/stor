import { NavLink } from "react-router-dom";
import "./Navbar.css"

export default function Navbar() {

    const navBarItems = [
        {
          title: 'Pick',
          code: 1,
          to: "/pick"
        },
        {
          title: 'Receive',
          code: 2,
          to: "/receive"
        },
        {
          title: 'Search',
          code: 3,
          to: "/search"
        },
        {
          title: 'Update',
          code: 4,
          to: "/update"
        },
        {
          title: 'Problem?',
          code: 5,
          to: "/problem"
        }
      ];

    const navMenu = navBarItems.map((itm)=>{
        const id = `nav-btn-${itm.title}`;
        const key = `${id}-key`;
        const navLinkKey = `${id}-nav-link-key`
        return(
            <NavLink to={itm.to} key={navLinkKey}>
                <button className="nav-btn" type="button" title={itm.title} key={key} id={id}>
                    {itm.title}
                </button>
            </NavLink>
        )      
    });
    
  return (
    <div className="nav-bar">
      <div className="nav-menu">
        <nav>
          {navMenu}
        </nav>
      </div>
      <div className="nav-icon-container">
        <fieldset className='nav-icon-main-fieldset'>
          <legend><img id="nav-icon-main" src="/icons8-maze.svg" width="50px" /></legend>
        </fieldset>
      </div>
    </div>
  );
}

///// Boilerplate /////

// export default function Navbar() {
//     return (
//       <div>
//         <nav className="flex justify-between items-center mb-6">
//           <NavLink to="/">
//             <img alt="MongoDB logo" className="h-10 inline" src="https://d3cy9zhslanhfa.cloudfront.net/media/3800C044-6298-4575-A05D5C6B7623EE37/4B45D0EC-3482-4759-82DA37D8EA07D229/webimage-8A27671A-8A53-45DC-89D7BF8537F15A0D.png"></img>
//           </NavLink>
  
//           <NavLink className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3" to="/create">
//             Create Employee
//           </NavLink>
//         </nav>
//       </div>
//     );
//   }