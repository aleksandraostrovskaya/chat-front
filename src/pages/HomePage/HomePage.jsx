import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './HomePage.module.css';

function HomePage() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const navigate = useNavigate();

  const joinChat = () => {
    if (username.trim() && room.trim()) {
      navigate(`/chat?username=${username}&room=${room}`);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.typeText}>Вхід в чат</h2>
        <input
          className={styles.input}
          type='text'
          placeholder="Ваше ім'я"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className={styles.input}
          type='text'
          placeholder='Назва кімнати'
          value={room}
          onChange={e => setRoom(e.target.value)}
        />
        <button className={styles.button} onClick={joinChat}>Увійти</button>
      </div>
    </div>
  );
}

export default HomePage;
