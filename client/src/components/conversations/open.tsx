import React from 'react';
import { Form, InputGroup, Button, FloatingLabel } from 'react-bootstrap';
import { useConversations } from './provider';

const OpenConversation: React.FC = () => {
    const [text, setText]: [string, Function] = React.useState('');
    const { sendMessage, selectedConversation } = useConversations();
    const setRef = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            node.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(
            selectedConversation.recipients.map((r: any) => r.id),
            text,
        );
        setText('');
    };

    return (
        <>
            <div className='d-flex flex-column flex-grow-1'>
                <div className='flex-grow-1 overflow-auto'>
                    <div className='d-flex flex-column align-items-start justify-content-end px-3'>
                        {selectedConversation.messages.map(
                            (
                                conversation: {
                                    fromMe: boolean;
                                    senderName: string;
                                    sender: string;
                                    text: string;
                                },
                                idx: number,
                            ) => {
                                const lastMessage =
                                    selectedConversation.messages.length - 1 ===
                                    idx;
                                const fromMe = conversation.fromMe;
                                const text = conversation.text;
                                const senderName = conversation.senderName;
                                return (
                                    <div
                                        ref={lastMessage ? setRef : null}
                                        key={idx}
                                        className={`my-1 d-flex flex-column ${
                                            fromMe
                                                ? 'align-self-end align-items-end'
                                                : 'align-items-start'
                                        }`}
                                    >
                                        <div
                                            className={`rounded px-2 py-1 ${
                                                fromMe
                                                    ? 'bg-primary text-white'
                                                    : 'border'
                                            }`}
                                        >
                                            {text}
                                        </div>
                                        <div
                                            className={`text-muted small ${
                                                fromMe ? 'text-right' : ''
                                            }`}
                                        >
                                            {fromMe ? 'You' : senderName}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                </div>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='form-floating m-3'>
                        <InputGroup>
                            <FloatingLabel
                                controlId='floatingTextarea'
                                label={`${text ? '' : 'Say something...'}`}
                                className='flex-grow-1'
                            >
                                <Form.Control
                                    as='textarea'
                                    required
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    style={{ resize: 'none' }}
                                    className='rounded'
                                />
                            </FloatingLabel>
                            <Button type='submit' variant='outline-secondary'>
                                Send
                            </Button>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
};

export default OpenConversation;
