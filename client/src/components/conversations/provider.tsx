import React, { useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { useMatches } from '../matches/provider';

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

    const createConversation = (recipient: string) => {
        setConversations(
            (prevConversations: [{ recipient: string; messages: [] }]) => {
                return [...prevConversations, { recipient, messages: [] }];
            },
        );
    };

    const addMessageToConversation: Function = ({
        recipient,
        message,
        sender,
    }: {
        recipient: string;
        message: string;
        sender: string;
    }) => {
        let madeChange = false;
        const newMessgae = { sender, message };

        const newConversations = conversations.map(
            (conversation: {
                recipient: string;
                messages: [];
                sender?: string;
            }) => {
                if (conversation.recipient === recipient) {
                    madeChange = true;
                    return {
                        ...conversation,
                        messages: [...conversation.messages, newMessgae],
                    };
                }
                return conversation;
            },
        );

        setConversations(
            (prevConversations: [{ recipient: string; messages: [] }]) => {
                if (madeChange) {
                    return newConversations;
                } else {
                    return [
                        ...prevConversations,
                        { recipient, messages: [newMessgae] },
                    ];
                }
            },
        );
    };

    const sendMessage: Function = (recipient: string, message: string) => {
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
