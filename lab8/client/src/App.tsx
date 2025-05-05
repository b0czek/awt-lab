import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SocketProvider } from './contexts/SocketContext';
import Login from './components/Login';
import ChatRoom from './components/ChatRoom';
import { useSocket } from './contexts/SocketContext';

const PrivateRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { username } = useSocket();
  return username ? element : <Navigate to="/login" />;
};

const AppWithRouter: React.FC = () => {
  const { username } = useSocket();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={username ? <Navigate to="/" /> : <Login />} />
        <Route path="/" element={<PrivateRoute element={<ChatRoom />} />} />
      </Routes>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <SocketProvider>
      <AppWithRouter />
    </SocketProvider>
  );
};

export default App;