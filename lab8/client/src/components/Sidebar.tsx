import React, { useState } from 'react';
import styled from 'styled-components';
import { FiTrash2, FiPlus } from 'react-icons/fi';
import { useSocket } from '../contexts/SocketContext';

const SidebarContainer = styled.div`
  width: 250px;
  background-color: #f5f7fa;
  border-right: 1px solid #ddd;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  height: 100%;
  
  @media (max-width: 768px) {
    width: 85%;
    max-width: 300px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }
`;

const Title = styled.h2`
  margin-bottom: 1rem;
  color: #0084ff;
`;

const RoomList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex-grow: 1;
  overflow-y: auto;
`;

const CreateRoomForm = styled.div`
  display: flex;
  margin-top: 1rem;
  width: 100%;
  max-width: 100%;
`;

const RoomInput = styled.input`
  flex: 1;
  min-width: 0; 
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px 0 0 5px;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const AddButton = styled.button`
  padding: 0.5rem 0.75rem;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 0 5px 5px 0;
  cursor: pointer;
`;

const UserInfo = styled.div`
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #ddd;
  font-size: 0.875rem;
`;

const NoRoomsMessage = styled.p`
  color: #65676b;
  font-style: italic;
  padding: 0.625rem;
  text-align: center;
`;


const RoomItemContainer = styled.div<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.625rem 0.9375rem;
  margin-bottom: 0.3125rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  background-color: ${props => props.$active ? '#e6f2ff' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.$active ? '#e6f2ff' : '#e4e6eb'};
  }
`;

const RoomName = styled.span<{ $active: boolean }>`
  flex-grow: 1;
  font-weight: ${props => props.$active ? 'bold' : 'normal'};
  color: ${props => props.$active ? '#0084ff' : 'inherit'};
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #65676b;
  cursor: pointer;
  padding: 0.25rem;
  margin-left: 0.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
  transition: all 0.2s;
  
  &:hover {
    opacity: 1;
    color: #ff3b30;
    background-color: rgba(255, 59, 48, 0.1);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const ConfirmationModal = styled.div`
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
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin-bottom: 1rem;
  color: #ff3b30;
`;

const ModalText = styled.p`
  margin-bottom: 1.5rem;
  line-height: 1.5;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const CancelButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #f0f2f5;
  color: #65676b;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 0.5rem;
  
  &:hover {
    background-color: #e4e6eb;
  }
`;

const ConfirmButton = styled.button`
  padding: 0.5rem 1rem;
  background-color: #ff3b30;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  
  &:hover {
    background-color: #e02d26;
  }
`;

const Sidebar: React.FC = () => {
  const { rooms, currentRoom, joinRoom, createRoom, deleteRoom, username } = useSocket();
  const [newRoomName, setNewRoomName] = useState('');
  const [roomToDelete, setRoomToDelete] = useState<string | null>(null);

  const handleCreateRoom = () => {
    if (newRoomName.trim().length >= 2) {
      createRoom(newRoomName.trim());
      setNewRoomName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateRoom();
    }
  };
  const handleDeleteClick = (e: React.MouseEvent, roomName: string) => {
    e.stopPropagation(); 
    setRoomToDelete(roomName);
  };

  const confirmDelete = () => {
    if (roomToDelete) {
      deleteRoom(roomToDelete);
      setRoomToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRoomToDelete(null);
  };

  return (
    <SidebarContainer>
      <Title>Rooms</Title>
      <RoomList>
        {rooms.length === 0 ? (
          <NoRoomsMessage>Loading rooms...</NoRoomsMessage>
        ) : (
          rooms.map(room => (
            <RoomItemContainer
              key={room._id || room.name}
              $active={currentRoom === room.name}
              onClick={() => joinRoom(room.name)}
            >
              <RoomName $active={currentRoom === room.name}>
                {room.name}
              </RoomName>
              <DeleteButton 
                onClick={(e) => handleDeleteClick(e, room.name)}
                title={'Delete room'}
              >
                <FiTrash2 size={16} />
              </DeleteButton>
            </RoomItemContainer>
          ))
        )}
      </RoomList>
      <CreateRoomForm>
        <RoomInput
          type="text"
          placeholder="Room name"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <AddButton onClick={handleCreateRoom} title="Add new room">
          <FiPlus size={16} />
        </AddButton>
      </CreateRoomForm>
      <UserInfo>
        Logged in as: <strong>{username}</strong>
      </UserInfo>
      
      {/* Delete confirmation modal */}
      {roomToDelete && (
        <ConfirmationModal onClick={cancelDelete}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalTitle>Delete room?</ModalTitle>
            <ModalText>
              Are you sure you want to delete room "{roomToDelete}"? 
              This action is irreversible and will delete all messages in this room.
            </ModalText>
            <ModalButtons>
              <CancelButton onClick={cancelDelete}>Cancel</CancelButton>
              <ConfirmButton onClick={confirmDelete}>Delete</ConfirmButton>
            </ModalButtons>
          </ModalContent>
        </ConfirmationModal>
      )}
    </SidebarContainer>
  );
};


export default Sidebar;