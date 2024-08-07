// import AgoraRTM from 'agora-rtm-sdk';
// import { v4 as uuidv4 } from 'uuid';

// const APP_ID = 'e6376b2eea3f4036905885e7d8f10eab';
// const CHANNEL = 'DeepWork';

// let client = AgoraRTM.createInstance(APP_ID);
// let uid = uuidv4();

// import React, { useEffect, useRef, useState } from 'react';

// export default function MessageRoom() {
//   const messagesRef = useRef();
//   const [messages, setMessages] = useState([]);
//   const [text, setText] = useState('');
//   const [channel, setChannel] = useState(null);

//   const appendMessage = (message) => {
//     setMessages((messages) => [...messages, message]);
//   };

//   useEffect(() => {
//     const connect = async () => {
//       await client.login({ uid, token: null });
//       const channel = await client.createChannel(CHANNEL);
//       await channel.join();
//       channel.on('ChannelMessage', (message, peerId) => {
//         appendMessage({
//           text: message.text,
//           uid: peerId,
//         });
//       });
//       setChannel(channel);
//       return channel;
//     };
//     const connection = connect();

//     return () => {
//       const disconnect = async () => {
//         const channel = await connection;
//         await channel.leave();
//         await client.logout();
//       };
//       disconnect();
//     };
//   }, []);

//   useEffect(() => {
//     messagesRef.current.scrollTop =
//       messagesRef.current.scrollHeight;
//   }, [messages]);

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (text === '') return;
//     channel.sendMessage({ text, type: 'text' });
//     appendMessage({
//       text: text,
//       uid,
//     });
//     setText('');
//   };

//   return (
//     <main>
//       <div className="panel">
//         <div className="messages" ref={messagesRef}>
//           <div className="inner">
//             {messages.map((message, idx) => (
//               <div key={idx} className="message">
//                 {message.uid === uid && (
//                   <div className="user-self">
//                     You:&nbsp;
//                   </div>
//                 )}
//                 {message.uid !== uid && (
//                   <div className="user-them">
//                     Them:&nbsp;
//                   </div>
//                 )}
//                 <div className="text">{message.text}</div>
//               </div>
//             ))}
//           </div>
//         </div>

//         <form onSubmit={sendMessage}>
//           <input
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//           />
//           <button>+</button>
//         </form>
//       </div>
//     </main>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { Container, Textarea, Button, List, ListItem, Text } from '@mantine/core';
import AgoraRTM from 'agora-rtm-sdk';

const APP_ID = 'e6376b2eea3f4036905885e7d8f10eab';

const CHANNEL_NAME = 'DeepWork'; 

export const MessageRoom = () => {
  const [client, setClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [uid] = useState(String(Math.floor(Math.random() * 10000))); // Generate a unique user ID
  const chatInputRef = useRef();

  useEffect(() => {
    const initClient = async () => {
      const client = AgoraRTM.createInstance(APP_ID);
      await client.login({ uid });

      const channel = client.createChannel(CHANNEL_NAME);
      await channel.join();

      channel.on('ChannelMessage', (message, memberId) => {
        setMessages((prevMessages) => [...prevMessages, { text: message.text, memberId }]);
      });

      setClient(client);
      setChannel(channel);
    };

    initClient();

    return () => {
      if (channel) channel.leave();
      if (client) client.logout();
    };
  }, [uid]);

  const handleSendMessage = async () => {
    if (message.trim() === '') return;

    await channel.sendMessage({ text: message });
    setMessages((prevMessages) => [...prevMessages, { text: message, memberId: uid }]);
    setMessage('');
    chatInputRef.current.focus();
  };

  return (
    <Container style={{ padding: '1rem', maxWidth: '600px', margin: 'auto', backgroundColor: '#2c2d2f', color: '#fff' }}>
      <Text size="xl" align="center" mb="md">Text</Text>
      <List spacing="xs" size="sm" center>
        {messages.map((msg, index) => (
          <ListItem key={index} style={{ padding: '0.5rem 0' }}>
            <Text size="sm" color={msg.memberId === uid ? 'blue' : 'gray'}>{msg.memberId}: {msg.text}</Text>
          </ListItem>
        ))}
      </List>
      <Textarea
        ref={chatInputRef}
        placeholder="Type your message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ marginTop: '1rem', backgroundColor: '#1a1b1e', color: '#fff' }}
      />
      <Button
        onClick={handleSendMessage}
        style={{ marginTop: '1rem' }}
      >
        Send
      </Button>
    </Container>
  );
};
