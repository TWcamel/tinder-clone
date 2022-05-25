import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import AuthService from '../../services/authService';
import { FbLogin } from './FbLogin';
import { GoogleLogin } from './GoogleLogin';
import { v4 as uuidV4 } from 'uuid';
import useLocalStorage from '../../hooks/useLocalStorage';

export const Login: React.FC<{
    onUserIdSubmit: (userId: string) => void;
    onUserNameSubmit: (userName: string) => void;
}> = ({ onUserIdSubmit, onUserNameSubmit }) => {
    //TODO: make register independent from login component

    useEffect(() => {
        (async () => {
            const isLoggedIn: boolean = await checkLogin();
            if (!isLoggedIn) userRegister();
        })();
    }, []);

    const nameRef = React.useRef<HTMLInputElement>(null);
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    const signBtnRef = React.useRef<HTMLButtonElement>(null);

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
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const name = nameRef.current!.value;
        nameRef.current!.parentElement!.hidden = false;
        signBtnRef.current!.hidden = false;

        if (
            name &&
            email &&
            password &&
            name.length > 0 &&
            email.length > 0 &&
            password.length > 0
        ) {
            const res = await AuthService.register(name, email, password);
            return res;
        }
    };

    return (
        <>
            <Container
                className='align-items-center d-flex'
                style={{ height: '100vh' }}
            >
                <Form className='w-100'>
                    <Form.Group hidden={true}>
                        <Form.Label className='form-fields'>Name</Form.Label>
                        <Form.Control
                            id='form-name'
                            type='text'
                            placeholder='My name is helloworld :)'
                            ref={nameRef}
                        />
                    </Form.Group>
                    <Form.Group className='mt-2'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='example@gmail.com'
                            required={true}
                            ref={emailRef}
                        />
                    </Form.Group>
                    <Form.Group className='mt-2'>
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
                        id='register-button'
                        className='mt-2 me-2 rounded'
                        variant='secondary'
                        type='submit'
                        onClick={handleSubmit}
                        hidden={true}
                        ref={signBtnRef}
                    >
                        Sign Up
                    </Button>
                    <FbLogin />
                    <GoogleLogin />
                </Form>
            </Container>
        </>
    );
};
