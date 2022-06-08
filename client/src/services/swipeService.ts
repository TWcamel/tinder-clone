import { Api } from './api';
import AuthService from './authService';
import AwsService from './awsService';

const SwipeService = {
    getSwipes: async (email: string) => {
        const response = await Api.get(`likes/${email}`, null, {
            Authorization: `Bearer ${AuthService.getBearerToken()}`,
        });

        if (response.data.ok) {
            const arr = JSON.parse(JSON.stringify(response.data.data));

            let imgArr = new Array<string>();

            Array.prototype.forEach.call(arr, (swipe: any) => {
                AwsService.getAvatarFromS3(swipe.avatar)
                    .then((url: string) => url)
                    .then((url) => {
                        Array.prototype.push.call(imgArr, {
                            email: swipe.email,
                            url,
                        });
                    });
            });

            imgArr = JSON.parse(JSON.stringify(imgArr));

            return { ...response.data, imgs: imgArr };
        }
    },
};

export default SwipeService;
