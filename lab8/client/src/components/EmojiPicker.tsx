import React from 'react';
import styled from 'styled-components';
import Picker from 'emoji-picker-react';
import { EmojiClickData } from 'emoji-picker-react';

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 70px;
  left: 20px;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
`;

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiClick, onClose }) => {
  const handleClickOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiClick(emojiData.emoji);
  };

  return (
    <EmojiPickerContainer onClick={handleClickOutside}>
      <Picker 
        onEmojiClick={handleEmojiClick} 
        lazyLoadEmojis={true}
        searchPlaceHolder="Search for emojis..."
        previewConfig={{ showPreview: false }}
      />
    </EmojiPickerContainer>
  );
};

export default EmojiPicker;