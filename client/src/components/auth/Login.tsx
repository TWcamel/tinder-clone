import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import AuthService from '../../services/authService';
import { FbLogin } from './FbLogin';
import { GoogleLogin } from './GoogleLogin';
import { v4 as uuidV4 } from 'uuid';
import useLocalStorage from '../../hooks/useLocalStorage';
import SignupModal from '../modals/SignupModal';

export const Login: React.FC<{
    onUserIdSubmit: (userId: string) => void;
    onUserNameSubmit: (userName: string) => void;
}> = ({ onUserIdSubmit, onUserNameSubmit }) => {
    const [modalShow, setModalShow] = React.useState(false);

    useEffect(() => {
        (async () => {
            const isLoggedIn: boolean = await checkLogin();
            if (!isLoggedIn) userRegister();
        })();
    }, []);

    const closeModal = () => {
        setModalShow(false);
    };

    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    const handleSubmit = (
        e:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        const _target: HTMLFormElement = e.target as HTMLFormElement;

        _target.id === 'login-button' ? userLogin() : userRegister();
    };

    const checkLogin = async (): Promise<boolean> => {
        const token = document.cookie.split('=')[1];
        const res = await AuthService.verify(token);
        if (res.ok) {
            onUserIdSubmit(res.data.email);
            onUserNameSubmit(res.data.name);
            return true;
        }

        return false;
    };

    const userLogin = async () => {
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;

        if (email && password && email.length > 0 && password.length > 0) {
            const res = await AuthService.login(email, password);
            onUserIdSubmit(res.email);
            onUserNameSubmit(res.name);
        }
    };

    const userRegister = async () => {
        setModalShow(true);
    };

    return (
        <>
            <Container
                className='align-items-center d-flex'
                style={{ height: '100vh' }}
            >
                <Form className='w-100'>
                    <Form.Group className='mt-2'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='example@gmail.com'
                            required={true}
                            ref={emailRef}
                        />
                    </Form.Group>
                    <Form.Group className='mt-2 mb-2'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            ref={passwordRef}
                        />
                    </Form.Group>
                    <Button
                        id='login-button'
                        className='mt-2 me-2 rounded'
                        variant='primary'
                        type='submit'
                        onClick={handleSubmit}
                    >
                        Login
                    </Button>
                    <Button
                        onClick={() => setModalShow(true)}
                        className='mt-2 me-2 rounded'
                    >
                        Signup
                    </Button>

                    <Modal show={modalShow} onHide={closeModal}>
                        <SignupModal closeModal={closeModal} />
                    </Modal>

                    <FbLogin />
                    <GoogleLogin />
                </Form>
            </Container>
        </>
    );
};
