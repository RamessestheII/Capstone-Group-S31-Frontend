import React from "react";

export default function ChatPreview({title, lastMessage, timeStamp, onClick, onContextMenu}){
    if (typeof timeStamp == 'string'){
        timeStamp = timeStamp.slice(5,11)
    }
    else{
        timeStamp = ''
    }
    if (typeof lastMessage == 'string'){
        lastMessage = lastMessage
    }
    else{
        lastMessage = ''
    }
    // flex h-full w-full px-20 border-y border-gray-300  
    return (
        <button 
            className="flex min-h-20 border-t-2 items-center justify-between border-gray-300 overflow-hidden"
            onClick={onClick}
            onContextMenu={onContextMenu}
        >
            <div className="flex flex-col flex-1">
                
                <p className="self-start text-xl ml-10 w-24 overflow-hidden whitespace-nowrap text-ellipsis mb-1">{title}</p>
                <p className="self-start text-sm ml-10 w-32 overflow-hidden whitespace-nowrap text-ellipsis mb-1">{lastMessage}</p>
            </div>
            <p style={{flex: 1}}>{timeStamp}</p> {/* Push timeStamp to the right */}
        </button>
    )
}