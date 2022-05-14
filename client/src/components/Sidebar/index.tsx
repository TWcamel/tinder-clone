import React from 'react';
import { Tab, Nav, Button } from 'react-bootstrap';
import Conversations from '../conversations/';
import Matches from '../matches/';

const CONVERSATIONS_KEY = 'conversations';
const MATCHES_KEY = 'matches';

const Sidebar: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const [activeKey, setActiveKey]: [string, Function] =
        React.useState(CONVERSATIONS_KEY);

    return (
        <div style={{ width: '273px' }} className='d-flex flex-column '>
            <Tab.Container
                defaultActiveKey='conversations'
                onSelect={(eventKey: any) => setActiveKey(eventKey)}
            >
                <Nav variant='tabs' className='d-flex justify-content-evenly'>
                    <Nav.Item>
                        <Nav.Link eventKey={CONVERSATIONS_KEY}>
                            Messages
                        </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={MATCHES_KEY}>Matches</Nav.Link>
                    </Nav.Item>
                </Nav>
                <Tab.Content
                    className={
                        'overflow-auto flex-grow-1 border border-top-0 border-bottom-0'
                    }
                >
                    <Tab.Pane eventKey={CONVERSATIONS_KEY}>
                        <Conversations />
                    </Tab.Pane>
                    <Tab.Pane eventKey={MATCHES_KEY}>
                        <Matches />
                    </Tab.Pane>
                </Tab.Content>
                <div className='p-2 small border'>
                    Your Name: <span className='text-muted'>{name}</span>
                </div>
            </Tab.Container>
        </div>
    );
};

export default Sidebar;
