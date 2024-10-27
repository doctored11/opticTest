
import React, { useState } from "react";

import { MainPage } from "./pages/main/MainPage";
import "./styles/normalize.css";
import "./styles/global.css";


import { createRoot } from "react-dom/client";



const App = () => {
 
  return (
    <MainPage></MainPage>
    
  );
};

const rootEl = document.getElementById("root");

if (rootEl) {
  const root = createRoot(rootEl);
  root.render(
   
      <App />
   
  );
}
