import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useMatches } from '../matches/provider';
import userService from '../../services/userService';
import axios from 'axios';

interface IUser {
    email: string;
    name: string;
}

const MatchesModal: React.FC<any> = ({ closeModal }: { closeModal: any }) => {
    const idRef = React.useRef<HTMLInputElement>(null);

    const { createMatch } = useMatches();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userId = idRef.current?.value;

        (async () => {
            const _user: IUser = await getUserName(userId);
            if (_user.email === userId) {
                createMatch(_user.email, _user.name);
                closeModal();
            }
        })();
    };

    return (
        <>
            <Modal.Header closeButton>Create Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type='text' ref={idRef} required />
                    </Form.Group>
                    <Button type='submit'>Create</Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default MatchesModal;

const getUserName = async (userId: any): Promise<IUser> => {
    if (!userId) return { email: '', name: '' };
    const user = await userService.getUserName(userId);
    return user;
};
