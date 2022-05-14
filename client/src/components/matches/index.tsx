import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { useMatches } from './provider';

const Matches: React.FC = () => {
    const { matches } = useMatches();

    return (
        <>
            <ListGroup variant='flush'>
                {matches.map((match: { id: string; name: string }) => {
                    return (
                        <ListGroup.Item key={match.id}>
                            {match.name}
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </>
    );
};

export default Matches;
