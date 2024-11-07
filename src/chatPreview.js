import React from "react";

export default function ChatPreview({chatTitle, lastMessage, timeStamp}){
    return (
        <div style={{
            display: 'flex',         // Use flexbox for layout
            paddingLeft: '20px',
            paddingRight: '20px',
            border: '1px solid #ccc',
            alignItems: 'center',    // Center items vertically
        }}>
            <div style={{
                display: 'flex',       // Use flexbox for inner layout
                flexDirection: 'column' // Stack items vertically
            }}>
                
                <p style={{ margin: 0, paddingBottom: '5px', fontSize: 20 }}>{chatTitle}</p>
                <p style={{ margin: 0, paddingBottom: '5px' }}>{lastMessage}</p>
            </div>
            <p style={{ marginLeft: 'auto' }}>{timeStamp}</p> {/* Push timeStamp to the right */}
        </div>
    )
}