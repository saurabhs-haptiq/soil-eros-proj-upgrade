import React from "react";
import ImageComparisonForm from "./components/ImageComparisonForm";
import Navbar from "./components/Navbar";
import backgroundImage from './images/bg-img.jpg'; 

function App() {
  return (

    

    <div style={{ textAlign: "center", padding: "20px", backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh'  }}>
      <Navbar />
      <h1>Soil Erosion Comparison Tool</h1>
      <ImageComparisonForm />
    </div>

  );
}

export default App;
