import React from "react";

function FileInput({ label, onChange }) {
  return (
    <div>
      <label>
        {label}
        <input type="file" accept="image/*" onChange={onChange} />
      </label>
    </div>
  );
}

export default FileInput;
