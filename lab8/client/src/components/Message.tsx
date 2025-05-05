import React from 'react';
import styled from 'styled-components';
import DOMPurify from 'dompurify';
import { IMessage } from '../types';

const MessageContainer = styled.div<{ $isOwnMessage: boolean }>`
  margin-bottom: 1rem;
  max-width: 70%;
  display: flex;
  flex-direction: column;
  align-items: ${props => props.$isOwnMessage ? 'flex-end' : 'flex-start'};
  align-self: ${props => props.$isOwnMessage ? 'flex-end' : 'flex-start'};
  margin-left: ${props => props.$isOwnMessage ? 'auto' : '0'};
  margin-right: ${props => props.$isOwnMessage ? '0' : 'auto'};
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.3125rem;
  font-size: 0.75rem;
  padding: 0 0.5rem;
`;

const MessageContent = styled.div`
  word-wrap: break-word;
  font-size: 1rem;
  line-height: 1.4;
  
  /* Style dla emoji */
  .emoji {
    font-size: 1.4em;
    line-height: 1;
    vertical-align: middle;
    margin: 0 0.05em;
  }
`;

const Username = styled.span`
  font-weight: bold;
  color: #0084ff;
  margin-right: 0.5rem;
`;

const Timestamp = styled.span`
  color: #65676b;
`;

const MessageBubble = styled.div<{ $isOwnMessage: boolean }>`
  padding: 0.625rem 0.9375rem;
  background-color: ${props => props.$isOwnMessage ? '#0084ff' : 'white'};
  color: ${props => props.$isOwnMessage ? 'white' : 'black'};
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  word-wrap: break-word;
  max-width: 100%;
`;

const MessageImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 10px;
  cursor: pointer;
`;

interface MessageProps {
  message: IMessage;
  $isOwnMessage: boolean;
}

const Message: React.FC<MessageProps> = ({ message, $isOwnMessage }) => {
  const { user, text, image, timestamp } = message;
  const formattedTime = new Date(timestamp).toLocaleTimeString();
  
  const formatText = (text: string) => {
    if (!text) return '';
    
    let formattedText = text.replace(
      /(https?:\/\/[^\s]+)/g, 
      '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    
    formattedText = formattedText
      .replace(/:\)/g, '😊')
      .replace(/:\(/g, '😢')
      .replace(/:D/g, '😃')
      .replace(/;\)/g, '😉');
    
    formattedText = formattedText.replace(
        /([\u{1F300}-\u{1F6FF}]|[\u{1F900}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu,
        '<span class="emoji">$1</span>'
      );
      
    
    return DOMPurify.sanitize(formattedText);
  };
  
  const handleImageClick = (imagePath: string) => {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';
    modal.style.cursor = 'pointer';
    
    const modalImg = document.createElement('img');
    modalImg.src = `http://localhost:3001${imagePath}`;
    modalImg.style.maxWidth = '90%';
    modalImg.style.maxHeight = '90%';
    
    modal.appendChild(modalImg);
    document.body.appendChild(modal);
    
    modal.addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  };

  return (
    <MessageContainer $isOwnMessage={$isOwnMessage}>
      <MessageHeader>
        <Username>{user}</Username>
        <Timestamp>{formattedTime}</Timestamp>
      </MessageHeader>
      <MessageBubble $isOwnMessage={$isOwnMessage}>
        {text && (
          <MessageContent dangerouslySetInnerHTML={{ __html: formatText(text) }} />
        )}
        {image && (
          <MessageImage 
            src={`http://localhost:3001${image}`} 
            alt={`Zdjęcie od ${user}`} 
            onClick={() => handleImageClick(image)}
          />
        )}
      </MessageBubble>
    </MessageContainer>
  );
};

export default Message;