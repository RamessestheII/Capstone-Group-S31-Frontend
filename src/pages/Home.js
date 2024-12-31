import React, {useEffect, useState} from "react";
import ChatWindow from "../components/chatWindow";
import ChatsColumn from "../components/chatsColumn";
import Navbar from "../components/navbar";
import axios from "axios";
import HamburgerMenu from "./../hamburger.png";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";

export default function Home() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
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
                    `${chatbackend}/message/1`,
                    {
                        headers: headers,
                    }
                );
                if (chatResponse && chatResponse.data) {
                    setMessages([...chatResponse.data]);
                } else {
                    console.error("No data received");
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // add new message to database and messages
    const addMessage = async (newMessage, type) => {
        try {
            const message = await axios.post(
                `${chatbackend}/message/1`,
                {
                    content: newMessage,
                    ai: type
                },
                {headers}
            );

            // add received message object to messages
            if (message && message.data) {
                setMessages(messages => [...messages, message.data]);
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

    const chatList = [
        {chatTitle: "Title A", lastMessage: "a", timeStamp: "12"},
        {chatTitle: "Title B", lastMessage: "a", timeStamp: "12"},
        {chatTitle: "Title C", lastMessage: "a", timeStamp: "12"},
    ];

    return (
        <div className="chat-app">
            <button onClick={toggleMenu} className="hamburgerbutton">
                <img src={HamburgerMenu} alt="menu icon" />
            </button>
            <div className={`SlidingMenuVisible ${isMenuOpen ? "open" : ""}`}>
                <ChatsColumn chatList={chatList} />
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
