import React, { useState } from 'react';
import styled from 'styled-components';
import { useSocket } from '../contexts/SocketContext';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginForm = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  margin-bottom: 1.5rem;
  color: #0084ff;
  text-align: center;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0084ff;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0066cc;
  }
`;

const ErrorMessage = styled.p`
  color: #ff3b30;
  margin-top: 0.5rem;
  font-size: 0.875rem;
`;

const Login: React.FC = () => {
  const [inputUsername, setInputUsername] = useState('');
  const { login, loginError } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputUsername.trim().length >= 3) {
      login(inputUsername.trim());
    }
  };

  return (
    <LoginContainer>
      <LoginForm>
        <Title>Chat</Title>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Enter your username"
            value={inputUsername}
            onChange={(e) => setInputUsername(e.target.value)}
            minLength={3}
            required
          />
          <Button type="submit">Join the chat</Button>
          {loginError && <ErrorMessage>{loginError}</ErrorMessage>}
        </form>
      </LoginForm>
    </LoginContainer>
  );
};

export default Login;