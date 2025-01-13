import React, {useEffect, useState} from "react";
import ChatWindow from "../components/chatWindow";
import ChatsColumn from "../components/chatsColumn";
import Navbar from "../components/navbar";
import axios from "axios";
import HamburgerMenu from "./../hamburger.png";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function Home() {
    const [allMessages, setAllMessages] = useState(null);
    const [messages, setMessages] = useState([]);
    const [chatPreviews, setChatPreviews] = useState([]);
    const [chatNo, setChatNo] = useState(null);
    const [input, setInput] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const authHeader = useAuthHeader();
    const headers = {
        Authorization: authHeader,
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const backend = "http://127.0.0.1:5000";
    const chatbackend = "http://localhost:3001";

    // get data on setup
    useEffect(() => {
        const fetchData = async () => {
            try {
                const chatResponse = await axios.get(
                    `${chatbackend}/message`,
                    {
                        headers: headers,
                    }
                );
                if (chatResponse && chatResponse.data) {
                    setAllMessages(chatResponse.data.messagesDict);
                    let previewList = chatResponse.data.chatPreviews;
                    // sort chat list by recency of timestamps
                    previewList.sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp));
                    setChatPreviews(previewList);
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Change displayed chat in window to chat of given id
    const handleChatChange = (id) => {
        setChatNo(id)
        setMessages(allMessages[id.toString()].messages);
    }

    const addChat = async (title) => {
        try {
            const chat = await axios.post(
                `${chatbackend}/chat/`,
                {title},
                {headers}
            );

            // add received message object to messages
            if (chat && chat.data) {
                setAllMessages(prevMessages => {
                    prevMessages[chat.data.id] = {
                        messages: [],
                        title: title
                    }
                    return prevMessages
                });
                setChatPreviews(oldPreviews=>[{
                    id: chat.data.id,
                    title: title
                }, ...oldPreviews])
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // delete selected chat
    const deleteChat = async (id) => {
        await axios.delete(
            `${chatbackend}/chat/${id}`,
            {
                headers: headers,
            }
        )
        // clear chat window if current chat is being deleted
        if (chatNo===id){
            setChatNo(null);
            setMessages([])
        }
        setAllMessages(prevMessages=> {
            delete prevMessages.id
            return prevMessages
        });
        setChatPreviews(chatPreviews.filter((chat) => chat.id !== id));
    };

    // add new message to database and messages
    const addMessage = async (newMessage, type) => {
        try {
            const message = await axios.post(
                `${chatbackend}/message/${chatNo}`,
                {
                    content: newMessage,
                    ai: type
                },
                {headers}
            );

            // add received message object to messages
            if (message && message.data) {
                // update messages for chat
                setMessages(messages => [...messages, message.data]);
                // update timestamp and lastMessage in chats column
                setChatPreviews( oldPreviews => oldPreviews.map(preview =>
                    preview.id === message.data.chatId
                      ? { ...preview, lastMessage: newMessage, timeStamp: message.data.timestamp }
                      : preview
                  ).sort((a, b) => new Date(b.timeStamp) - new Date(a.timeStamp))
                )
            } else {
                console.error("No data received");
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    // add user input to chat, get reply from chatbot, and add reply to chat
    const handleSend = async () => {
        if (input) {
            await addMessage(input, false);

            await getChatReply(input);
            setInput(""); // clear user input
        }
    };

    const getChatReply = async (input) => {
        try {
            const chatReply = await axios.post(
                `${backend}/response`, 
                {input}
            )
            if (chatReply && chatReply.data){
                await addMessage(chatReply.data, true)
            }
            else{console.error("No response from RAG.")}
            
            
        } catch (error) {
            console.error("Error sending message to RAG:", error);
        }
    };

    const deleteMessage = async (id) => {
        await axios.delete(
            `${chatbackend}/message/${id}`,
            {
                headers: headers,
            }
        )
        setMessages(messages.filter((message) => message.id !== id)); // Filter out the deleted message
    };

    return (
        <div className="chat-app">
            <button onClick={toggleMenu} className="hamburgerbutton">
                <img src={HamburgerMenu} alt="menu icon" />
            </button>
            <div className={`SlidingMenuVisible ${isMenuOpen ? "open" : ""}`}>
                <ChatsColumn 
                chatPreviews={chatPreviews} 
                handleChatChange={handleChatChange}
                addChat={addChat}
                onDeleteChat={deleteChat}
                />
            </div>
            <div className="chat-app1">
                <Navbar />
                <ChatWindow
                    messages={messages}
                    input={input}
                    setInput={setInput}
                    handleSend={handleSend}
                    deleteMessage={deleteMessage}
                />
            </div>
        </div>
    );
}