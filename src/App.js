// src/App.js
import React, { useEffect, useState } from 'react';
import ChatWindow from './chatWindow';
import ChatsColumn from './chatsColumn';
import axios from 'axios';
import HamburgerMenu from './hamburger.png'

function App() {

    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);
      
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const backend = 'http://127.0.0.1:5000'

    // get data on setup
    useEffect(() => {
        axios.get(backend)
            .then(response => {
                setMessages([response.data]);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

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
                <div className='AppHeader'></div>
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

export default App;