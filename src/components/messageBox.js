import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MessageBox({message, onDelete}){
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this message?')) {
            onDelete(message.id); // Call the onDelete function with the message ID
        }
    };

    const containsMarkdown = message.content.includes('|');
    
    return (
        <div className={message.ai === true ? "p-2 rounded-md my-1 ml-[16.5%] mb-[50px] bg-green-50 self-start h-fit":"p-2 rounded-md my-1 mr-[16.5%] mb-[50px] bg-green-300 self-end h-fit"} onContextMenu={handleContextMenu}>
            <div className="flex flex-col max-w-lg break-words p-2">
                {containsMarkdown ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                    </ReactMarkdown>
                ) : (
                    <p>{message.content}</p> // Render as plain text if no Markdown
                )}
                <span className="self-end">
                    {new Date(message.timestamp).toLocaleString()} {/* Format the timestamp */}
                </span>
            </div>
        </div>
    );
}