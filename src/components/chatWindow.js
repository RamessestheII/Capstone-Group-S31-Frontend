import { React, useState, useEffect, useRef } from "react";
import SendIcon from './../send.png';
import Messages from "./messages";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";
import { ThreeDots } from "react-loader-spinner";

export default function ChatWindow({ messages, chatNo, setChatPreviews, setMessages, setAllMessages }) {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [noMoreMessages, setNoMoreMessages] = useState(false);
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
      console.error("Error sending message:", error);
      setErrorMessage("Failed to send message. Please try again.");
    }
  };

  const handleSend = async () => {
    if (input) {
      await addMessage(input, false);
      await getChatReply(input);
    } else {
      setErrorMessage("Message cannot be empty.");
    }
  };

  const getChatReply = async (input) => {
    try {
      const emptyMessage = await addMessage("", true);
      
      const chatReply = await fetch(`${backend}/message/response`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': headers.Authorization,
        },
        body: JSON.stringify({ input }),
      });
  
      if (!chatReply.ok) {
        throw new Error("Error in response: " + chatReply.statusText);
      }
  
      const reader = chatReply.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulatedMessage = '';
  
      while (!done) {
        const { value, done: isDone } = await reader.read();
        if (isDone) {
          done = true;
        } else {
          const chunk = decoder.decode(value, { stream: true });
          accumulatedMessage += chunk;
          
          // Update messages with bot reply
          setMessages(prevMessages => {
            const lastIndex = prevMessages.length - 1;
            const currentMessage = { ...prevMessages[lastIndex], content: accumulatedMessage };
            return [...prevMessages.slice(0, lastIndex), currentMessage];
          });
        }
      }
  
      // Update all messages and chat previews after the complete message is received
      setAllMessages(prevAllMessages => {
        const currentMessages = [...prevAllMessages[chatNo].slice(0, -1), { ...emptyMessage, content: accumulatedMessage }];
        return { ...prevAllMessages, [chatNo]: currentMessages };
      });
  
      setChatPreviews(oldPreviews => oldPreviews.map(preview =>
        preview.id === emptyMessage.chat_id ? { ...preview, lastMessage: accumulatedMessage } : preview
      ));

      // update empty message with llm output
      const finalmessage = await axios.post(
        `${backend}/message/edit/${emptyMessage.id}`,
        { content: accumulatedMessage },
        { headers }
      );
      console.log(finalmessage)
      
    } catch (error) {
      console.error("Error sending message to RAG:", error);
      setErrorMessage("Failed to get a response from the bot. Please try again.");
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`${backend}/message/${id}`, { headers });
      setMessages(prevMessages => prevMessages.filter((message) => message.id !== id));
    } catch (error) {
      console.error("Error deleting message:", error);
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
    console.log('entered load function', loadingMore, noMoreMessagesRef.current, chatNo)
    if (loadingMore || noMoreMessagesRef.current || chatNo === null) return; 
    setLoadingMore(true);
  
    try {
      // Fetch 10 more messages from the backend
      const response = await axios.post(`${backend}/message/older/${chatNo}`, 
        { before_timestamp: messages[0].timestamp }, { headers }
      );
  
      console.log('Response data:', response.data); // Debugging output
  
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
      console.error("Error loading more messages:", error);
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
      console.log('observer')
    }

    return () => {
      if (sentinelElement) {
        observer.unobserve(sentinelElement);
        console.log('observer closed')
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
        <button onClick={handleSend} className="bg-transparent h-full border-none cursor-pointer ml-4">
          <img src={SendIcon} alt="send icon" className="flex-1 h-[70%] block" />
        </button>
      </div>
    </div>
  );
}