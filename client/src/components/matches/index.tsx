import React from 'react';
import { ListGroup, Image } from 'react-bootstrap';
import { useMatches } from './provider';

interface IMatch {
    id: string;
    name: string;
    isSelected: boolean;
}

const Matches: React.FC = () => {
    const { matches, selectMatchIndex } = useMatches();

    return (
        <ListGroup variant='flush'>
            {matches.map((match: IMatch, idx: number) => {
                return (
                    <ListGroup.Item
                        onClick={() => selectMatchIndex(idx)}
                        action
                        key={match.id}
                        active={match.isSelected}
                    >
                        <Image
                            src='https://via.placeholder.com/150'
                            roundedCircle
                            width='33'
                        />
                        {match.id} - {match.name}
                    </ListGroup.Item>
                );
            })}
        </ListGroup>
    );
};

export default Matches;
