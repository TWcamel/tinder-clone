import React from 'react';
import { Image, Button, Form } from 'react-bootstrap';
import useLocalStorage from '../../hooks/useLocalStorage';
import { deleteLocalStorage } from '../../utils/localStorage';

declare global {
    interface FileList {
        forEach(callback: (f: File) => void): void;
        map(callback: (f: File) => void): File[];
    }
}

export const ImageUploader = () => {
    const [images, setImages] = React.useState<Blob[]>([]);
    const [imageUrls, setImageUrls] = useLocalStorage('imgs', []);

    React.useEffect(() => {
        deleteLocalStorage('imgs');
        if (images.length > 0) {
            setImageUrls(images.map((image) => URL.createObjectURL(image)));
        }
    }, [images, setImageUrls]);

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = e.target.files?.length ? e.target.files : [];
        setImages([...files]);
    };

    return (
        <>
            <Form.Group>
                <Form.Control
                    type='file'
                    multiple
                    onChange={onImageChange}
                    accept='image/*'
                />
                {imageUrls.map((imageSrc: string) => (
                    <Image
                        src={imageSrc}
                        key={imageSrc}
                        className='rounded-2 mt-2'
                        width='100%'
                        height='auto'
                    />
                ))}
            </Form.Group>
        </>
    );
};

export default ImageUploader;
