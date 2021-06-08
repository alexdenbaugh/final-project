import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import formatDate from '../lib/format-date';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: null,
      currentMessage: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
  }

  componentDidMount() {
    const { otherId } = this.props;
    const { userId } = this.context.user;
    fetch(`/api/message/convo/${userId}/${otherId}`)
      .then(response => response.json())
      .then(messages => this.setState({ messages }));
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSend(event) {
    event.preventDefault();
    // const { messages, currentMessage } = this.state;
    // const { otherId } = this.props;
    // const { userId, username } = this.props
    // const header = new Headers();
    // header.append('Content-Type', 'application/json');
    // let body = {
    //   senderId: userId,
    //   senderName: username,
    //   recipientId: otherId,
    //   content: currentMessage,
    //   postId
    // };
    // body = JSON.stringify(body);
    // const init = {
    //   method: 'POST',
    //   headers: header,
    //   body: body
    // };
    // fetch('/api/messages', init)
    //   .then(response => response.json())
    //   .then(message => {
    //     this.setState({ currentMessage: null,  });
    //   });
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
      <div className="conversation-container">
        <MessageList messages={messages} userId={userId} />
        <form onSubmit={this.handleSend} className="row row-2 conversation-write-container">
          <div className="convo-input shadow col-2">
            <div className="search-icon">
              <label htmlFor="convo-message-input"><i className="text-shadow orange fas fa-comment"></i></label>
            </div>
            <input autoFocus autoComplete="off" onChange={this.handleChange} type="text" className="lora" name='currentMessage' value={this.state.currentMessage} id="convo-message-input" placeholder="send a message" />
            <button type="submit" className="send-message-button" ><i className="text-shadow fas fa-arrow-circle-up"></i></button>
          </div>
        </form>
      </div>
    );
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    if (!this.state.messages) {
      return null;
    }
    const { messages } = this.state;
    const { userId } = this.context.user;
    let name;
    if (messages[0].senderId === userId) {
      name = messages[0].lenderName;
    } else {
      name = messages[0].senderName;
    }
    return (
      <>
        <div className="row">
          <div className="col-1 convo-header shadow">
            <h2 className="text-shadow orange">{name}</h2>
          </div>
        </div>
        {this.renderView()}
      </>
    );
  }
}

Conversation.contextType = AppContext;

function MessageList(props) {
  if (props.messages.length < 1) {
    return (<></>);
  } else {
    const $messages = props.messages.map(message => {
      return (
        <MessageItem key={message.messageId} info={message} userId={props.userId} />
      );
    });
    return (
      <div className="convo-list-container">
        {$messages}
      </div>
    );
  }
}

function MessageItem(props) {
  let {
    info: {
      senderId,
      content,
      createdAt
    },
    userId
  } = props;
  let type;
  if (userId === senderId) {
    type = 'sender';
  } else {
    type = 'recipient';
  }

  createdAt = formatDate(createdAt);

  return (
    <>
      <div className="time-stamp-row row">
        <span className="time-stamp lora">{createdAt}</span>
      </div>
      <div className={`${type}-txt-row row lora`}>
        <div className={`${type}-txt`}>
          <span className={type}> {content} </span>
        </div>
      </div>
    </>
  );
}
