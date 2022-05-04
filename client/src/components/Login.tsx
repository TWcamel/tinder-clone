import React, { useState, useEffect } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import { RequestApi } from '../utils/Request';
import axios from 'axios';

export const Login: React.FC = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    //TODO: FB and Google login
    useEffect(() => {
        (async () => {
            await checkLogin();
        })();
    }, []);

    const nameRef = React.useRef<HTMLInputElement>(null);
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

    const checkLogin = async (): Promise<void> => {
        const serviceToken = document.cookie.split('=')[1];
        const api = `${RequestApi.backendBaseUrl()}/api/user/login`;
        const res = await axios({
            method: 'PATCH',
            url: api,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${serviceToken}`,
            },
            withCredentials: true,
        });
        res.data.ok ? setIsLoggedIn(true) : setIsLoggedIn(false);
    };

    const userLogin = async () => {
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const api = `${RequestApi.backendBaseUrl()}/api/user/login`;

        if (email && password && email.length > 0 && password.length > 0) {
            const res = await axios({
                method: 'PATCH',
                url: api,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    email: email,
                    password: password,
                },
                withCredentials: true,
            });

            res.data.ok ? setIsLoggedIn(true) : setIsLoggedIn(false);
        }
    };

    const fbLogin = async () => {
        const api = `${RequestApi.backendBaseUrl()}/api/user/login/facebook`;
        const res: Response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
        res.ok ? console.log('ok') : console.log('not ok');
    };

    const googleLogin = async () => {
        const api = `${RequestApi.backendBaseUrl()}/api/user/login/google`;
        const res: Response = await fetch(api, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((res) => res.json())
            .then((res) => res);
        res.ok ? console.log('ok') : console.log('not ok');
    };

    const userRegister = async () => {
        nameRef.current!.hidden = false;
        const name = nameRef.current!.value;
        const email = emailRef.current!.value;
        const password = passwordRef.current!.value;
        const api = `${RequestApi.backendBaseUrl()}/api/user`;

        if (
            name &&
            email &&
            password &&
            name.length > 0 &&
            email.length > 0 &&
            password.length > 0
        ) {
            const res: Response = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            })
                .then((res) => res.json())
                .then((res) => res);
            console.log(res);
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
                    <Form.Group>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            id='form-name'
                            type='text'
                            placeholder='My name is helloworld :)'
                            hidden={true}
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
                        className='mt-2 rounded'
                        variant='secondary'
                        type='submit'
                        onClick={handleSubmit}
                    >
                        Sign Up
                    </Button>
                </Form>
            </Container>
        </>
    );
};
