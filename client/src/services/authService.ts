import { Api } from './api';

export const AuthService = {
    login: async (email: string, password: string) => {
        const res = await Api.patch('user/login', {
            email: email,
            password: password,
        });
        return res?.data.ok ? res.data.data : null;
    },

    loginWithFacebook: async () => {
        const res = await Api.get('user/login/facebook');
        console.log(res);
    },

    loginWithGoogle: async () => {
        const res = await Api.get('user/login/google');
        console.log(res);
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
};
