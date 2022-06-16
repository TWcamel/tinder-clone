import React from 'react';
import { Form, InputGroup, Button, FloatingLabel } from 'react-bootstrap';
import { useConversations } from './provider';
import IconButton from '@material-ui/core/IconButton';
import SendIcon from '@material-ui/icons/Send';
import {
    convertToLocalTimeZone,
    utcToCst,
    getLocalTimeBrief,
} from '../../utils/time';
import Picker from 'emoji-picker-react';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';

interface IConversationOpenProps {
    fromMe: boolean;
    senderName: string;
    sender: string;
    text: string;
    updateAt: Date;
}

const OpenConversation: React.FC = () => {
    const [text, setText]: [string, Function] = React.useState('');
    const { sendMessage, selectedConversation, showTypingHint } =
        useConversations();
    const sendMsgRef = React.useCallback((node: HTMLDivElement) => {
        if (node) {
            node.scrollIntoView({ behavior: 'smooth' });
        }
    }, []);
    const [chosenEmoji, setChosenEmoji]: [any, any] = React.useState(null);
    const [showEmojiPicker, setShowEmojiPicker]: [boolean, any] =
        React.useState(false);

    const onEmojiClick = (event: any, emojiObject: any) => {
        setChosenEmoji(emojiObject);
        setText(text + emojiObject.emoji);
    };

    const handleSubmit = (
        e:
            | React.FormEvent<HTMLFormElement>
            | React.KeyboardEvent<HTMLTextAreaElement>,
    ) => {
        e.preventDefault();
        sendMessage(
            selectedConversation.recipients.map((r: any) => r.id),
            text,
        );
        setText('');
    };

    return (
        <>
            <div
                className='d-flex flex-column flex-grow-1'
                style={{
                    backgroundColor: '#f5f5f5',
                }}
            >
                <div
                    className='flex-grow-1 overflow-auto'
                    style={{
                        boxShadow:
                            '30px 60px 120px #4DE8F4, -30px 40px 80px #FD3E3E',
                        borderRadius: '0.25rem',
                        margin: '3.3rem',
                        padding: '1rem',
                    }}
                >
                    <div className='d-flex flex-column align-items-start justify-content-end px-3'>
                        {selectedConversation.messages.map(
                            (
                                conversation: IConversationOpenProps,
                                idx: number,
                            ) => {
                                const lastMessage =
                                    selectedConversation.messages.length - 1 ===
                                    idx;
                                const fromMe = conversation.fromMe;
                                const text = conversation.text;
                                const senderName = conversation.senderName;
                                const updateAt = conversation.updateAt;
                                return (
                                    <div
                                        ref={lastMessage ? sendMsgRef : null}
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
                                                    : 'bg-danger text-white border'
                                            }`}
                                            style={{
                                                maxWidth: '25em',
                                                height: '100%',
                                                inlineSize: 'max-content',
                                                wordBreak: 'break-all',
                                            }}
                                        >
                                            {text}
                                        </div>
                                        <div
                                            className={`text-muted small ${
                                                fromMe ? 'text-right' : ''
                                            }`}
                                        >
                                            {lastMessage
                                                ? fromMe
                                                    ? `You ${getLocalTimeBrief(
                                                          updateAt,
                                                      )}`
                                                    : `${senderName}  ${getLocalTimeBrief(
                                                          updateAt,
                                                      )}`
                                                : ''}
                                        </div>
                                    </div>
                                );
                            },
                        )}
                    </div>
                    <div
                        style={{
                            position: 'absolute',
                            right: 0,
                            bottom: '5rem',
                            zIndex: 1,
                            display: showEmojiPicker ? 'block' : 'none',
                        }}
                    >
                        <Picker onEmojiClick={onEmojiClick} />
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
                                    onChange={(e) => {
                                        showTypingHint(
                                            selectedConversation.recipients.map(
                                                (r: any) => r.id,
                                            ),
                                        );
                                        setText(e.target.value);
                                    }}
                                    style={{
                                        resize: 'none',
                                        borderRadius: '1.73rem 0 0 1.73rem',
                                    }}
                                    onKeyDown={(
                                        e: React.KeyboardEvent<HTMLTextAreaElement>,
                                    ) => {
                                        if (e.key === 'Enter') {
                                            handleSubmit(e);
                                        }
                                    }}
                                />
                            </FloatingLabel>
                            <IconButton
                                style={{
                                    borderColor:
                                        'rgb(206 212 218) rgb(206 212 218) rgb(206 212 218) rgb(206 212 218)',
                                    borderStyle: 'solid solid solid solid',
                                    borderWidth: '1px 1px 1px 0px',
                                    backgroundColor: 'rgb(255 255 255)',
                                }}
                                onClick={() => {
                                    setShowEmojiPicker(!showEmojiPicker);
                                }}
                            >
                                <EmojiEmotionsIcon />
                            </IconButton>
                            <IconButton
                                type='submit'
                                className={`${
                                    text ? 'bg-primary text-white' : 'bg-light'
                                }`}
                                style={{
                                    borderColor:
                                        '#4DE8F4 #4DE8F4 #4DE8F4 #4DE8F4',
                                    borderStyle: 'solid solid solid solid',
                                    borderWidth: '1px 1px 1px 0px',
                                }}
                            >
                                <SendIcon />
                            </IconButton>
                        </InputGroup>
                    </Form.Group>
                </Form>
            </div>
        </>
    );
};

export default OpenConversation;
