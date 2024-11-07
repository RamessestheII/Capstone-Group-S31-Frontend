import React from "react";
import ChatPreview from "./chatPreview";

export default function ChatsColumn({chatList}){
    return (
        <div style={{ marginTop:'88px'}}>
            {chatList.map((msg, index) => (
                    <ChatPreview key={index} 
                    chatTitle={msg.chatTitle}
                    lastMessage={msg.lastMessage}
                    timeStamp={msg.timeStamp}
                    />
                ))}
        </div>
    )
}