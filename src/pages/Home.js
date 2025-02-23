import React, {useEffect, useState} from "react";
import ChatWindow from "../components/chatWindow";
import ChatsColumn from "../components/chatsColumn";
import Navbar from "../components/navbar";
import axios from "axios";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBars} from '@fortawesome/free-solid-svg-icons'

export default function Home() {
    const [allMessages, setAllMessages] = useState(null);
    const [messages, setMessages] = useState(() => {
        const savedMessages = localStorage.getItem('messages');
        return savedMessages !== null ? JSON.parse(savedMessages) : [];
    });
    const [chatPreviews, setChatPreviews] = useState([]);
    const [chatNo, setChatNo] = useState(() => {
        const savedChatNo = localStorage.getItem('chatNo');
        return savedChatNo !== null ? JSON.parse(savedChatNo) : null;
    });
    const [isMenuOpen, setIsMenuOpen] = useState(true);
    const authHeader = useAuthHeader();

    const headers = {
        Authorization: authHeader,
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const backend = process.env.REACT_APP_BACKEND_URL

    // get data on setup
    useEffect(() => {
        const fetchData = async () => {
            try {
                const chatResponse = await axios.get(
                    `${backend}/message/`,
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

    // Save messages to localStorage to fetch on refresh
    useEffect(() => {
        localStorage.setItem('messages', JSON.stringify(messages));
    }, [messages]);
    
    // Save chat number to localStorage to fetch on refresh
    useEffect(() => {
        localStorage.setItem('chatNo', JSON.stringify(chatNo));
    }, [chatNo]);

    // Change displayed chat in window to chat of given id
    const handleChatChange = (id) => {
        setChatNo(id)
        setMessages(allMessages[id]);
    }

    const addChat = async (title) => {
        try {
            const chat = await axios.post(
                `${backend}/chat/`,
                {title},
                {headers}
            );

            // add received message object to messages
            if (chat && chat.data) {
                setAllMessages(prevMessages => ({
                    ...prevMessages, 
                    [chat.data.id]: [],
                }));
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
            `${backend}/chat/${id}`,
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

    

    return (
        <div className="h-screen m-0 flex bg-slate-200 dark:bg-black dark:text-white ">
            
            <button onClick={toggleMenu} className="absolute bg-transparent border-none cursor-pointer mt-3 p-0 z-10">
            <FontAwesomeIcon icon={faBars} className="w-10 h-10 pl-2 pt-2 block"/>
            </button>

            <div className={`h-full fixed top-0 left-0 border-r-2 border-gray-300 transition-transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} w-80`}>
                <ChatsColumn 
                    chatPreviews={chatPreviews} 
                    handleChatChange={handleChatChange}
                    addChat={addChat}
                    onDeleteChat={deleteChat}
                />
            </div>
            <div className={`flex flex-col w-full h-full overflow-hidden transition-margin-left ${isMenuOpen ? 'ml-80' : 'ml-0'}`}>
                <Navbar 
                    isMenuOpen={isMenuOpen}
                    toggleMenu={toggleMenu}
                />
                <ChatWindow
                    messages={messages}
                    setChatPreviews={setChatPreviews}
                    setMessages={setMessages}
                    setAllMessages={setAllMessages}
                    chatNo={chatNo}
                />
            </div>
        </div>
    );
}