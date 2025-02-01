import { NavLink } from "react-router-dom";
import "./Navbar.css"
import { useEffect, useState } from "react";
import NavModal from "./NavModal";

export default function AppropiateNav(){

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
      title: 'Browse',
      code: 3,
      to: "/Browse"
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
              {/* mobileView currently has the same attribute names. Uncomment below and replace "<div className='nav-btn' for unique mobile styling.*/}
              {/* <div {...(mobileView ? {className: 'mb-nav-btn'} : {className: 'nav-btn'})}  */} 
              <div className= 'nav-btn'
                type="button" title={itm.title} key={key} id={id}>
                {itm.title}
              </div>
          </NavLink>
      )      
  });

  function showNavModal(){

    const modal = document.querySelector('#nav-modal');
    const modalBackground = document.querySelector('.nav-modal');
    const close = document.querySelector('.nav-modal-close');
    modal.style.display = "block";
    close.addEventListener('click', ()=>{ 
        modal.style.display = 'none';
    })
    document.addEventListener('click', (e)=>{
        if(e.target == modalBackground){
            modal.style.display = 'none';
        }
    })
   
    function removeModal(e){
        if(e.key === 'Escape'){
            modal.style.display="none";
        }
    }

    document.addEventListener('keydown', removeModal);
    const navOptions = document.querySelectorAll('.nav-btn')
    navOptions.forEach((opt=>{
      opt.addEventListener('click', ()=>{
        modal.style.display = 'none';
      })
    }))
  }

  return (
    <>
      <div className="nav-bar">
        {/* mobileView currently has the same attribute names. Uncomment below and replace "<div className="nav-menu">" for unique mobile styling. */}
        {/* <div {...(mobileView? {className: 'mb-nav-menu'}:{className:"nav-menu"})}> */}
        <div className="nav-menu">
          <button type="button" id="menu-icon-btn" onClick={showNavModal}></button>
        </div>
        <div className="nav-icon-container">
          <fieldset className='nav-icon-main-fieldset'>
            <legend><img id="nav-icon-main" src="/icons8-maze-yel.svg" width="50px" /></legend>
          </fieldset>
        </div>
      </div>
      <NavModal navMenu={navMenu}/>
    </>
  );
}