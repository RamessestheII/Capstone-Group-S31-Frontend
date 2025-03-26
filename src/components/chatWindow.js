import { React, useState, useEffect, useRef } from "react";
import Messages from "./messages";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import getChatReply from "../utils/getChatReply";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";

export default function ChatWindow({ messages, chatNo, setChatPreviews, setMessages, setAllMessages, errorMessage, setErrorMessage, selectedLLM, selectedReranker, selectedGraph }) {
  const [input, setInput] = useState("");
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
  const [newMessageBoolean, setNewMessageBoolean] = useState(false);
  const messagesContainerRef = useRef(null);
  const sentinelRef = useRef(null);
  const authHeader = useAuthHeader();

  const headers = {
    Authorization: authHeader,
  };

  const backend = process.env.REACT_APP_BACKEND_URL;

  const addMessage = async (newMessage, type) => {
    try {
      setInput(""); // Clear user input

      const message = await axios.post(
        `${backend}/message/${chatNo}`,
        { content: newMessage, ai: type },
        { headers }
      );

      if (message && message.data) {
        // Update messages for chat
        setMessages(prevMessages => [...prevMessages, message.data]);
        setAllMessages(prevAllMessages => {
          const currentMessages = [...prevAllMessages[chatNo], message.data];
          return { ...prevAllMessages, [chatNo]: currentMessages };
        });

        // change newMessageBoolean (passed as prop to messages) to indicate scroll to bottom of page
        setNewMessageBoolean(newMessageBoolean=>!newMessageBoolean);

        // Update chat previews
        setChatPreviews(oldPreviews => {
          const index = oldPreviews.findIndex(preview => preview.id === message.data.chat_id);
          if (index !== -1) {
            const newPreviews = [...oldPreviews];
            const [preview] = newPreviews.splice(index, 1);
            return [{ ...preview, lastMessage: newMessage, timeStamp: message.data.timestamp }, ...newPreviews];
          }
          return oldPreviews;
        });
        
        return message.data;
      } else {
        throw new Error("No data received");
      }
    } catch (error) {
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const handleSend = async () => {
    if (input) {
      await addMessage(input, false);
      await getChatReply(headers, backend, input, chatNo, addMessage, setMessages, 
        setAllMessages, setChatPreviews, setErrorMessage, selectedLLM, selectedReranker, selectedGraph);
    } else {
      setErrorMessage("Message cannot be empty.");
    }
  };


  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${backend}/message/${id}`, { headers });
      setMessages(prevMessages => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      setErrorMessage("Failed to delete the message. Please try again.");
    }
  };

  // Effect to clear error message after a few seconds
  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000); // Change 3000 to the duration you prefer in milliseconds

      // Cleanup function to clear the timer if the component unmounts or errorMessage changes
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const loadMoreMessages = async () => {
    // Prevent loading if currently loading or no more messages left to load
    if (loadingMore || noMoreMessagesRef.current || chatNo === null) return; 
    setLoadingMore(true);
  
    try {
      // Fetch 10 more messages from the backend
      let response;
      if (messages.length>0){
        response = await axios.post(`${backend}/message/older/${chatNo}`, 
          { before_timestamp: messages[0].timestamp }, { headers }
        );
      }
      else{
        setNoMoreMessages(true);
        return
      }
      
  
      if (response.data && response.data.length > 0) {
        // Prepend new messages to messages and allMessages
        setMessages(prevMessages => [...response.data, ...prevMessages]); 
        setAllMessages(prevAllMessages => {
          const currentMessages = [...response.data, ...prevAllMessages[chatNo]];
          return { ...prevAllMessages, [chatNo]: currentMessages };
        });
      } else {
        // Only set noMoreMessages to true if you are certain there are no more messages to load
        setNoMoreMessages(true);
      }
    } catch (error) {
      setErrorMessage("Failed to load more messages. Please try again.");
    } finally {
      setLoadingMore(false);
      
      // Adjust the scroll position to prevent scrolling to the top of the message list
      messagesContainerRef.current.scrollTop = 50;
    }
  };

  // Run loadMoreMessages if sentinelRef at top of messages component is visible
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      // Check if the sentinel is intersecting
      if (entries[0].isIntersecting && !loadingMore) {
        loadMoreMessages();
      }
    }, {
      rootMargin: "0px", // Adjust margin if needed
      threshold: 1 // Trigger when the entire sentinel is in view
    });

    const sentinelElement = sentinelRef.current;
    
    // Observe the sentinel
    if (sentinelElement) {
      observer.observe(sentinelElement);
    }

    return () => {
      if (sentinelElement) {
        observer.unobserve(sentinelElement);
      }
    };
  }, [loadingMore, chatNo]); // Depend on loadingMore to re-run observer logic

 // reset noMoreMessages when chats are switched
 useEffect(()=>{
  setNoMoreMessages(false)
 }, [chatNo])

 // define useRef with useEffect to ensure that the latest version of noMoreMessages is being used
 const noMoreMessagesRef = useRef(noMoreMessages);

  useEffect(() => {
    noMoreMessagesRef.current = noMoreMessages;
  }, [noMoreMessages]);

  return (
    <div className="flex flex-col h-[90%] relative">
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      {loadingMore &&  
      <ThreeDots
        visible={true}
        height="50"
        width="50"
        color="#4fa94d"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass="flex justify-center items-center h-14"
        />}
    
      <Messages 
        id="messages-container" 
        messages={messages} 
        deleteMessage={deleteMessage} 
        sentinelRef={sentinelRef} 
        chatNo={chatNo}
        messagesContainerRef={messagesContainerRef}
        newMessageBoolean={newMessageBoolean}
      />
        
      <div className="flex px-4 h-14 items-center justify-center">
        <input
          className="h-full w-[60%] px-4 border border-gray-300 rounded-lg"
          type="text"
          value={input}
          onKeyUp={(e) => { if (e.key === 'Enter') handleSend() }}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button onClick={handleSend} className="flex bg-transparent h-full w-12 border-none cursor-pointer ml-4">
          <FontAwesomeIcon icon={faPaperPlane} className="flex-1 mt-1 h-[70%] block"/>
        </button>
      </div>
    </div>
  );
}