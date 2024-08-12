import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import './LoginScreen.css'; // Import the styling for the login screen

const LoginScreen = ({ onLogin }) => {
  const handleSuccess = (response) => {
    onLogin(response);
  };

  const handleError = (error) => {
    console.error("Login Failed:", error);
  };

  return (
    <div className="login-container">
      <h1>Welcome to Fantasy Football</h1>
      <p>Please log in to access the application.</p>
      <GoogleLogin 
        onSuccess={handleSuccess} 
        onError={handleError}
        text="signin_with" // Customize text as needed
      />
    </div>
  );
};

export default LoginScreen;
