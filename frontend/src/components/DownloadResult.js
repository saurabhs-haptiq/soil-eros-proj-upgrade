import React from "react";

function DownloadResult({ resultUrl }) {
  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Comparison Report</h2>
      <iframe
        src={resultUrl}
        width="100%"
        height="600px"
        title="Image Comparison Report"
        style={{ border: "none" }}
      />
    </div>
  );
}

export default DownloadResult;
