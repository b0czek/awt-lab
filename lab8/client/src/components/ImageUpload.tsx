import React, { useState } from 'react';
import styled from 'styled-components';
import { FiX, FiUpload } from 'react-icons/fi';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios'; 

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 10px;
  padding: 1.5rem;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h3`
  margin: 0;
  color: #0084ff;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #65676b;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UploadArea = styled.div`
  border: 2px dashed #ddd;
  border-radius: 5px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 1rem;
  cursor: pointer;
  transition: border-color 0.2s;

  &:hover {
    border-color: #0084ff;
  }
`;

const PreviewContainer = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 5px;
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const Button = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;

  &:hover {
    background-color: #0066cc;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const UploadIcon = styled(FiUpload)`
  margin-right: 0.5rem;
`;

interface ImageUploadProps {
  onClose: () => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { sendImage } = useSocket();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      setError('The image is too large. Maximum size is 10MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('The selected file is not an image.');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    const file = e.dataTransfer.files[0];
    
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError('The image is too large. Maximum size is 10MB.');
      return;
    }
    
    if (!file.type.startsWith('image/')) {
      setError('The selected file is not an image.');
      return;
    }
    
    setSelectedFile(file);
    setError(null);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('image', selectedFile);
      
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      const { filePath } = response.data;
      
      sendImage(filePath);
      
      onClose();
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('An error occurred while uploading the image.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <Title>Send image</Title>
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        
        <UploadArea
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input')?.click()}
        >
            <p>Drag and drop an image or click to select a file</p>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          
          {preview && (
            <PreviewContainer>
              <ImagePreview src={preview} alt="Preview" />
            </PreviewContainer>
          )}
        </UploadArea>
        
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile || isUploading}
        >
          <UploadIcon />
          {isUploading ? 'Uploading...' : 'Send'}
        </Button>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ImageUpload;