import React from "react";
import SendIcon from './../send.png'
import Messages from "./messages";

export default function ChatWindow({messages, input, setInput, handleSend, deleteMessage}){
    return (
        <div className="flex flex-col h-[90%] relative">
          <Messages messages={messages} deleteMessage={deleteMessage} />
          <div className="flex px-4 h-14 items-center justify-center">
            <input
                className="h-full w-[60%] px-4 border border-gray-300 rounded-lg"
                type="text"
                value={input}
                onKeyUp={(e) => { if (e.key === 'Enter') handleSend() }}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
            />
            <button onClick={handleSend} className="bg-transparent h-full border-none cursor-pointer ml-4">
              <img src={SendIcon} alt="send icon" className=" flex-1 h-[70%] block"/>
            </button>
          </div>
        </div>
      );
}
