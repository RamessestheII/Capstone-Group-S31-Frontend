import React, {useState} from "react";
import ChatPreview from "./chatPreview";
import AddIcon from "./../add.png";
import Upload from "./../upload.png";
import TitleModal from "./titleModal";
  

export default function ChatsColumn({ chatPreviews, handleChatChange, addChat, onDeleteChat }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleContextMenu = (e, id) => {
        e.preventDefault(); // Prevent the default context menu from appearing
        if (window.confirm('Do you want to delete this chat?')) {
            onDeleteChat(id); // Call the onDeleteChat function with the chat ID
        }
    };

    return (
        <div style={{ marginTop: '48px' }}>
            <div style={{ padding: 10, display: 'flex'}}>
                <TitleModal
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    onSubmit={addChat}
                />
                <button className="chatbuttons" onClick={() => setIsDialogOpen(true)}>
                    <img src={AddIcon} alt="add" style={{ height: 24 }} />
                    <p className="newchattext">New Chat</p>
                </button>
                <button className="chatbuttons">
                    <img src={Upload} alt="add" style={{ height: 24 }} />
                    <p className="newchattext">Add Files</p>
                </button>
            </div>
            
            {chatPreviews.map((msg, index) => (
                <button onClick={async()=>{handleChatChange(msg.id)}} key={index} 
                onContextMenu={(e)=>handleContextMenu(e,msg.id)}>
                    <ChatPreview 
                        title={msg.title}
                        lastMessage={msg.lastMessage}
                        timeStamp={msg.timeStamp}
                    />
                </button>
            ))}
            
        </div>
    );
}