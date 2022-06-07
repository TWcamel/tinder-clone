import React from 'react';
import Sidebar from './sidebar';
import OpenConversation from './conversations/open';
import OpenMatches from './matches/open';
import useLocalStorage from '../hooks/useLocalStorage';
import { useConversations } from './conversations/provider';
import InterestsModal from './modals/InterestsModal';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';

const Dashboard: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const [modalShow, setModalShow] = React.useState(false);
    const { selectedConversation }: { selectedConversation: [{}] } =
        useConversations();
    const [sidebarActiveKey, setSidebarActiveKey] = React.useState();
    const [isPrefferSettingsUpdated, setIsPrefferSettingsUpdated] =
        React.useState(false);

    const [userPrefer] = useLocalStorage('userPrefer');

    React.useEffect(() => {
        if (isPrefferSettingsUpdated || userPrefer) setModalShow(false);
        else {
            setModalShow(true);
            toast.info('Please update your preferences to continue', {
                position: toast.POSITION.TOP_CENTER,
                toastId: 'preferences',
            });
        }
    }, [isPrefferSettingsUpdated, userPrefer]);

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
                    <OpenMatches id={id} />
                )}
            </div>
            <Modal show={modalShow}>
                <InterestsModal
                    id={id}
                    onUpdated={setIsPrefferSettingsUpdated}
                />
            </Modal>
        </>
    );
};

export default Dashboard;
