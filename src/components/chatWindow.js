import React from "react";
import SendIcon from './../send.png'
import Messages from "./messages";

export default function ChatWindow({messages, input, setInput, handleSend, deleteMessage}){
    return (
        <div className="chat-window">
            <Messages
                messages={messages}
                deleteMessage={deleteMessage}
            />
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onKeyUp={(e)=>{
                        if(e.key==='Enter') {handleSend()}
                    }}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <button onClick={handleSend} className="send-button">
                    <img src={SendIcon} alt="send icon"/>
                </button>
            </div>
            
        </div>
    )
}
