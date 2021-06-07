function GroupMessages(messages, userId) {
  const groupedMessages = messages.reduce((newArray, message, x, OldArray) => {
    let otherId;
    if (message.senderId === userId) {
      otherId = message.recipientId;
    } else {
      otherId = message.senderId;
    }
    const index = newArray.findIndex(newArrayItem => {
      if ((newArrayItem[0].senderId === otherId && newArrayItem[0].recipientId === userId) || (newArrayItem[0].senderId === userId && newArrayItem[0].recipientId === otherId)) {
        return true;
      } else {
        return false;
      }
    });
    if (index === -1 || newArray.length === 0) {
      newArray.push([message]);
    } else {
      newArray[index].push(message);
    }
    return newArray;
  }, []);
  return groupedMessages;
}

export default GroupMessages;
