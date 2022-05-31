import React from 'react';
import { Image, Button, CloseButton, Card } from 'react-bootstrap';
import { Swiper } from '../swiper/';
import axios from 'axios';
import CloseIcon from '@material-ui/icons/Close';
import FavoriteIcon from '@material-ui/icons/Favorite';
import IconButton from '@material-ui/core/IconButton';

const OpenMatches: React.FC = () => {
    const [people, setPeople] = React.useState([]);
    const handleSwipe = (e: any) => {
        console.log(e);
    };

    React.useEffect(() => {
        axios
            .get(
                'https://api.themoviedb.org/3/trending/all/day?api_key=360a9b5e0dea438bac3f653b0e73af47&language=en-US',
            )
            .then((res) => setPeople(res.data.results.reverse()));
    }, []);

    //Bug: UI improve
    return (
        <div
            className={'m-4 align-items-center justify-content-center'}
            style={{
                position: 'relative',
                width: '100%',
            }}
        >
            <h1>Is it a match?</h1>
            {people.map((person: any) => (
                <Swiper
                    onSwipe={handleSwipe}
                    contents={
                        <Card
                            className='bg-dark text-white'
                            style={{
                                position: 'absolute',
                            }}
                        >
                            <Card.Img
                                src={`https://image.tmdb.org/t/p/w500/${person.poster_path}`}
                                alt='Card image'
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                }}
                            />
                            <Card.ImgOverlay>
                                <Card.Title>{person.title}</Card.Title>
                                <Card.Text>{person.overview}</Card.Text>
                            </Card.ImgOverlay>
                        </Card>
                    }
                />
            ))}
            <div
                style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    width: '80%',
                    justifyContent: 'space-between',
                    display: 'flex',
                }}
            >
                <IconButton
                    className='close'
                    style={{
                        background: '#fcfafa',
                        color: 'red',
                        boxShadow:
                            '20px 20px 30px #bebebe, -20px -20px 60px #ffffff',
                    }}
                >
                    <CloseIcon fontSize='large' />
                </IconButton>
                <IconButton className='favorite'>
                    <FavoriteIcon fontSize='large' />
                </IconButton>
            </div>
        </div>
    );
};
export default OpenMatches;
