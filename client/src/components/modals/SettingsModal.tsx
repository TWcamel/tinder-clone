import React, { useRef } from 'react';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import useLocalStorage from '../../hooks/useLocalStorage';
import ImageUploader from '../images/';
import UserService from '../../services/userService';
import AwsService from '../../services/awsService';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const SettingsModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const [userName] = useLocalStorage('userName');
    const [userEmail] = useLocalStorage('userId');
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = passwordRef.current?.value;
        if (!password) {
            toast.error('Please fill out all fields');
            return;
        }
        const user = await UserService.updatePersonalInfo(userEmail, password);
        if (!user) {
            toast.error('Something went wrong');
            return;
        }

        toast.success('Successfully updated');
    };

    return (
        <>
            <Modal.Header className='m-2'>
                <h3>Personal Info</h3>
                <Image
                    src='https://via.placeholder.com/150'
                    roundedCircle
                    width='100'
                    height='100'
                />
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            placeholder={userName}
                            className='mb-2'
                            disabled
                        />
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            className='mb-2'
                            ref={passwordRef}
                        />
                    </Form.Group>
                    <Button type='submit' className='mt-2'>
                        Update
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SettingsModal;
