import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { IRoom, IMessage } from '../types';

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  username: string;
  currentRoom: string;
  rooms: IRoom[];
  messages: IMessage[];
  typingUsers: string[];
  loginError: string;
  setUsername: (name: string) => void;
  login: (username: string) => void;
  joinRoom: (roomName: string) => void;
  setCurrentRoom: (room: string) => void;
  sendMessage: (text: string) => void;
  sendImage: (imagePath: string) => void;
  createRoom: (roomName: string) => void;
  deleteRoom: (roomName: string) => void;
  startTyping: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('');
  const [rooms, setRooms] = useState<IRoom[]>([]);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('login_success', (username: string) => {
      setUsername(username);
      setLoginError('');
    });

    socket.on('login_error', (error: string) => {
      setLoginError(error);
    });

    socket.on('room_list', (roomList: IRoom[]) => {
      setRooms(roomList);
    });

    socket.on('new_room', (room: IRoom) => {
      setRooms(prev => [...prev, room]);
    });

    socket.on('room_deleted', (roomName: string) => {
      setRooms(prev => prev.filter(room => room.name !== roomName));
    });
    
    socket.on('current_room_deleted', () => {
      setCurrentRoom('');
      setMessages([]);
    });


    socket.on('message_history', (messageHistory: IMessage[]) => {
      setMessages(messageHistory);
    });

    socket.on('new_message', (message: IMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('new_image', (message: IMessage) => {
      setMessages(prev => [...prev, message]);
    });

    socket.on('typing_status', (users: string[]) => {
      setTypingUsers(users);
    });

    socket.on('user_joined', (user: string) => {
      const joinMessage: IMessage = {
        room: currentRoom,
        user: 'system',
        text: `${user} joined the room`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, joinMessage]);
    });

    socket.on('user_left', (user: string) => {
      const leaveMessage: IMessage = {
        room: currentRoom,
        user: 'system',
        text: `${user} left the room`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, leaveMessage]);
    });

    return () => {
      socket.off('login_success');
      socket.off('login_error');
      socket.off('room_list');
      socket.off('new_room');
      socket.off('room_deleted');
      socket.off('current_room_deleted');
      socket.off('message_history');
      socket.off('new_message');
      socket.off('new_image');
      socket.off('typing_status');
      socket.off('user_joined');
      socket.off('user_left');
    };
  }, [socket, currentRoom]);

  const login = (username: string) => {
    if (socket) {
      socket.emit('login', username);
    }
  };

  const joinRoom = (roomName: string) => {
    if (socket) {
      setCurrentRoom(roomName);
      socket.emit('join_room', roomName);
    }
  };

  const sendMessage = (text: string) => {
    if (socket && text.trim()) {
      socket.emit('send_message', { room: currentRoom, text });
    }
  };

  const sendImage = (imagePath: string) => {
    if (socket) {
      socket.emit('send_image', { room: currentRoom, imagePath });
    }
  };

  const createRoom = (roomName: string) => {
    if (socket && roomName.trim()) {
      socket.emit('create_room', roomName);
    }
  };

  const deleteRoom = (roomName: string) => {
    if (socket) {
      socket.emit('delete_room', roomName);
    }
  };

  const startTyping = () => {
    if (socket) {
      socket.emit('typing', currentRoom);
    }
  };

  const value = {
    socket,
    isConnected,
    username,
    setUsername,
    currentRoom,
    setCurrentRoom,
    rooms,
    messages,
    typingUsers,
    loginError,
    login,
    joinRoom,
    sendMessage,
    sendImage,
    createRoom,
    deleteRoom,
    startTyping
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};