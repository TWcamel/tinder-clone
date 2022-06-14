import React from 'react';
import { Tab, Nav, Button, Modal } from 'react-bootstrap';
import Conversations from '../conversations/';
import Matches from '../matches/';
import IconButton from '@material-ui/core/IconButton';
import FaceIcon from '@material-ui/icons/Face';
import ExitToApp from '@material-ui/icons/ExitToApp';
import AuthService from '../../services/authService';

const CONVERSATIONS_KEY = 'conversations';
const MATCHES_KEY = 'matches';

const Sidebar: React.FC<{
    id: any;
    name: any;
    onSidebarSelected?: (activeKey: any) => void;
}> = ({ id, name, onSidebarSelected }) => {
    const [activeKey, setActiveKey]: [
        string,
        React.Dispatch<React.SetStateAction<string>>,
    ] = React.useState(MATCHES_KEY);

    React.useEffect(() => {
        if (onSidebarSelected) {
            onSidebarSelected(activeKey);
        }
    }, [activeKey, onSidebarSelected]);

    const handleLogout = () => {
        AuthService.logout();
    };

    return (
        <div style={{ width: '273px' }} className='d-flex flex-column '>
            <Tab.Container
                defaultActiveKey='matches'
                activeKey={activeKey}
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
                        <Matches onSidebarSelcet={setActiveKey} />
                    </Tab.Pane>
                </Tab.Content>
                <div
                    className='p-2 small border d-flex justify-content-between align-items-center'
                    style={{ backgroundColor: '#f5f5f5' }}
                >
                    <FaceIcon style={{ fontSize: '2rem' }} />
                    <span className='text-muted'>{id}</span>
                    <IconButton onClick={() => handleLogout()}>
                        <ExitToApp style={{ fontSize: '2rem' }} />
                    </IconButton>
                </div>
            </Tab.Container>
        </div>
    );
};

export default Sidebar;
