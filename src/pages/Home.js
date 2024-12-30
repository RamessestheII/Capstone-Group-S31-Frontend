import React, { useEffect, useState } from 'react';
import ChatWindow from '../components/chatWindow';
import ChatsColumn from '../components/chatsColumn';
import Navbar from '../components/navbar';
import axios from 'axios';
import HamburgerMenu from './../hamburger.png'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

export default function Home() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const authHeader = useAuthHeader();
    const headers = {
        'Authorization': authHeader
    }
      
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const backend = 'http://127.0.0.1:5000'
    const chatbackend = 'http://localhost:3001'

    // get data on setup
    useEffect(() => {
        axios.get(backend)
            .then(response => {
                setMessages([response.data]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
            .then(()=>{
                axios.get(`${chatbackend}/message/1`, {
                    headers: headers
                })
            })
            .then(response=>{
                console.log(response.data)
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            })
    });

    // add user input to chat, get reply from chatbot, and add reply to chat
    const handleSend = () => {
        if (input) {
            setMessages([...messages, input])
            setTimeout(()=>getChatReply(input), 1000)
            setInput(''); // clear user input
        }
    };

    const getChatReply = (input) => {
        
        axios.post(`${backend}/response`, {
            'input':input
            })
            .then(function (response) {
            setMessages(messages =>[...messages, response.data]);
            })
            .catch(function (error) {
            console.log(error);
            });
    }

    const chatList = [{'chatTitle':'Title A', 'lastMessage':'a', 'timeStamp':'12'}, 
        {'chatTitle':'Title B', 'lastMessage':'a', 'timeStamp':'12'}, 
        {'chatTitle':'Title C', 'lastMessage':'a', 'timeStamp':'12'}]

    return (
        <div className='chat-app'>
            <button onClick={toggleMenu}className='hamburgerbutton'>
                <img src={HamburgerMenu} alt='menu icon'/>
            </button>
            <div className={`SlidingMenuVisible ${isMenuOpen ? 'open' : ''}`}>
                <ChatsColumn chatList = {chatList}/>
            </div>
            <div className="chat-app1">
                <Navbar/>
                <ChatWindow
                messages={messages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                />
            </div>
        </div>
    );
}
