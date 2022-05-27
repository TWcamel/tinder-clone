import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ImageUploader from '../images/';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const formRef = React.useRef<HTMLFormElement>(null);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    return (
        <>
            <Modal.Header closeButton>Signup</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit} ref={formRef}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            placeholder='Your Name'
                            className='mb-2'
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='example@gmail.com'
                            required
                            className='mb-2'
                        />
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            className='mb-2'
                        />
                        <Form.Label>Gender</Form.Label>
                        <Form.Check type='radio' label='Male' />
                        <Form.Check
                            type='radio'
                            label='Female'
                            className='mb-2'
                        />
                        <Form.Label>Upload Images</Form.Label>
                        <ImageUploader />
                    </Form.Group>
                    <Button type='submit' className='mt-2'>
                        Create
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SignupModal;
