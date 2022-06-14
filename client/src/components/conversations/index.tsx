import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, ListGroup, Form, Image } from 'react-bootstrap';
import { useConversations } from './provider';
import useLocalStorage from '../../hooks/useLocalStorage';
import { getLocalStorage } from '../../utils/localStorage';
import { useMatches } from '../matches/provider';
import LoadingEffect from '../loading/';
import { refreshPage } from '../../utils/page';

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
    const { selectMatchIndex } = useMatches();

    useEffect(() => {
        const m: any = getLocalStorage('matches');
        if (m) {
            setMatches(m);
        }
    }, [selectConversationIndex, selectMatchIndex]);

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
                                className='d-flex align-items-center'
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
                                {

                match?.avatar ? (
                                    <Image
                                        src={match?.avatar}
                                        roundedCircle
                                        style={{
                                            borderRadius: '50%',
                                            objectFit: 'cover',
                                            width: '3rem',
                                            height: '3rem',
                                            marginRight: '1rem',
                                            border: '1px solid rgb(193 193 193)',
                                        }}
                                    />
                                ) : (
                                    <LoadingEffect />
                                )}
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
