import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, ListGroup, Form } from 'react-bootstrap';
import { useConversations } from './provider';

export const Conversations: React.FC = () => {
    const handleClick = (
        e:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        console.log('handling onclick event...');
    };

    const { conversations, selectConversationIndex } = useConversations();

    return (
        <>
            <ListGroup variant='flush'>
                {conversations.map(
                    (
                        conversation: {
                            recipient: string;
                            mesaages: [{}];
                            selected: boolean;
                        },
                        idx: number,
                    ) => {
                        return (
                            <ListGroup.Item
                                key={idx}
                                action
                                onClick={() => selectConversationIndex(idx)}
                                active={conversation.selected}
                            >
                                {conversation.recipient}
                            </ListGroup.Item>
                        );
                    },
                )}
            </ListGroup>
        </>
    );
};

export default Conversations;
