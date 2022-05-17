import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useMatches } from '../matches/provider';
import userService from '../../services/userService';
import useLocalStorage from '../../hooks/useLocalStorage';
import axios from 'axios';

interface IUser {
    email: string;
    name: string;
}

const MatchesModal: React.FC<any> = ({ closeModal }: { closeModal: any }) => {
    const [currentUserEmail] = useLocalStorage('userId');
    const idRef = React.useRef<HTMLInputElement>(null);

    const { createMatch } = useMatches();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const userId = idRef.current?.value;

        if (userId !== null) {
            (async () => {
                const _user: IUser = await getUserName(userId);
                if (
                    _user?.email &&
                    _user.email === userId &&
                    _user.email !== currentUserEmail
                ) {
                    createMatch(_user.email, _user.name, currentUserEmail);
                    closeModal();
                } else alert('input is not valid');
            })();
        }
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
    const user = await userService.getUserName(userId);
    return user;
};
