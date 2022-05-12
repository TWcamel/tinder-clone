import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Login } from './auth/Login';
import { Dashboard } from './Dashboard';
import useLocalStorage from '../hooks/useLocalStorage';

const App = () => {
    const [userId, setUserId] = useLocalStorage('userId');
    const [userName, setUserName] = useLocalStorage('YouDontHaveNameNow');

    return (
        <>
            <div className='App'>{/* <Login /> */}</div>
            {userId ? (
                <Dashboard />
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
