import React, { useContext, useState, useEffect, useCallback } from 'react';
import useLocalStorage from '../../hooks/useLocalStorage';
import { getLocalStorage } from '../../utils/localStorage';
import ChatService from '../../services/chatService';
import { useMatches } from '../matches/provider';
import { useSocket } from '../socket/provider';
import { arrayEqualty, removeItem } from '../../utils/array';
import { toast } from 'react-toastify';

interface IMatch {
    id: string;
    name: string;
    avatar: string;
}

interface IMessages {
    text: string;
    sender: string;
    senderName: string;
    fromMe: boolean;
    updateAt?: string;
}

interface IConversation {
    recipients: [IMatch];
    messages: IMessages[];
}

interface INewConversation {
    recipients: [IMatch];
    text: string;
    sender: string;
    updateAt?: Date;
}

interface IFetchConversation {
    message: string;
    reciever: string;
    sender: string;
    updateAt: String;
    senderName?: string;
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
    const [typingMsg, setTypingMsg] = useLocalStorage('typingMsg', []);

    const { matches } = useMatches();
    const socket = useSocket();

    const fetchConversations = useCallback(
        (matches: any) => {
            matches.map(async (match: IMatch) => {
                const conversations = await ChatService.fetchChats({
                    sender: id,
                    reciever: match.id,
                });
                if (conversations.ok && conversations.data.length) {
                    const recipient = conversations.data.find(
                        (conversation: IFetchConversation) => {
                            return (
                                (conversation.reciever !== id &&
                                    conversation.sender === id) ||
                                (conversation.reciever === id &&
                                    conversation.sender !== id)
                            );
                        },
                    );
                    const msg = conversations.data.map(
                        (conversation: IFetchConversation) => {
                            return {
                                text: conversation.message,
                                sender: conversation.sender,
                                senderName:
                                    conversation?.senderName ||
                                    conversation.sender,
                                fromMe: conversation.sender === id,
                                updateAt: conversation.updateAt,
                            };
                        },
                    );
                    const formattedConversation: IConversation = {
                        recipients: [
                            recipient.reciever === id
                                ? recipient.sender
                                : recipient.reciever,
                        ],
                        messages: msg,
                    };

                    setConversations((prevConversations: any) => {
                        const _newConversation = prevConversations.map(
                            (conversation: IConversation) => {
                                if (
                                    arrayEqualty(
                                        conversation.recipients,
                                        formattedConversation.recipients,
                                    )
                                ) {
                                    conversation.messages =
                                        formattedConversation.messages;
                                }
                                return conversation;
                            },
                        );
                        return _newConversation.length === 0
                            ? [...prevConversations, formattedConversation]
                            : _newConversation;
                    });
                }
            });
        },
        [id],
    );

    const createConversationHistory = (recipients: [IMatch]) => {
        const r: any = recipients[0]?.id ?? recipients[0];
        if (r && r.length && r !== 'undefined') {
            (async () => {
                const chats = await ChatService.getChatsHistory({
                    sender: id,
                    reciever: r,
                });

                if (chats.ok) {
                    const formattMsgHis = chats.data.map((msg: any) => {
                        return {
                            text: msg.message,
                            sender: msg.sender,
                            senderName:
                                msg.sender === id ? msg.sender : msg.reciever,
                            fromMe: msg.sender === id,
                        };
                    });
                    setConversations((prev: [IConversation]) => {
                        const index = prev.findIndex((c: IConversation) => {
                            return arrayEqualty(c.recipients, recipients);
                        });
                        if (index !== -1) {
                            prev[index].messages = formattMsgHis;
                            return prev;
                        }
                        return [
                            ...prev,
                            {
                                recipients,
                                messages: formattMsgHis,
                            },
                        ];
                    });
                }
            })();
            return true;
        }
        return false;
    };

    const createConversation = (recipients: [IMatch]) => {
        if (!createConversationHistory(recipients))
            setConversations((prevConversations: [IConversation]) => {
                const prev = prevConversations.find(
                    (conversation: IConversation) => {
                        return (
                            arrayEqualty(recipients, conversation.recipients) &&
                            toast.info(`You can start a conversation now :)`)
                        );
                    },
                );
                if (prev) {
                    return prevConversations;
                }
                return [
                    ...prevConversations,
                    {
                        recipients,
                        messages: [],
                    },
                ];
            });
    };

    const showAnimatedToast = useCallback((text: string) => {
        const show = () =>
            toast.info(text, {
                position: toast.POSITION.TOP_RIGHT,
                toastId: `typing-${text}`,
            });
        show();
    }, []);

    const removeDuplicatesMsg: Function = useCallback(
        (msg: string) => {
            setTypingMsg((prevMsg: string[]) => {
                return prevMsg.includes(msg)
                    ? removeItem(prevMsg, msg)
                    : [...prevMsg, msg];
            });
        },
        [setTypingMsg],
    );

    const showTyping: Function = useCallback(
        (msg: string) => {
            removeDuplicatesMsg(msg);
            showAnimatedToast(msg);
        },
        [removeDuplicatesMsg, showAnimatedToast],
    );

    const addMessageToConversation: Function = useCallback(
        ({ recipients, text, updateAt, sender }: INewConversation) => {
            setConversations((prevConversations: [IConversation]) => {
                let madeChanges = false;
                const newMessage = {
                    sender,
                    text,
                    updateAt: updateAt ? updateAt : new Date(),
                };
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
        if (matches != null && matches.length > 0) {
            fetchConversations(matches);
        }
        if (socket == null) return;
        socket.on('receive-message', addMessageToConversation);
        socket.on('receive-typing', showTyping);
        return () => {
            socket.off('receive-message');
            socket.off('receive-typing');
        };
    }, [
        socket,
        addMessageToConversation,
        showTyping,
        matches,
        fetchConversations,
    ]);

    const sendMessage: Function = (recipients: [IMatch], text: string) => {
        socket.emit('send-message', { recipients, text });
        addMessageToConversation({ recipients, text, sender: id });
    };

    const showTypingHint: Function = (recipients: [IMatch]) => {
        socket.emit('send-typing', { recipients });
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
                return {
                    ...message,
                    senderName: name,
                    fromMe,
                    updateAt: message.updateAt
                        ? new Date(message.updateAt)
                        : new Date(),
                };
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
        createConversationHistory,
    };

    return (
        <ConversationsContext.Provider value={value}>
            {children}
        </ConversationsContext.Provider>
    );
};
