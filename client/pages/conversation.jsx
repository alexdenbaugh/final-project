import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
import formatDate from '../lib/format-date';

export default class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      currentMessage: '',
      intervalId: null
    };
    this.requests = new Set();
    this.messageContainer = React.createRef();
    this.renderView = this.renderView.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSend = this.handleSend.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  componentDidMount() {
    if (!this.context.user) {
      return null;
    }
    this.refresh();
    this.setState({ intervalId: setInterval(this.refresh, 3000) });
  }

  componentDidUpdate() {
    if (!this.context.user) {
      return null;
    }
    const element = this.messageContainer.current;
    element.scrollTop = element.scrollHeight;
  }

  componentWillUnmount() {
    clearInterval(this.state.intervalId);
    this.requests.forEach(req => req.abort());
  }

  refresh() {
    const { otherId } = this.props;
    const token = window.localStorage.getItem('phoenix-games-jwt');
    const requestController = new AbortController();
    this.requests.add(requestController);
    const { signal } = requestController;
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('phoenix-games-jwt', token);
    const init = {
      headers: header,
      signal
    };
    fetch(`/api/message/convo/${otherId}`, init)
      .then(response => response.json())
      .then(messages => {
        if (signal.aborted) return;
        if (!messages.length) {
          window.location.hash = 'messages';
        }
        this.setState({ messages });
      })
      .catch(() => { })
      .finally(() => this.requests.delete(requestController));
  }

  handleChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleSend(event) {
    event.preventDefault();
    if (!this.state.currentMessage) {
      return null;
    }
    const { currentMessage } = this.state;
    const { otherId, postId } = this.props;
    const { username } = this.context.user;
    const token = window.localStorage.getItem('phoenix-games-jwt');
    const requestController = new AbortController();
    this.requests.add(requestController);
    const { signal } = requestController;
    const header = new Headers();
    header.append('Content-Type', 'application/json');
    header.append('phoenix-games-jwt', token);
    let body = {
      senderName: username,
      recipientId: otherId,
      content: currentMessage,
      postId
    };
    body = JSON.stringify(body);
    const init = {
      method: 'POST',
      headers: header,
      body: body,
      signal
    };
    fetch('/api/messages', init)
      .then(response => response.json())
      .then(message => {
        if (signal.aborted) return;
        this.setState({ currentMessage: '' }, this.refresh);
      })
      .catch(() => { })
      .finally(() => this.requests.delete(requestController));
  }

  renderView() {
    const { userId } = this.context.user;
    const { messages } = this.state;
    return (
      <div className="conversation-container">
        <div className="convo-list-container" ref={this.messageContainer}>
          {
            messages.length
              ? <MessageList messages={messages} userId={userId} />
              : <h2>Loading Messages...</h2>
          }
        </div>
        { Boolean(messages.length) &&
          <form onSubmit={this.handleSend} className="row row-2 conversation-write-container">
            <div className="convo-input shadow col-2">
              <div className="search-icon">
                <label htmlFor="convo-message-input"><i className="text-shadow orange fas fa-comment"></i></label>
              </div>
              <input autoFocus autoComplete="off" onChange={this.handleChange} type="text" className="lora" name='currentMessage' value={this.state.currentMessage} id="convo-message-input" placeholder="send a message" />
              <button type="submit" className="send-message-button" ><i className="text-shadow fas fa-arrow-circle-up"></i></button>
            </div>
          </form>
          }
      </div>
    );
  }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    const { messages } = this.state;
    const { userId } = this.context.user;
    let name;
    if (!messages.length) {
      name = '';
    } else if (messages[0].senderId === userId) {
      name = messages[0].lenderName;
    } else {
      name = messages[0].senderName;
    }
    return (
      <>
        <div className="row">
          { Boolean(messages.length) &&
            <div className="col-1 convo-header shadow">
              <h2 className="text-shadow orange">{name}</h2>
            </div>
          }
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
      <>
        {$messages}
      </>
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
