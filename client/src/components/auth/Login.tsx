import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Modal, Image } from 'react-bootstrap';
import AuthService from '../../services/authService';
import { FbLogin } from './FbLogin';
import { GoogleLogin } from './GoogleLogin';
import SignupModal from '../modals/SignupModal';
import { toast } from 'react-toastify';
import MocksModal from '../modals/MocksModal';

const SIGN_UP_KEY = 'signup';
const MOCKS_KEY = 'mocks';

export const Login: React.FC<{
    onUserIdSubmit: (userId: string) => void;
    onUserNameSubmit: (userName: string) => void;
}> = ({ onUserIdSubmit, onUserNameSubmit }) => {
    const [modalShow, setModalShow] = React.useState(false);
    const [activeKey, setActiveKey] = React.useState('');

    useEffect(() => {
        (async () => {
            const isLoggedIn: boolean = await checkLogin();
            if (!isLoggedIn) toast.info('Welcome! Login to continue.');
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

        _target.id === 'login-button' ? userLogin() : (() => {})(); //userRegister();
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
            try {
                const res = await AuthService.login(email, password);
                onUserIdSubmit(res.email);
                onUserNameSubmit(res.name);
            } catch (err: any) {
                toast.error('Login in failed, please try again', {
                    autoClose: 7000,
                });
            }
        }
    };

    const userRegister = async () => {
        setModalShow(true);
    };

    return (
        <>
            <Container
                className='d-flex flex-row flex-grow-1'
                style={{ height: '100vh', width: '100vw' }}
            >
                <div className='w-50 m-4'>
                    <Image src={require('../../images/project-big.jpeg')} />
                    <h1
                        style={{
                            textAlign: 'center',
                            position: 'absolute',
                            top: 0,
                            textShadow: '2px 2px 4px #000000',
                            fontSize: '3.3rem',
                            fontWeight: 'bold',
                            color: 'rgb(248 69 68)',
                            marginLeft: '1rem',
                        }}
                    >
                        Meet New 25 Friends in a Day!
                    </h1>
                </div>

                <div
                    className='w-50 m-4'
                    style={{
                        border: '1px solid #ccc',
                        borderRadius: '33px',
                        padding: '50px',
                        backgroundColor: '#ffffff',
                    }}
                >
                    <Form>
                        <div className='mb-4 d-flex flex-column align-items-center'>
                            <h1 className='mb-2'>Sign in</h1>
                            <span className=''>Sign in with your email</span>
                        </div>
                        <hr />
                        <Form.Group className='mt-2'>
                            <Form.Label>Email address</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='tzuyu@tzuyu.com'
                                required={true}
                                ref={emailRef}
                            />
                        </Form.Group>
                        <Form.Group className='mt-2 mb-2'>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                placeholder='tzuyu'
                                ref={passwordRef}
                            />
                        </Form.Group>
                        <Button
                            id='login-button'
                            className='mt-2 me-2 rounded'
                            variant='outline-primary'
                            type='submit'
                            onClick={handleSubmit}
                        >
                            Sign in
                        </Button>
                        <Button
                            onClick={() => {
                                setActiveKey(SIGN_UP_KEY);
                                setModalShow(true);
                            }}
                            className='mt-2 me-2 rounded'
                            variant='outline-secondary'
                        >
                            Sign up
                        </Button>
                        <Button
                            onClick={() => {
                                setActiveKey(MOCKS_KEY);
                                setModalShow(true);
                            }}
                            className='mt-2 me-2 rounded'
                            variant='outline-info'
                        >
                            Check Testing Accounts
                        </Button>

                        {/* <FbLogin /> */}
                        {/* <GoogleLogin /> */}
                    </Form>
                </div>
            </Container>

            <Modal show={modalShow} onHide={closeModal}>
                {activeKey === SIGN_UP_KEY ? (
                    <SignupModal closeModal={closeModal} />
                ) : (
                    <MocksModal closeModal={closeModal} />
                )}
            </Modal>
        </>
    );
};
