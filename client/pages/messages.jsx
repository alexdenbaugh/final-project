import React from 'react';
import AppContext from '../lib/app-context';
import GroupMessages from '../lib/group-messages';
import formatDate from '../lib/format-date';
import Redirect from '../components/redirect';

export default class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null
    };
    this.renderView = this.renderView.bind(this);
  }

  componentDidMount() {
    const { userId } = this.context.user;
    if (!userId) {
      return null;
    } else {
      fetch(`/api/messages/${userId}`)
        .then(response => response.json())
        .then(messages => {
          this.setState({ messages });
        });
    }
  }

  renderView() {
    const { userId } = this.context.user;
    const { messages } = this.state;
    if (messages.length === 0) {
      return (
        <div className="row no-messages">
          <h2>You have no messages.</h2>
        </div>
      );
    }
    return (
      <MessageList messageList={GroupMessages(messages, userId)} userId={userId} />
    );
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    const { messages } = this.state;
    if (!messages) {
      return null;
    }
    return (
      <>
        <div className="row messages-title">
          <div className="col-4 bookmark title shadow">
            <h1 className="text-shadow orange">Messages</h1>
          </div>
        </div>
        {this.renderView()}
      </>
    );
  }
}

Messages.contextType = AppContext;

function MessageList(props) {
  if (props.messageList.length < 1) {
    return (<></>);
  } else {
    const $messageList = props.messageList.map(message => {
      return (
        <MessageItem key={message[0].messageId} info={message[0]} userId={props.userId} />
      );
    });
    return (
      <div className="message-list-container shadow">
        { $messageList}
      </div>
    );
  }
}

function MessageItem(props) {
  let {
    info: {
      senderId,
      senderName,
      lenderName,
      content,
      recipientId,
      postId,
      createdAt
    },
    userId
  } = props;
  const otherId = userId === senderId
    ? recipientId
    : senderId;
  createdAt = formatDate(createdAt);
  if (content.length > 20) {
    content = `${content.slice(0, 20)}...`;
  }
  return (
    <a href={`#convo?id=${otherId}?post=${postId}`} className="message-list-item shadow">
      <div className="message-list-item-text">
        <div className="message-list-item-name">
          <h3 className=" text-shadow lora">
            {
              userId === senderId
                ? lenderName
                : senderName
            }
          </h3>
        </div>
        <div className="message-list-item-note">
          <span className="lora">{content}</span>
        </div>
      </div>
      <div className="message-list-item-di">
        <div className="message-list-item-date">
          <h3 className="lora">{createdAt}</h3>
        </div>
        <div className="message-list-item-icon">
          <i className="text-shadow fas fa-chevron-right"></i>
        </div>
      </div>
    </a>
  );
}
