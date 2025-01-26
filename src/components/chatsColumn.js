import React, {useState, useEffect} from "react";
import axios from "axios";
import ChatPreview from "./chatPreview";
import AddIcon from "./../add.png";
import Upload from "./../upload.png";
import TitleModal from "./titleModal";
import FileUpload from "./fileUpload";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
  

export default function ChatsColumn({ chatPreviews, handleChatChange, addChat, onDeleteChat }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [fileShown, setFileShown] = useState(false);
    const [fileList, setFileList] = useState([])

    // auth header to authenticate user backend requests
    const authHeader = useAuthHeader();

     // get file list on startup
     useEffect(() => {
        const fetchData = async () => {
            try {
                const fileList = await axios.get(
                    'http://localhost:3001/file',
                    {
                        headers: {'Authorization':authHeader},
                    }
                );
                if (fileList && fileList.data) {
                    setFileList(fileList.data)
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleContextMenu = (e, id) => {
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
                    <p className="newchattext">New Chat</p>
                </button>
                <button className="flex bg-white m-4 py-4 px-6" onClick={() => setFileShown(prev=>!prev)}>
                    <img src={Upload} alt="add" style={{ height: 24 }} />
                    <p className="newchattext">Add Files</p>
                </button>
            </div>
            
            <div className="flex flex-col h-full overflow-hidden hover:overflow-y-auto ">
            {fileShown ? (
                   <>
                   <FileUpload setFileList={setFileList}/>
                   {fileList.map((file, index) => (
                       <div key={index}>{file}</div>
                   ))}
               </>
               ) : 
                (chatPreviews.map((msg, index) => (
                    <button 
                        onClick={async()=>{handleChatChange(msg.id)}} key={index} 
                        onContextMenu={(e)=>handleContextMenu(e,msg.id)}
                    >
                        <ChatPreview 
                            title={msg.title}
                            lastMessage={msg.lastMessage}
                            timeStamp={msg.timeStamp}
                        />
                    </button>
                )))
               }
            </div>
            
        </div>
    );
}