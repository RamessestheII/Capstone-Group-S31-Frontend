import React from "react";
import ChatPreview from "./chatPreview";
import AddIcon from "./../add.png";
import Upload from "./../upload.png";

export default function ChatsColumn({ chatList }) {
    return (
        <div style={{ marginTop: '48px' }}>
            <div style={{ padding: 10, display: 'flex'}}>
            <button className="chatbuttons">
                <img src={AddIcon} alt="add" style={{ height: 24 }} />
                <p className="newchattext">New Chat</p>
            </button>
            <button className="chatbuttons">
                <img src={Upload} alt="add" style={{ height: 24 }} />
                <p className="newchattext">Add Files</p>
            </button>
        </div>
            
            <div >
                {chatList.map((msg, index) => (
                    <ChatPreview key={index} 
                        chatTitle={msg.chatTitle}
                        lastMessage={msg.lastMessage}
                        timeStamp={msg.timeStamp}
                    />
                ))}
            </div>
        </div>
    );
}