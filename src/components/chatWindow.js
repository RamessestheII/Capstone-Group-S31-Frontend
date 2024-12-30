import React from "react";
import SendIcon from './../send.png'

export default function ChatWindow({messages, input, setInput, handleSend}){
    return (
        <div className="chat-window">
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={index%2 === 0 ? "AIMessage":"userMessage"}>{msg}</div>
                ))}
            </div>
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
