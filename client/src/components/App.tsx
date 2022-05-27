import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './auth/Login';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import { MatchesProvider } from './matches/provider';
import { ConversationsProvider } from './conversations/provider';
import { SocketProvider } from './socket/provider';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    const [userId, setUserId] = useLocalStorage('userId');
    const [userName, setUserName] = useLocalStorage('userName');

    const dashboard = (
        <SocketProvider id={userId}>
            <MatchesProvider>
                <ConversationsProvider id={userId}>
                    <Dashboard id={userId} name={userName} />
                </ConversationsProvider>
            </MatchesProvider>
        </SocketProvider>
    );

    return (
        <>
            <ToastContainer position='top-right'></ToastContainer>
            {userId ? (
                dashboard
            ) : (
                <Login
                    onUserIdSubmit={setUserId}
                    onUserNameSubmit={setUserName}
                />
            )}
        </>
    );
};

export default App;
