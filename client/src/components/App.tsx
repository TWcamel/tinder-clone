import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './auth/Login';
import Dashboard from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';
import { MatchesProvider } from './matches/provider';
import { ConversationsProvider } from './conversations/provider';

const App = () => {
    const [userId, setUserId] = useLocalStorage('userId');
    const [userName, setUserName] = useLocalStorage('userName');

    const dashboard = (
        <MatchesProvider>
            <ConversationsProvider id={userId}>
                <Dashboard id={userId} name={userName} />
            </ConversationsProvider>
        </MatchesProvider>
    );

    return (
        <>
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
