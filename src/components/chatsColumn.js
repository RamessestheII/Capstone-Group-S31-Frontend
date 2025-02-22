import React, {useState} from "react";
import ChatPreview from "./chatPreview";
import AddIcon from "./../add.png";
import Upload from "./../upload.png";
import TitleModal from "./titleModal";
import FileUpload from "./fileUpload";
  

export default function ChatsColumn({ chatPreviews, handleChatChange, addChat, onDeleteChat }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fileShown, setFileShown] = useState(false);


    const handleContextMenuChat = (e, id) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this chat?')) {
            onDeleteChat(id); // Call the onDeleteChat function with the chat ID
        }
    };

    return (
        <div className="h-full mt-12 flex flex-col">
            <div className="flex p-3">
                <TitleModal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={addChat}
                />
                <button className="flex bg-white m-4 py-4 px-6" onClick={() => setIsDialogOpen(true)}>
                    <img src={AddIcon} alt="add" style={{ height: 24 }} />
                    <p >New Chat</p>
                </button>
                <button className="flex bg-white m-4 py-4 px-6" onClick={() => setFileShown(prev=>!prev)}>
                    <img src={Upload} alt="add" style={{ height: 24 }} />
                    <p >Add Files</p>
                </button>
            </div>
            
            <div className=" flex flex-col overflow-hidden">
                {fileShown ? 
                    <FileUpload/>
                : 
                <div className="flex flex-col overflow-hidden hover:overflow-y-auto">
                    {chatPreviews.map((chat, index) => (
                        <button 
                            onClick={async()=>{handleChatChange(chat.id)}} key={index} 
                            onContextMenu={(e)=>handleContextMenuChat(e,chat.id)}
                        >
                            <ChatPreview 
                                title={chat.title}
                                lastMessage={chat.lastMessage}
                                timeStamp={chat.timeStamp}
                            />
                        </button>
                    ))}
                </div>
                }
            </div>
            
        </div>
    );
}