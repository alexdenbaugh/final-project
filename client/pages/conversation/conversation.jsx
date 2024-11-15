import React, { useState, useEffect, useContext, useRef } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import AppContext from '../../lib/app-context';
import formatDate from '../../lib/format-date';

export default function Conversation() {
  const { user } = useContext(AppContext);
  const { otherId, postId } = useParams();
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const messageContainer = useRef(null);
  const requests = new Set();

  useEffect(() => {
    if (!user) return;

    const intervalId = setInterval(refreshMessages, 3000);
    refreshMessages();

    return () => {
      clearInterval(intervalId);
      requests.forEach(req => req.abort());
    };
  }, [user, otherId]);

  useEffect(() => {
    if (messageContainer.current) {
      messageContainer.current.scrollTop = messageContainer.current.scrollHeight;
    }
  }, [messages]);

  const refreshMessages = async () => {
    const token = window.localStorage.getItem('phoenix-games-jwt');
    const requestController = new AbortController();
    requests.add(requestController);

    try {
      const response = await fetch(`/api/message/convo/${otherId}`, {
        headers: {
          'Content-Type': 'application/json',
          'phoenix-games-jwt': token
        },
        signal: requestController.signal
      });

      const data = await response.json();
      if (!requestController.signal.aborted) {
        if (!data.length) {
          window.location.hash = 'messages';
        }
        setMessages(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      requests.delete(requestController);
    }
  };

  const handleSubmit = async event => {
    event.preventDefault();
    if (!currentMessage) return;

    const token = window.localStorage.getItem('phoenix-games-jwt');
    const requestController = new AbortController();
    requests.add(requestController);

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'phoenix-games-jwt': token
        },
        body: JSON.stringify({
          senderName: user.username,
          recipientId: otherId,
          postId,
          content: currentMessage
        }),
        signal: requestController.signal
      });

      setCurrentMessage('');
      refreshMessages();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      requests.delete(requestController);
    }
  };

  if (!user) return <Navigate to="/sign-in" replace />;

  const name = messages.length > 0
    ? messages[0].senderId === user.userId
      ? messages[0].lenderName
      : messages[0].senderName
    : '';

  return (
    <>
      <div className="row">
        {messages.length > 0 && (
          <div className="col-1 convo-header shadow">
            <h2 className="text-shadow orange">{name}</h2>
          </div>
        )}
      </div>
      <div className="row">
        <div ref={messageContainer} className="col-1 convo-container shadow">
          <MessageList messages={messages} userId={user.userId} />
        </div>
      </div>
      <div className="row">
        <form onSubmit={handleSubmit} className="col-1">
          <div className="convo-input shadow col-2">
            <div className="search-icon">
              <label htmlFor="convo-message-input">
                <i className="text-shadow orange fas fa-comment"></i>
              </label>
            </div>
            <input
              autoFocus
              autoComplete="off"
              onChange={e => setCurrentMessage(e.target.value)}
              type="text"
              className="lora"
              name="currentMessage"
              value={currentMessage}
              id="convo-message-input"
              placeholder="send a message"
            />
            <button type="submit" className="send-message-button">
              <i className="text-shadow fas fa-arrow-circle-up"></i>
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

function MessageList({ messages, userId }) {
  if (messages.length < 1) return null;

  return (
    <>
      {messages.map(message => (
        <MessageItem key={message.messageId} info={message} userId={userId} />
      ))}
    </>
  );
}

function MessageItem({ info, userId }) {
  const { senderId, content, createdAt } = info;
  const type = userId === senderId ? 'sender' : 'recipient';
  const formattedDate = formatDate(createdAt);

  return (
    <>
      <div className="time-stamp-row row">
        <span className="time-stamp lora">{formattedDate}</span>
      </div>
      <div className={`${type}-txt-row row lora`}>
        <div className={`${type}-txt`}>
          <span className={type}>{content}</span>
        </div>
      </div>
    </>
  );
}
