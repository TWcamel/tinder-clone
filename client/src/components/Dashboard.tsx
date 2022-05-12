import React from 'react';
import { Sidebar } from './Sidebar/Sidebar';
import { Conversations } from './conversations/Conversations';

export const Dashboard: React.FC = () => {
    return (
        <div className='d-flex' style={{ height: '100vh' }}>
            <h1>Dashboard</h1>
            <Sidebar />
            {/* <Conversations /> */}
        </div>
    );
};
