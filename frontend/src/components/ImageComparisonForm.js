import React, { useState } from "react";
import axios from "axios";
import DownloadResult from "./DownloadResult";
import '../styles/ImageCompare.css'

function ImageComparisonForm() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);
  const [comparisonPlotUrl, setComparisonPlotUrl] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState("");

  // Define region-specific images
  const regionImages = {
    pune: ['pune_2020.png', 'pune_2021.png', 'pune_2022.png', 'pune_2023.png', 'pune_2024.png'],
    lucknow: ['lucknow_2020.png', 'lucknow_2021.png', 'lucknow_2022.png', 'lucknow_2023.png', 'lucknow_2024.png'],
    delhi: ['delhi_2020.png', 'delhi_2021.png', 'delhi_2022.png', 'delhi_2023.png', 'delhi_2024.png'],
    mumbai: ['mumbai_2020.png', 'mumbai_2021.png', 'mumbai_2022.png', 'mumbai_2023.png', 'mumbai_2024.png'],
    chennai: ['chennai_2020.png', 'chennai_2021.png', 'chennai_2022.png', 'chennai_2023.png', 'chennai_2024.png'],
  };
  

  const handleRegionChange = (e) => {
    setSelectedRegion(e.target.value);
    setImage1(null);  // Reset image1 when region changes
    setImage2(null);  // Reset image2 when region changes
  };

  const handleImage1Change = (e) => {
    setImage1(e.target.value); // Set the selected image name
  };

  const handleImage2Change = (e) => {
    setImage2(e.target.value); // Set the selected image name
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image1 || !image2) {
      alert("Please select both images.");
      return;
    }

    const formData = new FormData();
    formData.append("region", selectedRegion);  // Pass the selected region
    formData.append("image1", image1);  // Send image name (not file object)
    formData.append("image2", image2);  // Send image name (not file object)

    try {
      const response = await axios.post("http://127.0.0.1:5000/compare", formData, {
        responseType: "blob", // Expecting a PDF response
      });

      // Create a URL for the generated PDF
      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setResultUrl(fileUrl);

      // Fetch the comparison plot image after the PDF is generated
      setComparisonPlotUrl("http://127.0.0.1:5000/comparison-plot");

    } catch (error) {
      console.error("Error comparing images:", error);
      alert("An error occurred while comparing the images.");
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} className="image-comparison-form">
        {/* Region selection dropdown */}
        <div className="dropdown-container">
          <label htmlFor="region">Select Region:</label>
          <select
            id="region"
            value={selectedRegion}
            onChange={handleRegionChange}
            className="region-dropdown"
          >
            <option value="">Select Region</option>
            <option value="pune">Pune</option>
            <option value="lucknow">Lucknow</option>
            <option value="delhi">Delhi</option>
            <option value="mumbai">Mumbai</option>
            <option value="chennai">Chennai</option>
          </select>
        </div>

        {/* Image 1 Dropdown */}
        <div className="file-input-container">
          <label>Upload Image 1:</label>
          <select
            className="file-input"
            value={image1 || ''}
            onChange={handleImage1Change}
            disabled={!selectedRegion}
          >
            <option value="">Select Image 1</option>
            {selectedRegion &&
              regionImages[selectedRegion].map((image) => (
                <option key={image} value={image}>
                  {image}
                </option>
              ))}
          </select>
        </div>

        {/* Image 2 Dropdown */}
        <div className="file-input-container">
          <label>Upload Image 2:</label>
          <select
            className="file-input"
            value={image2 || ''}
            onChange={handleImage2Change}
            disabled={!selectedRegion}
          >
            <option value="">Select Image 2</option>
            {selectedRegion &&
              regionImages[selectedRegion].map((image) => (
                <option key={image} value={image}>
                  {image}
                </option>
              ))}
          </select>
        </div>

        <button type="submit" className="submit-button">Compare Images</button>
      </form>

      {/* Displaying the PDF result */}
      {resultUrl && (
        <div className="download-result">
          <DownloadResult resultUrl={resultUrl} />
        </div>
      )}

      {/* Display the comparison plot image below the PDF result */}
      {comparisonPlotUrl && (
        <div className="comparison-plot-container">
          <h3>Comparison Plot:</h3>
          <img src={comparisonPlotUrl} alt="Comparison Plot" className="comparison-plot-image" />
        </div>
      )}
    </div>
  );
}

export default ImageComparisonForm;
