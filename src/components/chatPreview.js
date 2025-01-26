import React from "react";

export default function ChatPreview({title, lastMessage, timeStamp}){
    return (
        <div className="flex px-20 border border-solid border-gray-300 items-center justify-evenly flex-1 overflow-x-clip">
            <div style={{
                display: 'flex',       // Use flexbox for inner layout
                flexDirection: 'column' // Stack items vertically
            }}>
                
                <p style={{ margin: 0, paddingBottom: '5px', fontSize: 20 }}>{title}</p>
                <p style={{ margin: 0, paddingBottom: '5px' }}>{lastMessage}</p>
            </div>
            <p style={{flex: 1}}>{timeStamp}</p> {/* Push timeStamp to the right */}
        </div>
    )
}