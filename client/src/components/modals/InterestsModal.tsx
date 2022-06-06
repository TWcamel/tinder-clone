import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ImageUploader from '../images/';
import SignupService from '../../services/signupService';
import AwsService from '../../services/awsService';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const [age, setAge] = React.useState(-1);
    const [gender, setGender] = React.useState('');
    const [imgs, setImgs] = React.useState();

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // (await userRegister()) && (await uploadImg()) && closeModal();
    };

    return (
        <>
            <Modal.Header closeButton>Become a member</Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            placeholder='Your Name'
                            className='mb-2'
                            ref={nameRef}
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='example@gmail.com'
                            required
                            className='mb-2'
                            ref={emailRef}
                        />
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            className='mb-2'
                            ref={passwordRef}
                        />
                        <Form.Label>Gender</Form.Label>
                        <Form.Check
                            type='radio'
                            label='Male'
                            value='M'
                            name='user-gender'
                            // onChange={updateGender}
                        />
                        <Form.Check
                            type='radio'
                            label='Female'
                            value='F'
                            name='user-gender'
                            className='mb-2'
                            // onChange={updateGender}
                        />
                        <Form.Label>Age: {age === -1 ? '50' : age}</Form.Label>
                        {/* <Form.Range onChange={updateAge} /> */}
                        <Form.Label>Upload Images</Form.Label>
                        <ImageUploader onParentSubmit={setImgs} />
                    </Form.Group>
                    <Button type='submit' className='mt-2'>
                        Signup
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SignupModal;
