import React, { useRef } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import InterestsService from '../../services/interestsService';
import { toast } from 'react-toastify';
import MultiRangeSlider from '../sliders/';

const InterestsModal: React.FC<any> = ({
    closeModal,
    id,
    onUpdated,
}: {
    closeModal: () => void;
    id: string;
    onUpdated: (_isUpdated: boolean) => void;
}) => {
    const [isUpdated, setIsUpdated] = React.useState(false);
    const [ageRange, setAgeRange] = React.useState([0, 0]);
    const [gender, setGender] = React.useState('');
    const [loc, setLoc] = React.useState('Taipei');

    const userRegister = async () => {
        if (gender === '' || ageRange === [0, 0] || loc === '') {
            toast.error('Please fill all fields');
            return false;
        } else {
            const user = {
                ageRange,
                gender,
                location: loc,
            };
            const res = await InterestsService.update(user, id);
            if (res.ok) {
                setIsUpdated(true);
                toast.success(`update successed!`);
                return true;
            } else {
                toast.error(`Something went wrong: ${res.message}`);
                return false;
            }
        }
    };

    React.useEffect(() => {
        if (isUpdated) {
            closeModal();
        }
    }, [isUpdated, closeModal]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        (await userRegister()) && closeModal();
    };

    const updateGender = async (e: React.ChangeEvent<HTMLInputElement>) => {
        setGender(e.target.value);
    };

    return (
        <>
            <Modal.Header>
                <h3>Preferred Settings</h3>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className='mb-2'>
                        <Form.Label>Show Me</Form.Label>
                        <Form.Check
                            type='radio'
                            label='Men'
                            value='M'
                            name='user-gender'
                            onChange={updateGender}
                        />
                        <Form.Check
                            type='radio'
                            label='Women'
                            value='F'
                            name='user-gender'
                            className='mb-2'
                            onChange={updateGender}
                        />
                        <Form.Label>Age Range</Form.Label>
                        <div className='pt-2 pb-3 mb-2'>
                            <MultiRangeSlider onParentSubmit={setAgeRange} />
                        </div>
                        <Form.Label className='mt-3 mb-2'>Location</Form.Label>
                        <Form.Control
                            as='select'
                            value={loc}
                            onChange={(e: any) => setLoc(e.target.value)}
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
                    </Form.Group>
                    <Button type='submit'>Update</Button>
                    <Button
                        className='m-2'
                        variant='danger'
                        onClick={closeModal}
                    >
                        Close
                    </Button>
                </Form>
            </Modal.Body>
        </>
    );
};

export default InterestsModal;
