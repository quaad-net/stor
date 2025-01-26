import { NavLink } from "react-router-dom";
import "./Navbar.css"
import { useEffect, useState } from "react";

export default function AppropiateNav(){

  // const [curNav, setCurNav ]= useState('');
    const [mobileView, setMobileView]= useState(false);
    
    useEffect(()=>{
      const atMedia = window.matchMedia("(max-width: 750px)");
      setMobileView(atMedia.matches);
      
      function updateMobileView(){
        setMobileView(atMedia.matches)
      }
      atMedia.addEventListener('change', updateMobileView);

      return function cleanup(){
        atMedia.removeEventListener('change', updateMobileView);
      }
    })

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
              <div {...(mobileView ? {className: 'mb-nav-btn'} : {className: 'nav-btn'})} 
                type="button" title={itm.title} key={key} id={id}>
                  {itm.title}
              </div>
          </NavLink>
      )      
  });

  return (
    <div className="nav-bar">
      <div {...(mobileView? {className: 'mb-nav-menu'}:{className:"nav-menu"})}>
        {/* {mobileView ? <img id="mobile-nav-icon" width="15px" src="/icons8-menu.svg" alt="Nav Menu" /> : <></>} */}
        {navMenu}
      </div>
      <div className="nav-icon-container">
        <fieldset className='nav-icon-main-fieldset'>
          <legend><img id="nav-icon-main" src="/icons8-maze-yel.svg" width="50px" /></legend>
        </fieldset>
      </div>
    </div>
  );
}