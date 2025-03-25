import {React, useRef, useEffect} from "react";
import MessageBox from "./messageBox";

export default function Messages({messages, deleteMessage, chatNo, sentinelRef, messagesContainerRef, newMessageBoolean}){
    const messagesEndRef = useRef(null);

    useEffect(() => {
    // Scroll to the bottom of the messages container when the component mounts, or different chat is loaded
    messagesEndRef.current?.scrollIntoView({ behavior: 'auto', block: 'end' });
    }, [chatNo, newMessageBoolean]);

return (
    <div className="flex flex-col overflow-y-auto h-full" ref={messagesContainerRef}>
        <div ref={sentinelRef} className="h-5" />
        {messages.map((message) => (
        <MessageBox key={message.id} message={message} onDelete={deleteMessage} />
        ))}
        <div ref={messagesEndRef} />
    </div>
);
}