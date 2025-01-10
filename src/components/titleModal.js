import React, { useState } from "react";

const UserInputDialog = ({ isOpen, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = () => {
    onSubmit(inputValue);
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

export default UserInputDialog;