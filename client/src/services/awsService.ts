import { Api } from './api';
import axios from 'axios';

const AwsService = {
    uploadImagesToS3Bucket: async (formData: any) => {
        try {
            const response = await Api.s3Request('aws/s3', formData);
            return response.data;
        } catch (error: any) {
            return error.response.data;
        }
    },

    downloadAvatars: async (email: string) => {
        const response = await Api.s3RequestGet('aws/s3', {
            user_email: email,
        });
        return response.data;
    },

    getAvatarFromS3: async (url: string) => {
        const response = await axios.get(url);
        return response.data;
    },
};

export default AwsService;
