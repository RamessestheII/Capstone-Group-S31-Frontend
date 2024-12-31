import React from "react";

export default function MessageBox({message, onDelete}){
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this message?')) {
            onDelete(message.id); // Call the onDelete function with the message ID
        }
    };
    
    return (
        <div className={message.ai === true ? "AIMessage":"userMessage"} onContextMenu={handleContextMenu}>
            <div className="message-content">
                <p>{message.content}</p>
                <span className="timestamp">
                    {new Date(message.timestamp).toLocaleString()} {/* Format the timestamp */}
                </span>
            </div>
        </div>
    );
}