import React, {useState} from "react";
import ChatPreview from "./chatPreview";
import FileUpload from "./fileUpload";
import Modal from "./modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faArrowUpFromBracket, faArrowLeft} from "@fortawesome/free-solid-svg-icons";
  

export default function ChatsColumn({ chatPreviews, handleChatChange, addChat, onDeleteChat }) {
    // const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fileShown, setFileShown] = useState(false);
    console.log(chatPreviews)

    const handleContextMenuChat = (e, id) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this chat?')) {
            onDeleteChat(id); // Call the onDeleteChat function with the chat ID
        }
    };

    const AddChatButton = ({onClick})=>{
        return (
            <button className="flex bg-white w-[105px] h-20 m-4" onClick={onClick}>
                <FontAwesomeIcon icon={faPlus} className="h-4 pt-7 pl-5"/>
                <p className="p-5">New Chat</p>
            </button>
        )
    }
    
    const modalText = "Chat name?"
    const chatNamePlaceholder = "  Enter chat name"
    const submitText = "Add Chat"

    return (
        <div className="h-full mt-12 flex flex-col justify-between">
            <div className="flex p-3">
                {!fileShown?
                <div className="flex">
                    <Modal
                        Trigger={AddChatButton}
                        modalText={modalText}
                        inputPlaceholder={chatNamePlaceholder}
                        onSubmit={addChat}
                        submitText={submitText}
                        clickAway
                    />
                    <button className="flex bg-white w-[105px] h-20 m-4" onClick={() => setFileShown(prev=>!prev)}>
                        <FontAwesomeIcon icon={faArrowUpFromBracket} className="h-4 pt-7 pl-5"/>
                        <p className="p-5">Add Files</p>
                    </button>
                </div>
                :
                <button className="flex bg-white w-[105px] h-20 m-4" onClick={() => setFileShown(prev=>!prev)}>
                    <FontAwesomeIcon icon={faArrowLeft} className="h-4 pt-7 pl-5"/>
                    <p className="pl-3 pt-6">Chats</p>
                </button>
                }
                
            </div>
            
            <div className=" flex flex-col overflow-hidden h-full">
                
                <FileUpload fileShown={fileShown}/>
                
                <div className={`w-full mr-1 flex flex-col border-b-2 border-gray-300 overflow-hidden hover:overflow-y-auto ${fileShown ? 'hidden' : ''}`}>
                    {chatPreviews.map((chat, index) => (
                        <ChatPreview 
                            title={chat.title}
                            lastMessage={chat.lastMessage}
                            timeStamp={chat.timeStamp}
                            onClick={async()=>{handleChatChange(chat.id)}} key={index} 
                            onContextMenu={(e)=>handleContextMenuChat(e,chat.id)}
                        />
                        
                    ))}
                </div>
                
            </div>
            
        </div>
    );
}