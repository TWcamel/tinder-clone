import React, { useRef } from 'react';
import { Modal, Form, Button, Image } from 'react-bootstrap';
import useLocalStorage from '../../hooks/useLocalStorage';
import ImageUploader from '../images/';
import UserService from '../../services/userService';
import AwsService from '../../services/awsService';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import RotateLeftRounded from '@material-ui/icons/RotateLeftRounded';

const SettingsModal: React.FC<any> = ({
    closeModal,
    id,
}: {
    closeModal: () => void;
    id: string;
}) => {
    const [userName] = useLocalStorage('userName');
    const passwordRef = useRef<HTMLInputElement>(null);
    const bioRef = useRef<HTMLTextAreaElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const password = passwordRef.current?.value;
        const bio = bioRef.current?.value;

        if (password) {
            const _pwd = await UserService.updatePassword(id, password);
            if (!_pwd) {
                toast.error('Update password went wrong');
                return;
            }
            toast.success('Successfully update password');
            return;
        }

        if (!bio) {
            toast.error('Please fill out Bio fields');
            return;
        }

        const user = {
            email: id,
            bio,
        };

        const res = await UserService.updatePersonalInfo(user);
        console.log(res);

        if (!res) {
            toast.error('Something went wrong while updating');
            return;
        }

        toast.success('Successfully updated');
    };

    return (
        <>
            <Modal.Header className='m-2'>
                <h3>Personal Info</h3>
                {/* <Image */}
                {/*     src='https://via.placeholder.com/150' */}
                {/*     roundedCircle */}
                {/*     width='100' */}
                {/*     height='100' */}
                {/* /> */}
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
                        <Form.Label>
                            Password
                            <span
                                className='ml-2'
                                style={{
                                    fontSize: '0.77em',
                                    cursor: 'pointer',
                                }}
                                onClick={() => {
                                    passwordRef?.current?.removeAttribute(
                                        'disabled',
                                    );
                                }}
                            >
                                <RotateLeftRounded style={{ color: 'navy' }} />
                                reset
                            </span>
                        </Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            className='mb-2'
                            ref={passwordRef}
                            disabled
                        />
                        <Form.Label>Bio</Form.Label>
                        <Form.Control
                            as='textarea'
                            rows={3}
                            placeholder='Tell us about yourself'
                            className='mb-2'
                            ref={bioRef}
                        />
                    </Form.Group>
                    <Button type='submit'>Update</Button>
                    <Button
                        className='m-2'
                        variant='danger'
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SettingsModal;
