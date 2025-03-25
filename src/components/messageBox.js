import React from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import DropDown from "./dropDown";

export default function MessageBox({message, onDelete}){
    const handleContextMenu = (e) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this message?')) {
            onDelete(message.id); // Call the onDelete function with the message ID
        }
    };

    // text to be displayed as the message and source information respectively
    let messageText = ''
    let source = ''
    // split source information from message information using || demarcator
    if (message.content.includes('|')){
        const messageParts = message.content.split('||')
        messageText = messageParts.slice(0,messageParts.length-1).join('||')
        // get source element, remove trailing pipe | characters
        source = messageParts[messageParts.length -1].replace(/^\|+|\|+$/g, '')
    }
    else{
        messageText = message.content
    }

    const SourceElem = ({onMouseEnter, onMouseLeave})=>{
        return (
            <div 
                className="pt-2"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <p className="self-start text-sm px-[4px] text-slate-700 rounded-md bg-slate-300 hover:bg-slate-400">
                    Source
                </p>
            </div>
            
        )
    }
    const SourceContent = ()=>{
        return (
            <span className="text-sm">
                {source}
            </span>
        )
    }
    
    
    return (
        <div className={message.ai === true ? " p-2 rounded-md my-1 ml-[16.5%] mb-[50px] bg-green-50 self-start h-fit":"p-2 rounded-md my-1 mr-[16.5%] mb-[50px] bg-green-300 self-end h-fit"} onContextMenu={handleContextMenu}>
            <div className="flex flex-col p-2">
                <div className="max-w-lg font-thin break-words">
                    {/* render markdown text if needed */}
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {messageText}
                    </ReactMarkdown>
                </div>
                
                {message.ai && source?
                (
                    // <Popup
                    //     trigger={open => (
                    //     <p className="self-start text-sm mt-2 px-[2px] text-slate-700 rounded-md bg-slate-300 hover:bg-slate-400">Source</p>
                    //     )}
                    //     position="top left"
                    //     on={['hover', 'focus']}
                    //     closeOnDocumentClick
                    // >
                    //     <span style={{width:"1000px"}}>{source}</span>
                    // </Popup>
                    <DropDown
                        Trigger={SourceElem}
                        Display={SourceContent}
                        hover
                        top
                    />
                ):
                (<></>)

                }
                
                <span className="self-end text-sm">
                    {new Date(message.timestamp).toLocaleString()} {/* Format the timestamp */}
                </span>
            </div>

        </div>
    );
}