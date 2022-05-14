import React from 'react';
import { Form, InputGroup, Button, FloatingLabel } from 'react-bootstrap';
import { useConversations } from './provider';

const OpenConversation: React.FC = () => {
    const [message, setMessage]: [string, Function] = React.useState('');
    const { sendMessage, selectedConversation } = useConversations();
    const lastMessageRef = React.useRef<HTMLDivElement>(null);
    const setRef = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            node.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessage(selectedConversation.recipient, message);
        setMessage('');
    };

    return (
        <>
            <div className='d-flex flex-column flex-grow-1'>
                <div className='flex-grow-1 overflow-auto'>
                    <div className='d-flex flex-column align-items-start justify-content-end px-3'>
                        {selectedConversation.messages.map(
                            (
                                message: { message: string; sender: string },
                                idx: number,
                                fromMe: boolean,
                                senderName: string,
                            ) => {
                                const lastMessage =
                                    selectedConversation.messages.length - 1 ===
                                    idx;
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
                                            {message.message}
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
                                label={`${message ? '' : 'Say something...'}`}
                            >
                                <Form.Control
                                    as='textarea'
                                    required
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    style={{ resize: 'none', height: '73px' }}
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
