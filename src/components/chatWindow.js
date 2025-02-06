import { React, useState } from "react";
import SendIcon from './../send.png';
import Messages from "./messages";
import useAuthHeader from "react-auth-kit/hooks/useAuthHeader";
import axios from "axios";

export default function ChatWindow({ messages, chatNo, setChatPreviews, setMessages, setAllMessages }) {
  const [input, setInput] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
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

      // const chatReply = await axios.post(
      //   `${backend}/message/response`,
      //   { input },
      //   { headers, responseType: 'stream' },
      // );
      const chatReply = await fetch(`${backend}/message/response/${chatNo}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': headers.Authorization,
        },
        body: JSON.stringify({ input }),
    });

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
            
            accumulatedMessage += chunk
            setMessages(prevMessages => {
              const lastIndex = prevMessages.length - 1;
              const currentMessage = { ...prevMessages[lastIndex], content: accumulatedMessage };
              return [...prevMessages.slice(0, lastIndex), currentMessage];
            });

        }
    }

      if (true) {
        
        setAllMessages(prevAllMessages => {
          const currentMessages = [...prevAllMessages[chatNo].slice(0,-1), {...emptyMessage, content:accumulatedMessage}];
          return { ...prevAllMessages, [chatNo]: currentMessages };
        });

        setChatPreviews(oldPreviews => oldPreviews.map(preview =>
          preview.id === emptyMessage.chat_id
            ? { ...preview, lastMessage: accumulatedMessage }
            : preview
        ));
      } else {
        throw new Error("No response from RAG.");
      }
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

  return (
    <div className="flex flex-col h-[90%] relative">
      {errorMessage && <div className="text-red-500">{errorMessage}</div>}
      <Messages messages={messages} deleteMessage={deleteMessage} />
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