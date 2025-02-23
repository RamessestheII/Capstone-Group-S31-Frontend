import React from "react";

export default function ChatPreview({title, lastMessage, timeStamp, onClick, onContextMenu}){
    if (typeof timeStamp == 'string'){
        timeStamp = timeStamp.slice(5,11)
    }
    else{
        timeStamp = ''
    }
    if (typeof lastMessage == 'string'){
        lastMessage = lastMessage.slice(0,20)
    }
    else{
        lastMessage = ''
    }
    // flex h-full w-full px-20 border-y border-gray-300  
    return (
        <button 
            className="flex min-h-20 border-y items-center justify-between border-gray-300 overflow-hidden"
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <div className="flex flex-col flex-1">
                
                <p className="text-xl pb-1">{title}</p>
                <p className="ml-10 pb-1">{lastMessage}</p>
            </div>
            <p style={{flex: 1}}>{timeStamp}</p> {/* Push timeStamp to the right */}
        </button>
    )
}