import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ImageUploader from '../images/';
import SignupService from '../../services/signupService';
import AwsService from '../../services/awsService';
import { toast } from 'react-toastify';
import { v4 as uuidv4 } from 'uuid';
import useLocalStorage from '../../hooks/useLocalStorage';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const [age, setAge] = React.useState(-1);
    const [gender, setGender] = React.useState('');
    const [imgs, setImgs] = React.useState();
    const [loc, setLoc] = React.useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        (await userRegister()) && (await uploadImg()) && closeModal();
    };

    const userRegister = async () => {
        if (
            !nameRef?.current?.value ||
            !emailRef?.current?.value ||
            !passwordRef?.current?.value ||
            gender.length === 0 ||
            age === -1 ||
            loc === ''
        ) {
            toast.error('Please fill all fields');
            return false;
        } else {
            const user = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                age: age,
                gender: gender,
                location: loc,
            };
            const res = await SignupService.signup(user);
            if (res.ok) {
                toast.success(`${res.data.email} signed up !`);
                return true;
            } else {
                toast.error(`Something went wrong: ${res.message}`);
                return false;
            }
        }
    };

    const uploadImg = async () => {
        const promise = new Promise((resolve, reject) => {
            Array.prototype.forEach.call(imgs, async (img: File) => {
                const fileReader = new FileReader();
                fileReader.readAsDataURL(img);
                fileReader.onload = async () => {
                    const base64 = fileReader.result as string;
                    const formData = {
                        user: ((): any => emailRef.current?.value)(),
                        image: base64,
                        img_name: uuidv4(),
                    };
                    const res = await AwsService.uploadImagesToS3Bucket(
                        formData,
                    );
                    if (res.ok) {
                        resolve('done');
                    } else {
                        toast.error(
                            `Error uploading image: ${res?.message || res}`,
                        );
                    }
                };
            });
        });
        return promise
            .then(() => {
                toast.success('Images uploaded successfully');
            })
            .then(() => {
                return true;
            });
    };

    const updateAge = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setAge(parseInt(e.target.value, 10));
    };

    const updateGender = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setGender(e.target.value);
    };

    return (
        <>
            <Modal.Header closeButton>
                <h3>Become a member</h3>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type='text'
                            required
                            placeholder='Your Name'
                            className='mb-2'
                            ref={nameRef}
                        />
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='example@gmail.com'
                            required
                            className='mb-2'
                            ref={emailRef}
                        />
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='********'
                            className='mb-2'
                            ref={passwordRef}
                        />
                        <Form.Label>Gender</Form.Label>
                        <Form.Check
                            type='radio'
                            label='Male'
                            value='M'
                            name='user-gender'
                            onChange={updateGender}
                        />
                        <Form.Check
                            type='radio'
                            label='Female'
                            value='F'
                            name='user-gender'
                            className='mb-2'
                            onChange={updateGender}
                        />
                        <Form.Label>Age: {age === -1 ? '?' : age}</Form.Label>
                        <Form.Range onChange={updateAge} min={18} max={60} />
                        <Form.Label>Location</Form.Label>
                        <Form.Control
                            as='select'
                            value={loc}
                            onChange={(e: any) => setLoc(e.target.value)}
                            className='mb-2'
                        >
                            <option value='Taipei'>Taipei</option>
                            <option value='New Taipei'>New Taipei</option>
                            <option value='Taoyuan'>Taoyuan</option>
                            <option value='Hsinchu'>Hsinchu</option>
                            <option value='Miaoli'>Miaoli</option>{' '}
                            <option value='Taichung'>Taichung</option>
                            <option value='Changhua'>Changhua</option>
                            <option value='Nantou'>Nantou</option>
                            <option value='Yunlin'>Yunlin</option>
                            <option value='Chiayi'>Chiayi</option>
                            <option value='Tainan'>Tainan</option>
                            <option value='Kaohsiung'>Kaohsiung</option>
                            <option value='Pingtung'>Pingtung</option>
                            <option value='Taitung'>Taitung</option>
                            <option value='Hualien'>Hualien</option>
                            <option value='Keelung'>Keelung</option>
                            <option value='Kinmen'>Kinmen</option>
                            <option value='Lienchiang'>Lienchiang</option>
                        </Form.Control>
                        <Form.Label>Upload Images</Form.Label>
                        <ImageUploader onParentSubmit={setImgs} />
                    </Form.Group>
                    <Button type='submit' className='mt-2'>
                        Signup
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SignupModal;
