import React, { useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMatches } from '../matches/provider';
import { useSocket } from '../socket/provider';
import { arrayEqualty } from '../../utils/array';

interface IMatch {
    id: string;
    name: string;
}

interface IMessages {
    text: string;
    sender: string;
    senderName: string;
    fromMe: boolean;
}

interface IConversation {
    recipients: [IMatch];
    messages: IMessages[];
}

interface INewConversation {
    recipients: [IMatch];
    text: string;
    sender: string;
}

const ConversationsContext = React.createContext({});

export const useConversations: Function = () =>
    useContext(ConversationsContext);

export const ConversationsProvider: React.FC<{
    id: string;
    children: React.ReactNode;
}> = ({ id, children }) => {
    const [conversations, setConversations] = useLocalStorage(
        'conversations',
        [],
    );
    const [selectedConversationIndex, setSelectedConversationIndex] =
        useState(0);

    const [selectedConversationIsTyping, setSelectedConversationIsTyping] =
        useState([selectedConversationIndex, '', false]);

    const { matches } = useMatches();
    const socket = useSocket();

    const createConversation = (recipients: [IMatch]) => {
        setConversations((prevConversations: [IConversation]) => {
            return [...prevConversations, { recipients, messages: [] }];
        });
    };

    const showMessageToConversation: Function = useCallback(
        (recipient: string) => {
            new Promise((s, j) => {
                setTimeout(() => {
                    setSelectedConversationIsTyping([
                        selectedConversationIndex,
                        '',
                        false,
                    ]);
                }, 3000);
                s('done');
            }).then(() => {
                setSelectedConversationIsTyping([
                    selectedConversationIndex,
                    recipient,
                    true,
                ]);
            });
        },
        [selectedConversationIndex],
    );

    const addMessageToConversation: Function = useCallback(
        ({ recipients, text, sender }: INewConversation) => {
            setConversations((prevConversations: [IConversation]) => {
                let madeChanges = false;
                const newMessage = { sender, text };
                const newConversations = prevConversations.map(
                    (conversation: IConversation) => {
                        if (arrayEqualty(conversation.recipients, recipients)) {
                            madeChanges = true;
                            return {
                                ...conversation,
                                messages: [
                                    ...conversation.messages,
                                    newMessage,
                                ],
                            };
                        }

                        return conversation;
                    },
                );

                if (!madeChanges) {
                    return [
                        ...prevConversations,
                        { recipients, messages: [newMessage] },
                    ];
                }
                return newConversations;
            });
        },
        [setConversations],
    );

    useEffect(() => {
        if (socket == null) return;
        socket.on('receive-message', addMessageToConversation);
        socket.on('receive-typing', showMessageToConversation);
        return () => {
            socket.off('receive-message');
            socket.off('receive-typing');
        };
    }, [socket, addMessageToConversation, showMessageToConversation]);

    const sendMessage: Function = (recipients: [IMatch], text: string) => {
        socket.emit('send-message', { recipients, text });
        addMessageToConversation({ recipients, text, sender: id });
    };

    const showTypingHint: Function = (recipients: [IMatch]) => {
        socket.emit('send-typing', { recipients });
        showMessageToConversation(recipients[0]);
    };

    const formattedConversations = conversations.map(
        (conversation: IConversation, index: number) => {
            const recipients = conversation.recipients.map((recipient: any) => {
                const match = matches.find((match: IMatch) => {
                    return match.id === recipient;
                });
                const name = (match && match.name) || recipient;
                return { id: recipient, name };
            });

            const messages = conversation.messages.map((message) => {
                const match = matches.find((match: IMatch) => {
                    return match.id === message.sender;
                });
                const name = (match && match.name) || message.sender;
                const fromMe = id === message.sender;
                return { ...message, senderName: name, fromMe };
            });

            const selected = index === selectedConversationIndex;

            return { ...conversation, messages, recipients, selected };
        },
    );

    const value = {
        conversations: formattedConversations,
        selectedConversation: formattedConversations[selectedConversationIndex],
        sendMessage,
        showTypingHint,
        selectConversationIndex: setSelectedConversationIndex,
        createConversation,
        selectedIsTyping: selectedConversationIsTyping,
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};
