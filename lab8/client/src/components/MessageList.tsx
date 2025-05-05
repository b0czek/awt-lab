import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import Message from './Message';
import { useSocket } from '../contexts/SocketContext';

const MessagesContainer = styled.div`
  flex-grow: 1;
  padding: 1rem;
  overflow-y: auto;
  background-color: #f0f2f5;
`;

const Notification = styled.div`
  text-align: center;
  margin: 0.625rem 0;
  color: #65676b;
  font-style: italic;
  font-size: 0.875rem;
`;

const MessageList: React.FC = () => {
  const { messages, username } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <MessagesContainer>
      {messages.map((message, index) => {
        if (message.user === 'system') {
          return (
            <Notification key={message._id || index}>
              {message.text}
            </Notification>
          );
        }
        
        return (
          <Message
            key={message._id || index}
            message={message}
            $isOwnMessage={message.user === username}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </MessagesContainer>
  );
};

export default MessageList;