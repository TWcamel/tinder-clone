import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import ImageUploader from '../images/';
import useLocalStorage from '../../hooks/useLocalStorage';
import SignupService from '../../services/signupService';

const SignupModal: React.FC<any> = ({
    closeModal,
}: {
    closeModal: () => void;
}) => {
    const [imgUrls] = useLocalStorage('imgs');
    const [age, setAge] = React.useState(-1);
    const [gender, setGender] = React.useState('');
    const [imgs, setImgs] = React.useState([]);

    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    const updateAge = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAge(parseInt(e.target.value, 10));
    };

    const updateGender = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGender(e.target.value);
    };

    React.useEffect(() => {
        setImgs(imgUrls);
    }, [imgUrls]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (
            !nameRef?.current?.value ||
            !emailRef?.current?.value ||
            !passwordRef?.current?.value ||
            gender.length === 0 ||
            age === -1 ||
            imgUrls.length === 0
        ) {
            //TODO: make an toast fail message
            alert('Please fill out all fields');
            return;
        } else {
            const user = {
                name: nameRef.current.value,
                email: emailRef.current.value,
                password: passwordRef.current.value,
                age: age,
                gender: gender,
                image: imgUrls,
            };
            const res = SignupService.signup(user);
            console.log(res);
        }

        // let formName = ['name', 'email', 'password', 'gender', 'avatar'];
        // let formData: Object[] = [];
        // if (formRef.current)
        //     Array.prototype.forEach.call(
        //         formRef.current,
        //         (element: any, idx: number) => {
        //             if (
        //                 element.type !== 'file' &&
        //                 element.type !== 'submit' &&
        //                 element.type !== 'radio'
        //             ) {
        //                 formData.push({
        //                     k: formName[idx],
        //                     v: element.checked ? element.value : '',
        //                 });
        //             } else if ((idx === 3 || idx === 4) && element.checked) {
        //                 formData.push({
        //                     k: formName[3],
        //                     v: element.value,
        //                 });
        //             } else if (element.type === 'file') {
        //                 formData.push({
        //                     k: formName[4],
        //                     v: imgs,
        //                 });
        //             }
        //         },
        //     );
    };

    return (
        <>
            <Modal.Header closeButton>Signup</Modal.Header>
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
                        <Form.Label>Age: {age === -1 ? '50' : age}</Form.Label>
                        <Form.Range onChange={updateAge} />
                        <Form.Label>Upload Images</Form.Label>
                        <ImageUploader />
                    </Form.Group>
                    <Button type='submit' className='mt-2'>
                        Create
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default SignupModal;
