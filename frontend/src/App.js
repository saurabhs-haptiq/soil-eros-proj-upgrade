import React from "react";
import ImageComparisonForm from "./components/ImageComparisonForm";
import Navbar from "./components/Navbar";
import backgroundImage from './images/bg-img.jpg'; 
import Footer from "./components/Footer";
import RainfallData from "./components/RainfallData";

function App() {
  return (

    

    <div className="app-container" style={{ textAlign: "center", padding: "20px", backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh'  }}>
      <Navbar />
      
      <h1 className="app-title" style={{color:'white'}}>Get Annually Rainfall Data</h1>
      <RainfallData />
      <h1 className="app-title" style={{color:'white'}}>Soil Erosion Comparison Tool</h1>
      <div className="content">
        <ImageComparisonForm />
      </div>

      <Footer />
    </div>

  );
}

export default App;
