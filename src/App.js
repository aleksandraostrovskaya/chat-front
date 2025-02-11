import './App.css';
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from './pages/HomePage/HomePage'
import ChatPage from './pages/ChatPage/ChatPage'


function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />}/>
          <Route path="/chat" element={<ChatPage />}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
