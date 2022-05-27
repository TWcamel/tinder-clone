import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ImageUploader from '../images/';
import useLocalStorage from '../../hooks/useLocalStorage';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const formRef = React.useRef<HTMLFormElement>(null);
    const [imgs] = useLocalStorage('imgs');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let formName = ['name', 'email', 'password', 'gender', 'avatar'];
        let formData: Object[] = [];
        if (formRef.current)
            Array.prototype.forEach.call(
                formRef.current,
                (element: any, idx: number) => {
                    if (
                        element.type !== 'file' &&
                        element.type !== 'submit' &&
                        element.type !== 'radio'
                    ) {
                        formData.push({
                            k: formName[idx],
                            v: element.checked ? element.value : '',
                        });
                    } else if ((idx === 3 || idx === 4) && element.checked) {
                        formData.push({
                            k: formName[3],
                            v: element.value,
                        });
                    } else if (element.type === 'file') {
                        formData.push({
                            k: formName[4],
                            v: imgs,
                        });
                    }
                },
            );
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
                        <Form.Check
                            type='radio'
                            label='Male'
                            value='M'
                            name='user-gender'
                        />
                        <Form.Check
                            type='radio'
                            label='Female'
                            value='F'
                            name='user-gender'
                            className='mb-2'
                        />
                    </Form.Group>
                    <Form.Group className='mb-2' id='image-uploader'>
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
