import React from 'react';
import { Button } from 'react-bootstrap';
import AuthService from '../../services/authService';

export const GoogleLogin: React.FC = () => {
    const handleClick = (
        e:
            | React.FormEvent<HTMLFormElement>
            | React.MouseEvent<HTMLButtonElement>,
    ) => {
        e.preventDefault();
        AuthService.loginWithGoogle();
    };

    return (
        <>
            <Button
                id='google-login-button'
                variant='danger'
                className='mt-2 me-2 rounded'
                type='submit'
                disabled={false}
                onClick={handleClick}
            >
                google login
            </Button>
        </>
    );
};
