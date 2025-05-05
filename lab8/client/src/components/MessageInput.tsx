import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import { FiSend, FiImage, FiSmile } from 'react-icons/fi';
import { useSocket } from '../contexts/SocketContext';
import ImageUpload from './ImageUpload';
import EmojiPicker from './EmojiPicker';

const InputContainer = styled.div`
  padding: 1rem;
  background-color: white;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  position: relative;
`;

const TextArea = styled.textarea`
  flex-grow: 1;
  padding: 0.625rem 0.9375rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  margin-right: 0.625rem;
  resize: none;
  height: 40px;
  max-height: 120px;
  overflow-y: auto;
  font-family: inherit;
  font-size: 1rem;

  scrollbar-width: none;
  -ms-overflow-style: none; 
  
  &::-webkit-scrollbar {
    display: none;
  }
    

  &:focus {
    outline: none;
    border-color: #0084ff;
  }
`;

const SendButton = styled.button`
  padding: 0.5rem 0.9375rem;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0066cc;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: #0084ff;
  font-size: 1.5rem;
  cursor: pointer;
  margin-right: 0.625rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #0066cc;
  }
`;

const MessageInput: React.FC = () => {
  const [message, setMessage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { sendMessage, startTyping } = useSocket();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSend = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage('');
      
      if (textAreaRef.current) {
        textAreaRef.current.style.height = '40px';
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    startTyping();
    
    const textarea = e.target;
    textarea.style.height = '40px';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  };

  const handleEmojiClick = (emoji: string) => {
    if (textAreaRef.current) {
      const start = textAreaRef.current.selectionStart;
      const end = textAreaRef.current.selectionEnd;
      const newMessage = message.substring(0, start) + emoji + message.substring(end);
      setMessage(newMessage);
      
      setTimeout(() => {
        if (textAreaRef.current) {
          textAreaRef.current.selectionStart = start + emoji.length;
          textAreaRef.current.selectionEnd = start + emoji.length;
          textAreaRef.current.focus();
        }
      }, 10);
    } else {
      setMessage(prev => prev + emoji);
    }
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(prev => !prev);
  };

  return (
    <>
      {showImageUpload && (
        <ImageUpload onClose={() => setShowImageUpload(false)} />
      )}
      <InputContainer ref={containerRef}>
        <IconButton 
          type="button" 
          onClick={() => setShowImageUpload(true)}
          title="Send image"
        >
          <FiImage />
        </IconButton>
        <IconButton 
          type="button" 
          onClick={toggleEmojiPicker}
          title="Emoji"
        >
          <FiSmile />
        </IconButton>
        <TextArea
          ref={textAreaRef}
          value={message}
          onChange={handleInput}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
        />
        <SendButton 
          onClick={handleSend} 
          disabled={!message.trim()}
        >
          <FiSend />
        </SendButton>
        
        {showEmojiPicker && (
          <EmojiPicker 
            onEmojiClick={handleEmojiClick} 
            onClose={() => setShowEmojiPicker(false)} 
          />
        )}
      </InputContainer>
    </>
  );
};

export default MessageInput;