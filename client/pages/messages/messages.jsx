import React, { useState, useEffect, useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import AppContext from '../../lib/app-context';
import GroupMessages from '../../lib/group-messages';
import formatDate from '../../lib/format-date';

export default function Messages() {
  const { user } = useContext(AppContext);
  const [messages, setMessages] = useState(null);
  const requests = new Set();

  useEffect(() => {
    const requestController = new AbortController();
    requests.add(requestController);
    const { signal } = requestController;
    const token = window.localStorage.getItem('phoenix-games-jwt');
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('phoenix-games-jwt', token);

    fetch('/api/messages', {
      headers: header,
      signal
    })
      .then(response => response.json())
      .then(messages => {
        if (signal.aborted) return;
        setMessages(messages);
      })
      .catch(() => {})
      .finally(() => requests.delete(requestController));

    return () => {
      requests.forEach(req => req.abort());
    };
  }, []);

  if (!user) return <Navigate to="/sign-in" replace />;
  if (!messages) return null;

  if (messages.length === 0) {
    return (
      <div className="row no-messages">
        <h2>You have no messages.</h2>
      </div>
    );
  }

  return <MessageList messageList={GroupMessages(messages, user.userId)} userId={user.userId} />;
}

function MessageList({ messageList, userId }) {
  return (
    <div className="message-list-container">
      {messageList.map(message => (
        <MessageItem
          key={message[0].messageId}
          info={message[0]}
          userId={userId}
        />
      ))}
    </div>
  );
}

function MessageItem({ info, userId }) {
  const {
    senderId,
    senderName,
    lenderName,
    content,
    recipientId,
    postId,
    createdAt
  } = info;

  const otherId = userId === senderId ? recipientId : senderId;
  const displayContent = content.length > 20 ? `${content.slice(0, 20)}...` : content;
  const formattedDate = formatDate(createdAt);

  return (
    <Link to={`/convo/${otherId}/${postId}`} className="message-list-item">
      <div className="message-list-item-text">
        <div className="message-list-item-name">
          <h3 className="text-shadow lora">
            {userId === senderId ? lenderName : senderName}
          </h3>
        </div>
        <div className="message-list-item-note">
          <span className="lora">{displayContent}</span>
        </div>
      </div>
      <div className="message-list-item-di">
        <div className="message-list-item-date">
          <h3 className="lora">{formattedDate}</h3>
        </div>
        <div className="message-list-item-icon">
          <i className="text-shadow fas fa-chevron-right"></i>
        </div>
      </div>
    </Link>
  );
}
