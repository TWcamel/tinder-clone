import { Api } from './api';
import { clearAllLocalStorage } from '../utils/localStorage';
import { refreshPage } from '../utils/page';

const AuthService = {
    logout: async () => {
        Api.delete('user/logout');
        AuthService.clearCookie();
        clearAllLocalStorage();
        refreshPage();
    },
    login: async (email: string, password: string) => {
        const res = await Api.patch('user/login', {
            email: email,
            password: password,
        });
        return res?.data.ok ? res.data.data : null;
    },

    loginWithFacebook: async () => {
        const res = await Api.get('user/login/facebook');
    },

    loginWithGoogle: async () => {
        const res = await Api.get('user/login/google');
    },

    register: async (name: string, email: string, password: string) => {
        const res = await Api.post('user', {
            name: name,
            email: email,
            password: password,
        });
        return res?.data.ok ? res.data.data : null;
    },

    verify: async (token: string) => {
        try {
            const res = await Api.patch(
                'user/login',
                {},
                {
                    Authorization: `Bearer ${token}`,
                },
            );
            if (res?.data.ok) return res.data;
            else {
                AuthService.clearCookie();
                return false;
            }
        } catch (error) {
            return false;
        }
    },

    clearCookie: () => {
        document.cookie =
            'service_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; ';
    },

    getBearerToken: () => {
        const cookies = document.cookie.split(';');
        const bearerToken = cookies.find((cookie) =>
            cookie.trim().startsWith('service_token='),
        );
        if (bearerToken) {
            return bearerToken.split('=')[1];
        } else {
            return '';
        }
    },
};

export default AuthService;
