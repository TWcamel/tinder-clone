import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { useMatches } from '../matches/provider';
import userService from '../../services/userService';
import useLocalStorage from '../../hooks/useLocalStorage';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const { createMatch } = useMatches();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <Modal.Header closeButton>Create Contact</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        <Form.Label>Id</Form.Label>
                        <Form.Control type='text' required />
                    </Form.Group>
                    <Button type='submit'>Create</Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SignupModal;
