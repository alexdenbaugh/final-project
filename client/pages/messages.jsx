import React from 'react';
import AppContext from '../lib/app-context';
import GroupMessages from '../lib/group-messages';

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

    return (
      <div className="message-list-container">
        <MessageList messageList={GroupMessages(this.state.messages)} userId={this.context.user.userId} />
      </div>
    );
  }

  render() {
    const { messages } = this.state;
    // console.log('messages in render', messages)
    if (!messages) {
      return null;
    }
    return (
      <>
        {this.renderView()}
      </>
    );
  }
}

Messages.contextType = AppContext;

function MessageList(props) {
  // console.log('Listing', props)
  if (props.messageList.length < 1) {
    return (<></>);
  } else {
    const $messageList = props.messageList.map(message => {
      return (
        <MessageItem key={message.messageId} info={message} user={props.userId} />
      );
    });
    return (
      <div className="row row-2 post-list">
        { $messageList}
      </div>
    );
  }
}

function MessageItem(props) {
  const {
    info: {
      senderId,
      senderName,
      // recipientId,
      lenderName,
      content,
      // postId,
      createdAt
    },
    userId
  } = props;
  return (
    <a href="#messages" className="message-list-item shadow">
      <div>
        <div>
          <h3 className="lora">
            {
              userId === senderId
                ? lenderName
                : senderName
            }
          </h3>
        </div>
        <div>
          <span className="lora">{content}</span>
        </div>
      </div>
      <div>
        <h3 className="lora">{createdAt}</h3>
      </div>
      <div>
        <i className="fas fa-chevron-right"></i>
      </div>
    </a>
  );
}
