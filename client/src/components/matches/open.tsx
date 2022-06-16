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
import MatchesService from '../../services/matchesService';
import AwsService from '../../services/awsService';
import AuthService from '../../services/authService';
import { v4 as uuidv4 } from 'uuid';
import { Api } from '../../services/api';
import LoadingEffect from '../loading/';
import { useMatches } from './provider';
import { arrayIsEmpty, arrayFull } from '../../utils/array';
import NextSwipeCountDownTimer from '../timer/';
import moment from 'moment';
import { getLocalTimeBrief } from '../../utils/time';
import LikesService from '../../services/likesService';
import { refreshPage } from '../../utils/page';

const USER_SETTINGS_KEY = 'userSettings';
const USER_INTERESTS_KEY = 'userInterests';

interface IPerson {
    email: string;
    name: string;
    avatar: string;
    index: number;
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
    const swiperRef = React.useRef(null);
    const [activeKey, setActiveKey]: [string, Function] = React.useState('');
    const userSettingsOpen = activeKey === USER_SETTINGS_KEY;
    const [imgs, setImgs]: [{ email: string; url: string }[], Function] =
        React.useState([]);
    const [swipeCounts, setSwipeCounts] = React.useState(0);

    const checkIfImageStillLeft = async (index: number) => {
        if (index === 0) {
            toast.error('No more matches to like');
            const remainTimes = await MatchesService.getRemainTimeNextSwipe(id);

            if (remainTimes.ok) {
                showSwiperNextTime(remainTimes.data.nextTime);
            }
            return false;
        }
        await removeContainer(index);
        return true;
    };

    const removeContainer = async (index: number) => {
        const btnRef: any = swiperBtnsRef.current;
        const swiperImgsContainer = btnRef.previousElementSibling.parentElement;
        const swiperImgs = Array.prototype.filter.call(
            swiperImgsContainer.children,
            (container: any) => container.id.length === 0,
        );
        const size = swiperImgs.length;
        if (size > 0) {
            swiperImgs[index].remove();
        }
        setSwipeCounts(size - 1);
    };

    const handleSwipe = async (e: string, p: IPerson) => {
        if (await checkIfImageStillLeft(swipeCounts - 1)) {
            userSwipBehavoir(id, p, e);
        }
    };

    const handleBtnClick = async (e: string) => {
        if (await checkIfImageStillLeft(swipeCounts - 1)) {
            userSwipBehavoir(id, people[swipeCounts], e);
        }
    };

    const showSwiperNextTime = (_time: any) => {
        setSwiperNextTime({
            canSwipe: false,
            time: _time,
        });
        toast.info(
            `Hits swipe limits today. You can swipe again tomorrow at ${getLocalTimeBrief(
                _time,
            )} :)`,
            {
                toastId: 'swipe-timer',
                theme: 'colored',
                autoClose: 15000,
            },
        );
    };

    const getPeopleImages = (ppl: any) => {
        Array.prototype.forEach.call(ppl, async (swipe: any) => {
            const base64 = await AwsService.getAvatarFromS3(swipe.avatar);
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
                    return [...imgs, { email: swipe.email, url: base64 }];
                },
            );
        });
    };

    const getPeople = React.useCallback(async () => {
        const res = await SwipeService.getSwipes(id);
        if (res.ok && res.data?.nextTime) {
            showSwiperNextTime(res.data.nextTime);
        } else if (res.ok && res.data.length > 0) {
            const { data } = res;
            setPeople(data);
            getPeopleImages(data);
            setSwipeCounts(data.length);
        } else if (res.error) {
            toast.error(res.message);
        }
    }, [id]);

    React.useEffect(() => {
        getPeople();
    }, [id, getPeople]);

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
                <>
                    {!swiperNextTime.canSwipe ? (
                        <div
                            className={
                                'd-flex align-items-center justify-content-center h-100'
                            }
                        >
                            <div>
                                You can swipe again
                                <NextSwipeCountDownTimer
                                    passInTime={moment(
                                        swiperNextTime.time,
                                    ).toDate()}
                                />
                            </div>
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
                                        position: 'relative',
                                        top: '50%',
                                        objectFit: 'cover',
                                    }}
                                    onSwipe={async (e: string) => {
                                        if (_img)
                                            await handleSwipe(e, {
                                                email: person.email,
                                                name: person.name,
                                                avatar: _img.url,
                                                index: idx,
                                            });
                                    }}
                                    detectingSize={50}
                                    contents={
                                        <div
                                            ref={swiperRef}
                                            id={`swiper-container-${idx}`}
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
                                                            height: '577px',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                ) : (
                                                    <div
                                                        style={{
                                                            width: '377px',
                                                            height: '577px',
                                                            backgroundColor:
                                                                '#f5f5f5',
                                                            borderRadius: '3px',
                                                            border: '1px solid white',
                                                            justifyContent:
                                                                'center',
                                                            alignItems:
                                                                'center',
                                                            display: 'flex',
                                                        }}
                                                    >
                                                        <LoadingEffect
                                                            size={'120px'}
                                                        />
                                                    </div>
                                                )}
                                                <Card.ImgOverlay
                                                    style={{
                                                        backgroundColor:
                                                            'rgba(0,0,0,0.3)',
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            position:
                                                                'absolute',
                                                            bottom: 0,
                                                            width: '277px',
                                                            padding: '1rem',
                                                        }}
                                                    >
                                                        <Card.Title>
                                                            {person.name}
                                                        </Card.Title>
                                                        <Card.Text>
                                                            {person.bio}
                                                        </Card.Text>
                                                    </div>
                                                </Card.ImgOverlay>
                                            </Card>
                                        </div>
                                    }
                                />
                            );
                        })
                    )}
                </>
                <div
                    className={'d-flex bottom-0 position-absolute w-100 '}
                    style={{
                        borderRadius: '10px',
                        justifyContent: 'space-around',
                        padding: '1rem',
                    }}
                    id={'swiper-btns-footer'}
                    ref={swiperBtnsRef}
                >
                    <IconButton
                        className='close mt-2'
                        style={{
                            background: '#fcfafa',
                            color: 'grey',
                            boxShadow:
                                '20px 20px 30px #bebebe, 20px 20px 60px #ffffff',
                        }}
                        id={'swiper-btns-footer-dislike-btn'}
                        onClick={() => handleBtnClick('left')}
                    >
                        <CloseIcon fontSize='large' />
                    </IconButton>
                    <IconButton
                        className='favorite'
                        style={{
                            background: '#fcfafa',
                            color: 'red',
                            boxShadow:
                                '20px 20px 30px #bebebe, 20px 20px 60px #ffffff',
                        }}
                        onClick={() => handleBtnClick('right')}
                        id={'swiper-btns-footer-like-btn'}
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
