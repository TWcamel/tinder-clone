import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Navbar } from './NavBar';
import { Login } from './Login';

const App = () => {
    return (
        <>
            <div className='App'>
                <Login />
            </div>
        </>
    );
};

export default App;
