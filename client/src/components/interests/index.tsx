import React from 'react';
import { Image, Button, Form } from 'react-bootstrap';
import useLocalStorage from '../../hooks/useLocalStorage';
import { deleteLocalStorage } from '../../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

declare global {
    interface FileList {
        forEach(callback: (f: File) => void): void;
        map(callback: (f: File) => void): File[];
    }
}

export const ImageUploader: React.FC<{
    onParentSubmit: (imgs: any) => void;
}> = ({ onParentSubmit }) => {
    const [images, setImages] = React.useState<Blob[]>([]);

    React.useEffect(() => {
        onParentSubmit(images);
    }, [images, onParentSubmit]);

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files: any = e.target.files?.length ? e.target.files : [];
        setImages([...files]);
    };

    return (
        <Form.Group>
            <Form.Control
                type='file'
                multiple
                onChange={onImageChange}
                accept='image/*'
            />
            {images.map((image: any) => (
                <Image
                    src={URL.createObjectURL(image)}
                    key={uuidv4(image.name)}
                    className='rounded-2 mt-2'
                    width='100%'
                    height='auto'
                />
            ))}
        </Form.Group>
    );
};

export default ImageUploader;
