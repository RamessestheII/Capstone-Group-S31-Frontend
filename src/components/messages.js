import {React, useRef, useEffect} from "react";
import MessageBox from "./messageBox";

export default function Messages({messages, deleteMessage}){
    const messagesEndRef = useRef(null);

    useEffect(() => {
    // Scroll to the bottom of the messages container when the component mounts
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }, [messages]);

return (
    <div className="flex flex-col flex-grow overflow-y-auto h-full">
        {messages.map((message) => (
        <MessageBox key={message.id} message={message} onDelete={deleteMessage} />
        ))}
        <div ref={messagesEndRef} />
    </div>
);
}