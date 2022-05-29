import axois from 'axios';
const apigwPutRequest = async (url: string, image: Blob) => {
    return await axois.put(`${url}`, image, {
        headers: { 'Content-Type': 'image/jpeg' },
    });
};

const apigwGetRequest = async (url: string) => {
    return await axois.get(`${url}`);
};

export { apigwGetRequest, apigwPutRequest };
