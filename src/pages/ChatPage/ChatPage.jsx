import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import styles from './ChatPage.module.css';

function ChatPage() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const username = params.get('username');
  const room = params.get('room');

  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState('');
  const [typingUser, setTypingUser] = useState(null);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("wss://chat-backend-gxla.onrender.com");

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'join', username, room }));
    };

    socket.onmessage = event => {
      const msg = JSON.parse(event.data);

      if (msg.type === 'message') {
        setMessages(prev => [...prev, msg]);
      }

      if (msg.type === 'typing') {
        setTypingUser(msg.username);
        setTimeout(() => setTypingUser(null), 3000);
      }

      if (msg.type === 'users') {
        setUsers(msg.users);
      }
    };

    setWs(socket);

    return () => socket.close();
  }, [room, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() && ws) {
      ws.send(JSON.stringify({ type: 'message', text: message }));
      setMessage('');
    }
  };

  const handleTyping = () => {
    if (ws) {
      ws.send(JSON.stringify({ type: 'typing' }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.chatWrapper}>
        <div className={styles.usersBox}>
          <h3>Онлайн:</h3>
          <ul className={styles.usersList}>
            {users.map((user, i) => (
              <li key={i}>{user}</li>
            ))}
          </ul>
        </div>

        <div className={styles.chatContent}>
          <h2>Чат: {room}</h2>

          <div className={styles.chatBox}>
            {messages.map((msg, i) => (
              <p key={i}>
                <strong style={{ color: '#00ff41' }}>{msg.username}:</strong>{' '}
                {msg.text}
              </p>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className={styles.typingBox}>
            <p className={styles.typingText}>
              {typingUser ? `${typingUser} друкує...` : ''}
            </p>
          </div>

          <div style={{ maxWidth: '300px', width: '100%' }}>
            <input
              className={styles.inputField}
              type='text'
              placeholder='Введіть повідомлення...'
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => {
                handleTyping();
                if (e.key === 'Enter') sendMessage();
              }}
            />
            <button className={styles.sendButton} onClick={sendMessage}>
              Надіслати
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
