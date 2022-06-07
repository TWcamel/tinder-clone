import React from 'react';
import Sidebar from './sidebar';
import OpenConversation from './conversations/open';
import OpenMatches from './matches/open';
import { useConversations } from './conversations/provider';
import InterestsModal from './modals/InterestsModal';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import InterestsService from '../services/interestsService';

const Dashboard: React.FC<{ id: any; name: any }> = ({ id, name }) => {
    const [modalShow, setModalShow] = React.useState(false);
    const { selectedConversation }: { selectedConversation: [{}] } =
        useConversations();
    const [sidebarActiveKey, setSidebarActiveKey] = React.useState();
    const [isPrefferSettingsUpdated, setIsPrefferSettingsUpdated] =
        React.useState(false);

    const preCheck = React.useCallback(async () => {
        const interests = await InterestsService.check(id);
        if (interests.data) {
            toast.success('Welcome!', { toastId: 'preferences' });
            setIsPrefferSettingsUpdated(true);
            setModalShow(false);
        } else {
            setModalShow(true);
            toast.error('Please update your preferences', {
                position: toast.POSITION.TOP_CENTER,
                toastId: 'preferences',
            });
        }
    }, [id]);

    const closeModal = () => {
        setModalShow(false);
    };

    React.useEffect(() => {
        preCheck();
    }, [preCheck]);

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
                    closeModal={closeModal}
                />
            </Modal>
        </>
    );
};

export default Dashboard;
