import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Sidebar from './Sidebar';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useSocket } from '../contexts/SocketContext';
import { FiMenu } from 'react-icons/fi';

const ChatContainer = styled.div`
  display: flex;
  height: 100vh;
`;

const ChatArea = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

const ChatHeader = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #ddd;
  background-color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RoomTitle = styled.h2`
  color: #0084ff;
  margin: 0;
`;

const TypingIndicator = styled.div`
  font-style: italic;
  color: #65676b;
  font-size: 0.875rem;
`;

const WelcomeContainer = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background-color: #f0f2f5;
  text-align: center;
`;

const WelcomeTitle = styled.h2`
  color: #0084ff;
  margin-bottom: 1rem;
`;

const WelcomeText = styled.p`
  color: #65676b;
  max-width: 600px;
  line-height: 1.5;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #0084ff;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const SidebarWrapper = styled.div<{ $isOpen: boolean }>`
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.$isOpen ? '0' : '-100%'};
    top: 0;
    height: 100%;
    z-index: 1000;
    transition: left 0.3s ease-in-out;
  }
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.$isOpen ? 'block' : 'none'};
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;

const HeaderLeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const ChatRoom: React.FC = () => {
  const { currentRoom, typingUsers, username } = useSocket();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Close sidebar automatically on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    handleResize();
    
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth <= 768) {
      setSidebarOpen(false);
    }
  };

  const hasJoinedRoom = currentRoom !== '';

  return (
    <ChatContainer>
      <SidebarWrapper $isOpen={sidebarOpen}>
        <Sidebar />
      </SidebarWrapper>
      <Overlay $isOpen={sidebarOpen} onClick={closeSidebar} />
      <ChatArea>
        {hasJoinedRoom ? (
          <>
            <ChatHeader>
              <HeaderLeftSection>
                <MenuButton onClick={toggleSidebar}>
                  <FiMenu />
                </MenuButton>
                <RoomTitle>{currentRoom}</RoomTitle>
              </HeaderLeftSection>
              <TypingIndicator>
                {typingUsers.length > 0 && 
                  (typingUsers.length === 1 
                    ? `${typingUsers[0]} is typing...` 
                    : `${typingUsers.join(', ')} are typing...`)}
              </TypingIndicator>
            </ChatHeader>
            <MessageList />
            <MessageInput />
          </>
        ) : (
          <>
            <ChatHeader>
              <HeaderLeftSection>
                <MenuButton onClick={toggleSidebar}>
                  <FiMenu />
                </MenuButton>
                <RoomTitle>Chat App</RoomTitle>
              </HeaderLeftSection>
            </ChatHeader>
            <WelcomeContainer>
              <WelcomeTitle>Welcome, {username}!</WelcomeTitle>
              <WelcomeText>
                Select a room from the list on the left to start chatting.
                You can join an existing room or create a new one.
              </WelcomeText>
            </WelcomeContainer>
          </>
        )}
      </ChatArea>
    </ChatContainer>
  );
};

export default ChatRoom;