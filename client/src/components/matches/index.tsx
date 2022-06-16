import React from 'react';
import { ListGroup, Image, Form } from 'react-bootstrap';
import { useMatches } from './provider';
import { useConversations } from '../conversations/provider';
import { refreshPage } from '../../utils/page';

interface IMatch {
    id: string;
    name: string;
    isSelected: boolean;
    avatar: string;
}

const CONVERSATIONS_KEY = 'conversations';
const MATCHES_KEY = 'matches';

export const Matches: React.FC<{
    onSidebarSelcet: (tab: string) => void;
}> = ({ onSidebarSelcet }) => {
    const { matches, selectMatchIndex } = useMatches();
    const { createConversation } = useConversations();

    const handleOnSelect = (index: number, id: string) => {
        selectMatchIndex(index+1);
        onSidebarSelcet(CONVERSATIONS_KEY);
        createConversation([id]);
    };

    return (
        <ListGroup variant='flush'>
            {matches.map((match: IMatch, idx: number) => {
                return (
                    <ListGroup.Item
                        onClick={() => {
                            handleOnSelect(idx, match.id);
                        }}
                        action
                        key={match.id}
                        active={match.isSelected}
                        className='d-flex align-items-center '
                        style={{
                            cursor: 'pointer',
                            borderRadius: '0',
                            borderBottom: '1px solid rgb(193 193 193)',
                            padding: '0.75rem 1.25rem',
                            backgroundColor: match.isSelected
                                ? 'rgb(233 81 113)'
                                : 'rgb(242 242 242)',
                        }}
                    >
                        <Image
                            src={match.avatar}
                            roundedCircle
                            style={{
                                borderRadius: '50%',
                                objectFit: 'cover',
                                width: '3rem',
                                height: '3rem',
                                marginRight: '1rem',
                                border: '1px solid rgb(193 193 193)',
                            }}
                        />
                        {match.name}
                    </ListGroup.Item>
                );
            })}
        </ListGroup>
    );
};

export default Matches;
