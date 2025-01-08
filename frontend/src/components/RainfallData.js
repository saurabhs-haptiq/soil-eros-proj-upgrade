import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import "../styles/RainfallData.css";

const RainfallData = () => {
  const [regions, setRegions] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [year, setYear] = useState(""); // State to store the entered year
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load CSV data on component mount
  useEffect(() => {
    const fetchCsvData = async () => {
      try {
        const response = await fetch("./pune_annual_rainfall.csv"); // Fetch from public folder
        const csvText = await response.text();
        const parsedData = Papa.parse(csvText, { header: true }).data;
        console.log("Parsed CSV Data:", parsedData); // Debug: Log parsed data
        setCsvData(parsedData);
      } catch (err) {
        console.error("Error loading CSV data:", err);
        setError("Failed to load rainfall data. Please try again later.");
      }
    };

    fetchCsvData();
  }, []);

  // Update regions when the year changes
  useEffect(() => {
    if (!year || csvData.length === 0) {
      setRegions([]);
      return;
    }

    setLoading(true);

    // Filter and sort data for the selected year
    const filteredData = csvData
      .filter((row) => row.year?.trim() === year.toString()) // Match the selected year
      .map((row) => ({
        name: row.region?.trim(),
        totalRainfall: parseFloat(row.annual_rainfall),
      }))
      .filter((row) => row.name && !isNaN(row.totalRainfall)) // Ensure valid data
      .sort((a, b) => b.totalRainfall - a.totalRainfall); // Descending order

    console.log("Filtered Data for Year:", year, filteredData); // Debug: Log filtered data

    setRegions(filteredData);
    setLoading(false);
  }, [year, csvData]);

  const handleYearChange = (event) => {
    setYear(event.target.value); // Update year state
  };

  return (
    <div className="rainfall-container">
      <h1>Rainfall Data</h1>

      {/* Year selection input */}
      <div className="year-input">
        <label htmlFor="year">Select Year:</label>
        <input
          id="year"
          type="number"
          value={year}
          onChange={handleYearChange}
          min="2000"
          max="2100"
          placeholder="Enter year"
        />
      </div>

      {/* Display results */}
      {loading ? (
        <p>Loading rainfall data for {year}, please wait...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : regions.length === 0 ? (
        <p>No rainfall data available for the year {year}.</p>
      ) : (
        <ul className="rainfall-list">
          {regions.map((region, index) => (
            <li key={index} className="rainfall-item">
              <span className="rank">{index + 1}.</span>
              <span className="region-name">{region.name}</span>
              <span className="rainfall-amount">{region.totalRainfall} mm</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RainfallData;
