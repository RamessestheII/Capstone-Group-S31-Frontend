function updateMessageContent(messages, messageId, newContent) {
    // Find the index of the message with the given ID
    const index = messages.findIndex(message => message.id === messageId);
    
    // If the message is found, update its content
    if (index !== -1) {
        messages[index].content = newContent;
        return messages;
    } else {
        throw new Error("Reponse message not found.")
    }

    
}
export default updateMessageContent