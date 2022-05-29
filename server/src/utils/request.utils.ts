import axois from 'axios';
const putRequest = async (url: string, image: Blob) => {
    try {
        return await axois.put(`${url}`, image, {
            headers: { 'Content-Type': 'image/jpeg' },
        });
    } catch (error) {
        console.log(error);
    }
};

export { putRequest };
