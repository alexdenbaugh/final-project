import React from 'react';
import Redirect from '../components/redirect';
import AppContext from '../lib/app-context';
// import formatDate from '../lib/format-date';

export default class Conversation extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     messages: null,
  //     currentMessage: ''
  //   };
  //   // this.handleChange = this.handleChange.bind(this);
  //   // this.handleSend = this.handleSend.bind(this);
  // }

  // componentDidMount() {
  //   let { otherId } = this.props;
  //   let { userId } = this.context.user
  //   fetch(`/api/message/convo/${userId}/${otherId}`)
  //     .then(response => response.json())
  //     .then(messages => this.setState({ messages }));
  // }

  // handleChange(event) {
  //   const { name, value } = event.target;
  //   this.setState({ [name]: value });
  // }

  // handleSend(event) {
  //   event.preventDefault();
  //   const { messages, currentMessage } = this.state;
  //   const { postId, user: { userId, username } } = this.props;
  //   const header = new Headers();
  //   header.append('Content-Type', 'application/json');
  //   let body = {
  //     senderId: userId,
  //     senderName: username,
  //     recipientId: post.lenderId,
  //     content: currentMessage,
  //     postId
  //   };
  //   body = JSON.stringify(body);
  //   const init = {
  //     method: 'POST',
  //     headers: header,
  //     body: body
  //   };
  //   fetch('/api/messages', init)
  //     .then(response => response.json())
  //     .then(message => {
  //       this.setState({ currentMessage: null,  });
  //     });
  // }

  // renderView() {
  //   const { userId } = this.context.user;
  //   const { messages } = this.state;
  //   if (messages.length === 0) {
  //     return (
  //       <div className="row no-messages">
  //         <h2>You have no messages.</h2>
  //       </div>
  //     )
  //   }
  //   return (
  //     <MessageList messages={messages} userId={userId} />
  //   );
  // }

  render() {
    if (!this.context.user) return <Redirect to="sign-in" />;
    // if (!this.state.messages) {
    //   return null;
    // }
    // const { messages } = this.state;
    // const { userId } = this.context.user;
    // let name;
    // if (messages[0].senderId === userId) {
    //   name = messages[0].recipientId;
    // }
    return (
      <>
        {/* <div className="row">
          <div className="col-1 post-info-game shadow">
            <h1 className="text-shadow orange">{name}</h1>
          </div>
        </div>
        {this.renderView()} */}
      </>
    );
  }
}

Conversation.contextType = AppContext;

// function MessageList(props) {
//   if (props.messages.length < 1) {
//     return (<></>);
//   } else {
// let $messages = props.messages.map(message => {
//   return (
//     <MessageItem key={message.messageId} info={message} userId={props.userId} />
//   );
// });
// return (
//   <>
// {/* <div className="message-list-container shadow">
//   {$messages}
// </div>
// <div className="row row-2 post-search-bar">
//   <div className="search-input shadow col-2">
//     <div className="search-icon">
//       <label htmlFor="convo-message-input"><i class="orange fas fa-comment"></i></label>
//     </div>
//     <input autoFocus autoComplete="off" onKeyUp={this.handleType} type="text" className="lora" name='currentMessage' value={this.state.currentMessage} id="convo-message-input" placeholder="send a message" />
//   </div>
//   <button type="submit" className="send-button" onSubmit={handleSend}></button>
// </div> */}
// </>
//     );
//   }
// }

// function MessageItem(props) {
//   let {
//     info: {
//       senderId,
//       senderName,
//       lenderName,
//       content,
//       recipientId,
//       createdAt
//     },
//     userId
//   } = props;
//   let type;
//   if (userId === senderId) {
//     type = 'sender'
//   } else {
//     type = 'recipient'
//   }

//   createdAt = formatDate(createdAt);

//   return (
//     <div className="row txt">
//       <span className={type}> {content} </span>
//     </div>
//   );
// }
