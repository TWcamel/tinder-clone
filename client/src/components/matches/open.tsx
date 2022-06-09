import React from 'react';
import { Image, Button, CloseButton, Card, Modal } from 'react-bootstrap';
import { Swiper } from '../swiper/';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import AccountBoxRounded from '@material-ui/icons/AccountBoxRounded';
import SettingsIcon from '@material-ui/icons/Settings';
import { toast } from 'react-toastify';
import InterestsModal from '../modals/InterestsModal';
import Settings from '../modals/SettingsModal';
import SwipeService from '../../services/swipeService';
import AwsService from '../../services/awsService';
import AuthService from '../../services/authService';
import { v4 as uuidv4 } from 'uuid';
import { Api } from '../../services/api';
import LoadingEffect from '../loading/';
import { useMatches } from './provider';
import { arrayIsEmpty } from '../../utils/array';

const USER_SETTINGS_KEY = 'userSettings';
const USER_INTERESTS_KEY = 'userInterests';

interface IPerson {
    email: string;
    name: string;
    avatar: string;
}

const OpenMatches: React.FC<{ id: string }> = ({ id }) => {
    const { userSwipBehavoir } = useMatches();
    const [modalShow, setModalShow] = React.useState(false);
    const [people, setPeople] = React.useState([]);
    const swiperBtnsRef = React.useRef(null);
    const [activeKey, setActiveKey]: [string, Function] = React.useState('');
    const userSettingsOpen = activeKey === USER_SETTINGS_KEY;
    const [imgs, setImgs]: [{ email: string; url: string }[], Function] =
        React.useState([]);

    const handleSwipe = (e: string, p: IPerson) => {
        userSwipBehavoir(id, p, e);
    };

    const handleBtnClick = (e: any) => {
        const current: any = swiperBtnsRef.current;
        const imgContainer: any = current.previousElementSibling;
        if (imgContainer.id !== 'swiper-btns-header') {
            return imgContainer.remove();
        }
        //TODO: count down 24hrs later for more likes
        return toast.error('No more matches to like');
    };

    React.useEffect(() => {
        axios
            .get(`${Api.backendUrl}/likes/${id}`, {
                headers: {
                    Authorization: `Bearer ${AuthService.getBearerToken()}`,
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })
            .then((response) => {
                if (response.data.ok) {
                    Array.prototype.forEach.call(
                        response.data.data,
                        (swipe: any) => {
                            AwsService.getAvatarFromS3(swipe.avatar)
                                .then((url: string) => url)
                                .then((url) => {
                                    setImgs(
                                        (
                                            imgs: {
                                                email: string;
                                                url: string;
                                            }[],
                                        ) => {
                                            if (
                                                imgs.find(
                                                    (img) =>
                                                        img.email ===
                                                        swipe.email,
                                                )
                                            ) {
                                                return imgs;
                                            }
                                            return [
                                                ...imgs,
                                                { email: swipe.email, url },
                                            ];
                                        },
                                    );
                                });
                        },
                    );

                    return response.data.data;
                }
                return;
            })
            .then((ppl) => {
                if (ppl) {
                    setPeople(ppl);
                }
            })
            .catch((error) => {
                toast.error(error.response.data.error);
            });
    }, [id]);

    const closeModal = () => {
        setModalShow(false);
    };

    return (
        <>
            <div
                className={'m-4'}
                style={{
                    position: 'relative',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    width: '100%',
                    paddingTop: '10rem',
                }}
            >
                <div
                    className={'d-flex top-0 position-absolute w-100 '}
                    style={{
                        justifyContent: 'space-around',
                        borderRadius: '10px',
                    }}
                    ref={swiperBtnsRef}
                    id={'swiper-btns-header'}
                >
                    <IconButton
                        style={{
                            background: '#fcfafa',
                            color: 'grey',
                            boxShadow:
                                '20px 20px 30px #bebebe, -20px -20px 60px #ffffff',
                        }}
                        onClick={() => {
                            setModalShow(true);
                            setActiveKey(USER_SETTINGS_KEY);
                        }}
                    >
                        <AccountBoxRounded fontSize='large' />
                    </IconButton>
                    <IconButton
                        style={{
                            background: '#fcfafa',
                            color: 'grey',
                            boxShadow:
                                '20px 20px 30px #bebebe, -20px -20px 60px #ffffff',
                        }}
                        onClick={() => {
                            setModalShow(true);
                            setActiveKey(USER_INTERESTS_KEY);
                        }}
                    >
                        <SettingsIcon fontSize='large' />
                    </IconButton>
                </div>
                {people.map((person: any, idx: number) => {
                    const _img = imgs.find((img) => img.email === person.email);
                    return (
                        <Swiper
                            key={idx}
                            onSwipe={(e: string) => {
                                if (_img)
                                    handleSwipe(e, {
                                        email: person.email,
                                        name: person.name,
                                        avatar: _img.url,
                                    });
                            }}
                            detectingSize={50}
                            contents={
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        textAlign: 'center',
                                        position: 'absolute',
                                    }}
                                >
                                    <Card
                                        border='warning'
                                        style={{
                                            backgroundColor: '#fcfafa',
                                            width: '100%',
                                            maxWidth: '377px',
                                        }}
                                    >
                                        <Card.Header>{person.name}</Card.Header>
                                        <Card.Body>
                                            {imgs != null &&
                                            imgs.length &&
                                            !arrayIsEmpty(imgs) &&
                                            _img ? (
                                                <Card.Img
                                                    alt={`${uuidv4()}`}
                                                    src={_img.url}
                                                    style={{
                                                        borderRadius: '10px',
                                                        border: '1px solid white',
                                                        height: '100%',
                                                    }}
                                                />
                                            ) : (
                                                <LoadingEffect />
                                            )}
                                        </Card.Body>
                                        <Card.Text>{person.bio}</Card.Text>
                                    </Card>
                                </div>
                            }
                        />
                    );
                })}
                <div
                    className={'d-flex bottom-0 position-absolute w-100 '}
                    style={{
                        borderRadius: '10px',
                        justifyContent: 'space-around',
                    }}
                    ref={swiperBtnsRef}
                >
                    <IconButton
                        className='close mt-2'
                        style={{
                            background: '#fcfafa',
                            color: 'red',
                            boxShadow:
                                '20px 20px 30px #bebebe, 20px 20px 60px #ffffff',
                        }}
                        onClick={handleBtnClick}
                    >
                        <CloseIcon fontSize='large' />
                    </IconButton>
                    <IconButton
                        className='favorite'
                        style={{
                            background: '#fcfafa',
                            color: 'green',
                            boxShadow:
                                '20px 20px 30px #bebebe, 20px 20px 60px #ffffff',
                        }}
                        onClick={handleBtnClick}
                    >
                        <FavoriteIcon fontSize='large' />
                    </IconButton>
                </div>
            </div>

            <Modal show={modalShow} onHide={closeModal}>
                {userSettingsOpen ? (
                    <Settings id={id} closeModal={closeModal} />
                ) : (
                    <InterestsModal id={id} closeModal={closeModal} />
                )}
            </Modal>
        </>
    );
};

export default OpenMatches;
