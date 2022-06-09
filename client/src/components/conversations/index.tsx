import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, ListGroup, Form, Image } from 'react-bootstrap';
import { useConversations } from './provider';
import useLocalStorage from '../../hooks/useLocalStorage';
import { getLocalStorage } from '../../utils/localStorage';

interface IConversation {
    sender: string;
    recipients: [
        {
            id: string;
            name: string;
        },
    ];
    mesaages: object[];
    selected: boolean;
}

interface IMatch {
    id: string;
    name: string;
    avatar: string;
}

export const Conversations: React.FC = () => {
    const { conversations, selectConversationIndex } = useConversations();
    const [matches, setMatches] = React.useState<IMatch[]>([]);

    useEffect(() => {
        const m: any = getLocalStorage('matches');
        if (m) {
            setMatches(m);
        }
    }, [matches]);

    //TODO: make messages scroll to top when new message is added
    //TODO: infinate scroll
    return (
        <>
            <ListGroup variant='flush'>
                {conversations.map(
                    (conversation: IConversation, idx: number) => {
                        const match = matches.find(
                            (match: IMatch) =>
                                match.id === conversation.recipients[0].id,
                        );
                        return (
                            <ListGroup.Item
                                key={idx}
                                action
                                onClick={() => selectConversationIndex(idx)}
                                active={conversation.selected}
                                className='d-flex align-items-center justify-content-between'
                                style={{
                                    cursor: 'pointer',
                                    borderRadius: '0',
                                    borderBottom: '1px solid rgb(193 193 193)',
                                    padding: '0.75rem 1.25rem',
                                    backgroundColor: conversation.selected
                                        ? 'rgb(14 110 253)'
                                        : 'rgb(242 242 242)',
                                }}
                            >
                                <Image
                                    src={match?.avatar || ''}
                                    roundedCircle
                                    height='33'
                                    width='38'
                                    style={{
                                        marginRight: '10px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                                {match?.name}
                            </ListGroup.Item>
                        );
                    },
                )}
            </ListGroup>
        </>
    );
};

export default Conversations;
