import React, { useRef } from 'react';
import { Modal, Form, Button, ListGroup } from 'react-bootstrap';
import { mockAccounts } from '../../mocks/ppl';

interface IUser {
    email: string;
    name: string;
}

const MocksModal: React.FC<any> = ({ closeModal }: { closeModal: any }) => {
    return (
        <>
            <Modal.Header closeButton>Choose one to enjoy!</Modal.Header>
            <Modal.Body>
                {mockAccounts().map((user: any, index: number) => {
                    return (
                        <ListGroup className='m-4'>
                            <h5>{index}</h5>
                            <ListGroup.Item>{`name: ${user.name}`}</ListGroup.Item>
                            <ListGroup.Item>{`email: ${user.email}`}</ListGroup.Item>
                            <ListGroup.Item>{`password: ${user.password}`}</ListGroup.Item>
                        </ListGroup>
                    );
                })}
            </Modal.Body>
        </>
    );
};

export default MocksModal;
