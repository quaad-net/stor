import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import useUserData from "../app/useUserData";
import imgMap from "../app/imgMap";

import "./App.css"

const App = () => {
  const { userData } = useUserData();
  const [currentUserData, setCurrentUserData] = useState(userData);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Preload Images
  // useEffect(()=>{
  //   for (let [key, val] of imgMap){
  //     const link = document.createElement('link');
  //     link.rel = 'preload';
  //     link.as = 'image';
  //     link.href = val;
  //     document.querySelector('head').appendChild(link);
  //   }
  // }, [])

  // Set images in local storage
  useEffect(()=>{
      const loadImages = async () => {
        for (const [key, val] of imgMap) {
          const cachedImage = localStorage.getItem(key);
          if (!cachedImage) {
              try {
                  const response = await fetch(val);
                  const blob = await response.blob();
                  const reader = new FileReader();
                  reader.onloadend = () => {
                      const base64data = reader.result;
                      localStorage.setItem(key, base64data);
                  };
                  reader.readAsDataURL(blob);
              } catch (error) {
                  console.error('Error caching image:', error);
              }
          }
        }
      }
      loadImages();
  }, [])

  useEffect(()=>{
    if(location.pathname == '/'){ // If false, route is not valid and will render <ErrorPage/>
      if(userData == ''){navigate("/lgn")}
      else{navigate("/inventory")}   
    }
  },[navigate, location.pathname])

  return (
    <div id="app-hex-background"
    >
      <Outlet context={[currentUserData, setCurrentUserData]}/> 
    </div>
  );
};

export default App