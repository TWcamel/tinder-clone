import React from 'react';
import Sidebar from './sidebar';
import OpenConversation from './conversations/open';
import { useConversations } from './conversations/provider';

const Dashboard: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const { selectedConversation }: { selectedConversation: [{}] } =
        useConversations();
    return (
        <>
            <div className='d-flex' style={{ height: '100vh' }}>
                <Sidebar id={id} name={name} />
                {selectedConversation && <OpenConversation />}
            </div>
        </>
    );
};

export default Dashboard;
