import { Api } from './api';

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
};

export default AwsService;
