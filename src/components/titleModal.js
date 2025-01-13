import React, { useState } from "react";

const TitleModal = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue);
    setInputValue("")
    onClose();
  };

  return (
    <div className={`user-input-dialog ${isOpen ? 'open' : ''}`}>
      <div className="dialog-content">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter your input"
        />
        <button onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  );
};

export default TitleModal;