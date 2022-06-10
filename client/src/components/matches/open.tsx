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
import NextSwipeCountDownTimer from '../timer/';
import moment from 'moment';
import { getLocalTimeBrief } from '../../utils/time';

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
    const [swiperNextTime, setSwiperNextTime] = React.useState({
        canSwipe: true,
        time: null,
    });
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
        const getPeople = async () => {
            const res = await SwipeService.getSwipes(id);
            if (res.ok && res.data?.nextTime) {
                setSwiperNextTime({
                    canSwipe: true,
                    time: res.data.nextTime,
                });
                toast.info(
                    `You can swipe again at ${getLocalTimeBrief(
                        res.data.nextTime,
                    )}`,
                );
            } else if (res.error) {
                toast.error(res.message);
            }

            if (res.ok && res.data.length > 0) {
                const { data } = res;
                setPeople(data);
                Array.prototype.forEach.call(data, async (swipe: any) => {
                    const base64 = await AwsService.getAvatarFromS3(
                        swipe.avatar,
                    );
                    setImgs(
                        (
                            imgs: {
                                email: string;
                                url: string;
                            }[],
                        ) => {
                            if (imgs.find((img) => img.email === swipe.email)) {
                                return imgs;
                            }
                            return [
                                ...imgs,
                                { email: swipe.email, url: base64 },
                            ];
                        },
                    );
                });
            }
        };
        getPeople();
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
                    boxShadow: '20px 20px 50px #4DE8F4, -20px 0 50px #FD3E3E',
                    backgroundColor: '#f5f5f5',
                    borderRadius: '30px',
                }}
            >
                <div
                    className={'d-flex top-0 position-absolute w-100 '}
                    style={{
                        justifyContent: 'space-around',
                        borderRadius: '10px',
                        padding: '1rem',
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
                            zIndex: 1,
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
                            zIndex: 1,
                        }}
                        onClick={() => {
                            setModalShow(true);
                            setActiveKey(USER_INTERESTS_KEY);
                        }}
                    >
                        <SettingsIcon fontSize='large' />
                    </IconButton>
                </div>
                {swiperNextTime.canSwipe ? (
                    <div
                        className={
                            'd-flex align-items-center justify-content-center h-100'
                        }
                    >
                        <NextSwipeCountDownTimer
                            passInTime={moment(swiperNextTime.time).toDate()}
                        />
                    </div>
                ) : (
                    people.map((person: any, idx: number) => {
                        const _img = imgs.find(
                            (img) => img.email === person.email,
                        );
                        return (
                            <Swiper
                                key={idx}
                                className={
                                    'd-flex align-items-center justify-content-center'
                                }
                                style={{
                                    height: '100%',
                                }}
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
                                            className='text-white'
                                            style={{
                                                backgroundColor: 'none',
                                                width: '100%',
                                                maxWidth: '377px',
                                                height: '100%',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {imgs != null &&
                                            imgs.length &&
                                            !arrayIsEmpty(imgs) &&
                                            _img ? (
                                                <Card.Img
                                                    alt={`${uuidv4()}`}
                                                    src={_img.url}
                                                    style={{
                                                        borderRadius: '3px',
                                                        border: '1px solid white',
                                                        width: '377px',
                                                        height: '477px',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            ) : (
                                                <LoadingEffect />
                                            )}
                                            <Card.ImgOverlay
                                                style={{
                                                    backgroundColor:
                                                        'rgba(0,0,0,0.3)',
                                                }}
                                            >
                                                <Card.Title>
                                                    {person.name}
                                                </Card.Title>
                                                <Card.Text>
                                                    {person.bio}
                                                </Card.Text>
                                            </Card.ImgOverlay>
                                        </Card>
                                    </div>
                                }
                            />
                        );
                    })
                )}
                <div
                    className={'d-flex bottom-0 position-absolute w-100 '}
                    style={{
                        borderRadius: '10px',
                        justifyContent: 'space-around',
                        padding: '1rem',
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
