import { Api } from './api';

const AwsService = {
    //TODO: implement this one
    uploadImagesToS3Bucket: async (imgs: string[]) => {
        const payload = JSON.stringify({
            imgs: imgs,
        });
        const response = await Api.s3Request(`likes`, payload);
        return response.data;
    },
};

export default AwsService;
