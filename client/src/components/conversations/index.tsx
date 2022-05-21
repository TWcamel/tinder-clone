import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, ListGroup, Form } from 'react-bootstrap';
import { useConversations } from './provider';

export const Conversations: React.FC = () => {
    const { conversations, selectConversationIndex } = useConversations();
    return (
        <>
            <ListGroup variant='flush'>
                {conversations.map(
                    (
                        conversation: {
                            sender: string;
                            recipients: [
                                {
                                    id: string;
                                    name: string;
                                },
                            ];
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
                                {conversation.recipients
                                    .map((r) => r.id)
                                    .join(', ')}
                            </ListGroup.Item>
                        );
                    },
                )}
            </ListGroup>
        </>
    );
};

export default Conversations;
