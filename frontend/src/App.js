import React from "react";
import ImageComparisonForm from "./components/ImageComparisonForm";
import Navbar from "./components/Navbar";

function App() {
  return (

    

    <div style={{ textAlign: "center", padding: "20px" }}>
      <Navbar />
      <h1>Soil Erosion Comparison Tool</h1>
      <ImageComparisonForm />
    </div>


    /*
    
    <div style={{ display: "flex" }}>
      <Navbar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <ImageComparisonForm />
      </div>
    </div>
    
    */
  );
}

export default App;
