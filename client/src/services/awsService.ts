import { Api } from './api';
import Config from '../config/config';

const AwsService = {
    uploadImagesToS3Bucket: async (formData: any) => {
        console.log(formData);
        const response = await Api.s3Request('aws/s3', formData);
        return response.data;
    },
};

export default AwsService;
