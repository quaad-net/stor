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
      title: 'Login',
      code: 1,
      to: "/lgn",
      icon: "/login.svg"
    },
    {
      title: 'Pick',
      code: 2,
      to: "/pick",
      icon: "/pick.svg"
    },
    {
      title: 'Receive',
      code: 3,
      to: "/receive",
      icon: "receive.svg"
    },
    {
      title: 'Browse',
      code: 4,
      to: "/Browse",
      icon: "/browse.svg"
    },
    {
      title: 'Label',
      code: 5,
      to: "/label",
      icon: "/stacked-labels.svg"
    },
    {
      title: 'Problem',
      code: 6,
      to: "/problem",
      icon: "/problem.svg"
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
                <img className='nav-modal-icon' src={itm.icon} width='30px'/>
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
          <button 
            type="button" 
            title="Menu" 
            alt="Menu" 
            id="menu-icon-btn" 
            onClick={()=>{
              document.querySelector('#menu-icon-btn').blur()
              showNavModal()
              }}>
          </button>
        </div>
        <div className="nav-icon-container">
          <fieldset className='nav-icon-main-fieldset'>
            <legend><img id="nav-icon-main" src="/maze-logo.svg" width="50px" /></legend>
          </fieldset>
        </div>
      </div>
      <NavModal navMenu={navMenu}/>
    </>
  );
}