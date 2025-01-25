import React from "react";
import SendIcon from './../send.png'
import Messages from "./messages";

export default function ChatWindow({messages, input, setInput, handleSend, deleteMessage}){
    return (
        <div className="flex flex-col flex-grow overflow-hidden">
          <Messages messages={messages} deleteMessage={deleteMessage} />
          <div className="flex items-center px-4 h-14 border-t border-gray-300 mb-5 bg-white">
            <input
                className="flex-1 h-full px-4 border border-gray-300 rounded"
                type="text"
                value={input}
                onKeyUp={(e) => { if (e.key === 'Enter') handleSend() }}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend} className="bg-transparent border-none cursor-pointer p-0 ml-10 mr-60">
              <img src={SendIcon} alt="send icon" className="w-7 h-7 block"/>
            </button>
          </div>
        </div>
      );
}
