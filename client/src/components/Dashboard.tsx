import React from 'react';
import Sidebar from './sidebar';
import OpenConversation from './conversations/open';
import OpenMatches from './matches/open';
import { useConversations } from './conversations/provider';

const Dashboard: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const { selectedConversation }: { selectedConversation: [{}] } =
        useConversations();
    const [sidebarActiveKey, setSidebarActiveKey] = React.useState();
    return (
        <>
            <div className='d-flex' style={{ height: '100vh' }}>
                <Sidebar
                    id={id}
                    name={name}
                    onSidebarSelected={setSidebarActiveKey}
                />
                {sidebarActiveKey === 'conversations' ? (
                    selectedConversation && <OpenConversation />
                ) : (
                    <OpenMatches />
                )}
            </div>
        </>
    );
};

export default Dashboard;
