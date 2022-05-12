import React, { useEffect } from 'react';
import { io, Manager } from 'socket.io-client';
import { Button, FormGroup, Form } from 'react-bootstrap';

export const Conversations: React.FC = () => {
    const socket = io('http://localhost:3000');

    const handleClick = (
        e:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        console.log('handling onclick event...');
    };

    return (
        <div>
            <Form>
                <FormGroup>
                    <Form.Label>Conversation Model</Form.Label>
                    <Form.Control
                        type='text'
                        placeholder='Enter Conversation Model'
                    />
                </FormGroup>
                <Button onClick={handleClick}>Button</Button>
            </Form>
        </div>
    );
};
