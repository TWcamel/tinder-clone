import React from 'react';
import { Tab, Nav, Button, Modal } from 'react-bootstrap';
import Conversations from '../conversations/';
import Matches from '../matches/';
import NewContactModal from '../modals/MatchesModal';
import NewConversationModal from '../modals/ConversationsModal';

const CONVERSATIONS_KEY = 'conversations';
const MATCHES_KEY = 'matches';

const Sidebar: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [activeKey, setActiveKey]: [string, Function] =
        React.useState(CONVERSATIONS_KEY);
    const conversationsOpen = activeKey === CONVERSATIONS_KEY;

    function closeModal() {
        setModalShow(false);
    }

    return (
        <div style={{ width: '273px' }} className='d-flex flex-column '>
            <Tab.Container
                defaultActiveKey='conversations'
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
                        <Matches />
                    </Tab.Pane>
                </Tab.Content>
                <div className='p-2 small border'>
                    Your Name: <span className='text-muted'>{id}</span>
                </div>
                <Button
                    onClick={() => setModalShow(true)}
                    className='rounded-0'
                >
                    New {conversationsOpen ? 'Conversation' : 'Match'}
                </Button>
            </Tab.Container>

            <Modal show={modalShow} onHide={closeModal}>
                {conversationsOpen ? (
                    <NewConversationModal closeModal={closeModal} />
                ) : (
                    <NewContactModal closeModal={closeModal} />
                )}
            </Modal>
        </div>
    );
};

export default Sidebar;
