import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, ListGroup, Form, Image } from 'react-bootstrap';
import { useConversations } from './provider';

export const Conversations: React.FC = () => {
    const { conversations, selectConversationIndex } = useConversations();

    //TODO: make messages scroll to top when new message is added
    //TODO: infinate scroll
    //TODO: add avatar to the message vieww
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
                                <Image
                                    src='https://via.placeholder.com/150'
                                    roundedCircle
                                    width='33'
                                />
                                {conversation.recipients
                                    .map((r) => {
                                        return r.id;
                                    })
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
