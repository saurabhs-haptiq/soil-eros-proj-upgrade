import React, { useState } from "react";
import axios from "axios";
import FileInput from "./FileInput";
import DownloadResult from "./DownloadResult";
import '../styles/ImageCompare.css'

function ImageComparisonForm() {
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [resultUrl, setResultUrl] = useState(null);

  const handleImage1Change = (e) => setImage1(e.target.files[0]);
  const handleImage2Change = (e) => setImage2(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image1 || !image2) {
      alert("Please upload both images.");
      return;
    }

    const formData = new FormData();
    formData.append("image1", image1);
    formData.append("image2", image2);

    try {
      const response = await axios.post("http://127.0.0.1:5000/compare", formData, {
        responseType: "blob",
      });

      const fileUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      setResultUrl(fileUrl);
    } catch (error) {
      console.error("Error comparing images:", error);
      alert("An error occurred while comparing the images.");
    }
  };

  return (
    <div className="form-container">
  <form onSubmit={handleSubmit} className="image-comparison-form">
    <div className="file-input-container">
      <FileInput label="Upload Image 1:" onChange={handleImage1Change} className="file-input" />
    </div>
    <div className="file-input-container">
      <FileInput label="Upload Image 2:" onChange={handleImage2Change} className="file-input" />
    </div>
    <button type="submit" className="submit-button">Compare Images</button>
  </form>
  {resultUrl && (
    <div className="download-result">
      <DownloadResult resultUrl={resultUrl} />
    </div>
  )}
</div>

  );
}

export default ImageComparisonForm;
