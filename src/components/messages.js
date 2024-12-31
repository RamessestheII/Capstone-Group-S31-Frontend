import React from "react";
import MessageBox from "./messageBox";

export default function Messages({messages, deleteMessage}){

    return (
        <div className="messages">
            {messages.map((message) => (
                <MessageBox key={message.id} message={message} onDelete={deleteMessage} />
            ))}
        </div>
    );
}