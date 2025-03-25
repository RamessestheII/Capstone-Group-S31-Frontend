import axios from "axios";
import updateMessageContent from "./updateMessageContent";

const getChatReply = async (headers, backend, input, chatNo, addMessage, setMessages, setAllMessages, setChatPreviews, setErrorMessage) => {
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
          setMessages(prevMessages=>{
            return updateMessageContent(prevMessages, emptyMessage.id, accumulatedMessage)
          })
          
        }
      }
  
      // Update all messages and chat previews after the complete message is received
      setAllMessages(prevAllMessages => {
        const currentMessages = updateMessageContent(prevAllMessages[chatNo], emptyMessage.id, accumulatedMessage)
        return { ...prevAllMessages, [chatNo]: currentMessages };
      });
  
      setChatPreviews(oldPreviews => oldPreviews.map(preview =>
        preview.id === emptyMessage.chat_id ? { ...preview, lastMessage: accumulatedMessage } : preview
      ));

      // update empty message with llm output
      const finalmessage = await axios.put(
        `${backend}/message/${emptyMessage.id}`,
        { content: accumulatedMessage },
        { headers }
      );
      console.log(finalmessage)
      
    } catch (error) {
      console.error("Error sending message to RAG:", error);
      setErrorMessage("Failed to get a response from the bot. Please try again.");
    }
  };

  export default getChatReply