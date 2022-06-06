import React from 'react';
import { Image, Button, CloseButton, Card, Modal } from 'react-bootstrap';
import { Swiper } from '../swiper/';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import SettingsIcon from '@material-ui/icons/Settings';
import { toast } from 'react-toastify';
import InterestsModal from '../modals/InterestsModal';
import Settings from '../modals/SettingsModal';

const USER_SETTINGS_KEY = 'userSettings';
const USER_INTERESTS_KEY = 'userInterests';

const OpenMatches: React.FC = () => {
    const [modalShow, setModalShow] = React.useState(false);
    const [people, setPeople] = React.useState([]);
    const swiperBtnsRef = React.useRef(null);
    const [activeKey, setActiveKey]: [string, Function] = React.useState('');
    const userSettingsOpen = activeKey === USER_SETTINGS_KEY;

    const handleSwipe = (e: any) => {
        console.log(e);
        //TODO: send swipe to server
    };

    const handleBtnClick = (e: any) => {
        const current: any = swiperBtnsRef.current;
        const imgContainer: any = current.previousElementSibling;
        if (imgContainer.tagName !== 'H1') {
            return imgContainer.remove();
        }
        //TODO: load more people
        return toast.error('No more matches to like');
    };

    React.useEffect(() => {
        axios
            .get(
                'https://api.themoviedb.org/3/trending/all/day?api_key=360a9b5e0dea438bac3f653b0e73af47&language=en-US',
            )
            .then((res) => setPeople(res.data.results.reverse()));
    }, []);

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
                        borderBottom: '1px solid #e5e5e5',
                    }}
                    ref={swiperBtnsRef}
                >
                    <IconButton>
                        <PeopleAltIcon
                            fontSize='large'
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
                        />
                    </IconButton>
                    <IconButton>
                        <SettingsIcon
                            fontSize='large'
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
                        />
                    </IconButton>
                </div>
                {people.map((person: any, idx: number) => (
                    <Swiper
                        onSwipe={handleSwipe}
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
                                    height: '100%',
                                }}
                            >
                                <Card className='bg-dark text-white'>
                                    <Card.Img
                                        src={`https://image.tmdb.org/t/p/w500/${person.poster_path}`}
                                        alt='Card image'
                                        style={{
                                            borderRadius: '10px',
                                            border: '5px solid white',
                                            height: '100%',
                                        }}
                                    />
                                    <Card.ImgOverlay>
                                        <Card.Title>{person.title}</Card.Title>
                                        <Card.Text>{person.overview}</Card.Text>
                                    </Card.ImgOverlay>
                                </Card>
                            </div>
                        }
                    />
                ))}
                <div
                    className={'d-flex bottom-0 position-absolute w-100 '}
                    style={{
                        borderTop: '1px solid #e5e5e5',
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
                    <Settings closeModal={closeModal} />
                ) : (
                    <InterestsModal closeModal={closeModal} />
                )}
            </Modal>
        </>
    );
};
export default OpenMatches;
