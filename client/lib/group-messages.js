export default function groupMessages(messages, userId) {
  return messages.reduce((groups, message) => {
    const otherId = message.senderId === userId
      ? message.recipientId
      : message.senderId;

    const existingGroupIndex = groups.findIndex(group => {
      const firstMessage = group[0];
      return (
        (firstMessage.senderId === otherId && firstMessage.recipientId === userId) ||
        (firstMessage.senderId === userId && firstMessage.recipientId === otherId)
      );
    });

    if (existingGroupIndex === -1) {
      return [...groups, [message]];
    }

    groups[existingGroupIndex] = [...groups[existingGroupIndex], message];
    return groups;
  }, []);
}
