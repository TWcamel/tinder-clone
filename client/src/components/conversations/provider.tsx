import React, { useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMatches } from '../matches/provider';
import { useSocket } from '../socket/provider';

const ConversationsContext = React.createContext({});

export const useConversations: Function = () =>
    useContext(ConversationsContext);

export const ConversationsProvider: React.FC<{ id: string; children: any }> = ({
    id,
    children,
}) => {
    const [conversations, setConversations] = useLocalStorage(
        'conversations',
        [],
    );
    const [selectedConversationIndex, setSelectedConversationIndex] =
        useState(0);
    const { matches } = useMatches();
    const socket = useSocket();

    const createConversation = (recipient: string) => {
        setConversations(
            (prevConversations: [{ recipient: string; messages: [] }]) => {
                return [...prevConversations, { recipient, messages: [] }];
            },
        );
    };

    const addMessageToConversation: Function = useCallback(
        ({
            _recipient,
            _message,
            _sender,
        }: {
            _recipient: string;
            _message: string;
            _sender: string;
        }) => {
            setConversations(
                (prevConversations: [{ recipient: string; messages: [] }]) => {
                    let madeChange = false;
                    const _newMessgae = { _sender, _message };

                    const newConversations = conversations.map(
                        (conversation: {
                            recipient: string;
                            messages: [];
                            sender?: string;
                        }) => {
                            if (conversation.recipient === _recipient) {
                                madeChange = true;
                                return {
                                    ...conversation,
                                    messages: [
                                        ...conversation.messages,
                                        _newMessgae,
                                    ],
                                };
                            }
                            return conversation;
                        },
                    );

                    if (madeChange) {
                        return newConversations;
                    } else {
                        return [
                            ...prevConversations,
                            { _recipient, messages: [_newMessgae] },
                        ];
                    }
                },
            );
        },
        [setConversations],
    );

    useEffect(() => {
        if (socket == null) return;
        const res = socket.on('receive-message', addMessageToConversation);
        return () => socket.off('receive-message');
    }, [socket, addMessageToConversation]);

    const sendMessage: Function = (recipient: string, message: string) => {
        // socket.emit('send-message', { recipient, message });
        addMessageToConversation({ recipient, message, sender: id });
    };

    const formattedConversations = conversations.map(
        (
            conversation: {
                recipient: string;
                id: string;
                name: string;
                messages: [
                    {
                        sender: string;
                        message: string;
                    },
                ];
            },
            idx: number,
        ) => {
            const recipient = matches.find((match: { id: string }) => {
                return match.id === conversation.recipient;
            });
            const name: string = recipient && conversation.name;

            const newRecipient = { id: recipient, name };

            const selected = idx === selectedConversationIndex;

            const newMessage = conversation.messages.map(
                (m: { sender: string; message: string }) => {
                    const match = matches.find((match: { id: string }) => {
                        return match.id === m.sender;
                    });
                    const name = (match && match.name) || m.sender;

                    const fromMe = id === m.sender;

                    return { ...m, senderName: name, fromMe };
                },
            );

            return { ...conversation, newMessage, newRecipient, selected };
        },
    );

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation,
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};
